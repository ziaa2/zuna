Zuna.register({
    id: 'f-transfer',
    title: 'Zuna Transfer',
    desc: 'Transfer Film High-Speed (V10 Pro)',
    icon: 'ph ph-share-network',
    html: `
        <div class="tool-ui">
            <!-- Navigasi -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:25px">
                <button id="tr-tab-send" onclick="app_tr_switch('send')" style="padding:12px; border-radius:15px; border:none; background:var(--green); color:#000; font-weight:800; cursor:pointer">KIRIM FILE</button>
                <button id="tr-tab-rec" onclick="app_tr_switch('rec')" style="padding:12px; border-radius:15px; border:none; background:#111; color:#fff; font-weight:800; cursor:pointer">TERIMA FILE</button>
            </div>

            <!-- Panel Kirim -->
            <div id="panel-send">
                <div class="tool-ui" style="border:2px dashed #333; text-align:center; padding:30px 10px; background:rgba(255,255,255,0.01)">
                    <span class="label">PILIH VIDEO / FILM (MAKS 5GB)</span>
                    <input type="file" id="tr-file" style="font-size:12px; margin-top:10px; width:100%">
                </div>
                
                <div id="tr-prog-cont" style="display:none; margin:25px 0">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px">
                        <span class="label" id="tr-status" style="color:var(--green)">MENGIRIM KE CLOUD...</span>
                        <span class="label" id="tr-percent">0%</span>
                    </div>
                    <div style="width:100%; height:12px; background:#000; border-radius:20px; overflow:hidden; border:1px solid #222">
                        <div id="tr-bar" style="width:0%; height:100%; background:var(--green); transition:0.3s; box-shadow:0 0 15px var(--green)"></div>
                    </div>
                    <p style="font-size:9px; color:var(--sub); margin-top:10px; text-align:center">JANGAN PINDAH TAB ATAU LAYAR MATI</p>
                </div>

                <button id="tr-btn-up" class="btn-calc" style="background:var(--green); color:#000; margin-top:15px">START UPLOAD</button>
                
                <div id="tr-res-send" style="display:none; margin-top:30px; text-align:center; animation:reveal 0.5s ease;">
                    <div style="background:#fff; color:#000; padding:25px; border-radius:30px;">
                        <span style="font-size:10px; font-weight:800; color:#888; letter-spacing:2px">PIN TRANSFER ANDA</span>
                        <h1 id="tr-display-pin" style="font-size:60px; letter-spacing:10px; margin:10px 0; font-family:'JetBrains Mono'; font-weight:800">----</h1>
                        <p id="tr-link-backup" style="font-size:8px; color:#aaa; word-break:break-all; margin-top:10px"></p>
                    </div>
                </div>
            </div>

            <!-- Panel Terima -->
            <div id="panel-rec" style="display:none">
                <span class="label" style="text-align:center; display:block">MASUKKAN PIN 4 DIGIT</span>
                <input type="number" id="tr-input-pin" placeholder="0000" style="text-align:center; font-size:60px; letter-spacing:15px; color:var(--green); background:transparent; border:none; outline:none; width:100%; border-bottom:4px solid #222; padding:20px 0">
                
                <button id="tr-btn-down" class="btn-calc" style="background:white; color:black; margin-top:30px">AMBIL FILE</button>
                
                <div id="tr-res-rec" style="display:none; margin-top:30px; text-align:center">
                    <div style="background:var(--indigo); padding:30px; border-radius:30px;">
                        <h2 style="color:#fff; font-size:16px; font-weight:800; margin-bottom:20px">FILE DITEMUKAN!</h2>
                        <button id="tr-final-dl" class="btn-calc" style="background:white; color:black">DOWNLOAD SEKARANG</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    logic: () => {
        // TOKEN DATABASE KHUSUS ZUNA (KeyValue)
        const DB_TOKEN = "zuna_pro_vault_2026"; 
        const DB_URL = `https://api.keyvalue.xyz/${DB_TOKEN}/`;

        window.app_tr_switch = (mode) => {
            const isSend = mode === 'send';
            document.getElementById('panel-send').style.display = isSend ? 'block' : 'none';
            document.getElementById('panel-rec').style.display = isSend ? 'none' : 'block';
            document.getElementById('tr-tab-send').style.background = isSend ? 'var(--green)' : '#111';
            document.getElementById('tr-tab-send').style.color = isSend ? '#000' : '#fff';
            document.getElementById('tr-tab-rec').style.background = isSend ? '#111' : 'var(--green)';
            document.getElementById('tr-tab-rec').style.color = isSend ? '#fff' : '#000';
        };

        // --- FUNGSI KIRIM ---
        document.getElementById('tr-btn-up').onclick = function() {
            const file = document.getElementById('tr-file').files[0];
            if (!file) return alert("Pilih file dulu!");

            const btn = this;
            const progCont = document.getElementById('tr-prog-cont');
            
            btn.disabled = true;
            progCont.style.display = 'block';
            document.getElementById('tr-res-send').style.display = 'none';

            // 1. UPLOAD KE PIXELDRAIN (Paling Cepat & Stabil)
            const fd = new FormData();
            fd.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://pixeldrain.com/api/file');

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const p = Math.round((e.loaded / e.total) * 100);
                    document.getElementById('tr-bar').style.width = p + '%';
                    document.getElementById('tr-percent').innerText = p + '%';
                    btn.innerText = "UPLOADING " + p + "%";
                }
            };

            xhr.onload = async function() {
                if (xhr.status === 201 || xhr.status === 200) {
                    const resp = JSON.parse(xhr.responseText);
                    const dlUrl = `https://pixeldrain.com/api/file/${resp.id}`;
                    const pin = Math.floor(1000 + Math.random() * 9999).toString();

                    btn.innerText = "GENERATING PIN...";

                    // 2. SIMPAN KE DATABASE PIN DENGAN RETRY
                    try {
                        const sync = await fetch(DB_URL + pin, {
                            method: 'POST',
                            body: dlUrl
                        });

                        if (sync.ok) {
                            document.getElementById('tr-res-send').style.display = 'block';
                            document.getElementById('tr-display-pin').innerText = pin;
                            document.getElementById('tr-link-backup').innerText = "Link: " + dlUrl;
                            progCont.style.display = 'none';
                            btn.innerText = "UPLOAD BERHASIL";
                        } else throw new Error();
                    } catch (e) {
                        // BACKUP: Jika PIN gagal, tampilkan Link Langsung agar upload tidak sia-sia
                        alert("PIN Database sibuk. Ini link download langsungnya: " + dlUrl);
                        document.getElementById('tr-res-send').style.display = 'block';
                        document.getElementById('tr-display-pin').innerText = "ERROR";
                        document.getElementById('tr-link-backup').innerText = dlUrl;
                        progCont.style.display = 'none';
                        btn.disabled = false;
                    }
                } else {
                    alert("Upload Gagal (Status: " + xhr.status + "). Coba lagi.");
                    btn.disabled = false;
                }
            };
            xhr.send(fd);
        };

        // --- FUNGSI TERIMA ---
        document.getElementById('tr-btn-down').onclick = async function() {
            const pin = document.getElementById('tr-input-pin').value;
            if (pin.length < 4) return alert("Input PIN 4 Digit!");

            const btn = this;
            btn.innerText = "SEARCHING...";
            btn.disabled = true;

            try {
                // Tambahkan No-Cache agar data fresh
                const res = await fetch(DB_URL + pin + "?t=" + Date.now());
                if (res.ok) {
                    const dlUrl = await res.text();
                    if (dlUrl.includes('http')) {
                        document.getElementById('tr-res-rec').style.display = 'block';
                        document.getElementById('tr-final-dl').onclick = () => {
                            window.open(dlUrl.trim(), '_blank');
                        };
                        btn.innerText = "FILE FOUND!";
                    } else throw new Error();
                } else {
                    alert("PIN tidak ditemukan atau kadaluarsa.");
                    btn.innerText = "AMBIL FILE";
                    btn.disabled = false;
                }
            } catch (err) {
                alert("Gangguan koneksi database.");
                btn.disabled = false;
                btn.innerText = "AMBIL FILE";
            }
        };
    }
});