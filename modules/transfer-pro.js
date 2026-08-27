Zuna.register({
    id: 'f-transfer',
    title: 'Zuna Transfer',
    desc: 'Transfer Film P2P (V15 Ultra-Stable)',
    icon: 'ph ph-share-network',
    html: `
        <div class="tool-ui">
            <!-- Navigasi Tab -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:25px">
                <button id="tr-tab-send" onclick="app_tr_switch('send')" style="padding:12px; border-radius:15px; border:none; background:var(--green); color:#000; font-weight:800; cursor:pointer">KIRIM FILE</button>
                <button id="tr-tab-rec" onclick="app_tr_switch('rec')" style="padding:12px; border-radius:15px; border:none; background:#111; color:#fff; font-weight:800; cursor:pointer">TERIMA FILE</button>
            </div>

            <!-- PANEL PENGIRIM -->
            <div id="panel-send" class="animate-in">
                <div id="tr-setup-send">
                    <div class="tool-ui" style="background:rgba(255,255,255,0.02); border-style:dashed; text-align:center; padding:30px 15px">
                        <i class="ph ph-video" style="font-size:40px; color:var(--sub); margin-bottom:15px; display:block"></i>
                        <span class="label">PILIH VIDEO / FILM (MAKS 1GB)</span>
                        <input type="file" id="tr-file" style="font-size:12px; margin-top:10px; width:100%">
                    </div>
                    <button id="tr-btn-ready" class="btn-calc" style="background:var(--green); color:#000; margin-top:20px">BUAT PIN KONEKSI</button>
                </div>
                
                <div id="tr-res-send" style="display:none; margin-top:20px; text-align:center;">
                    <div style="background:#fff; color:#000; padding:30px 20px; border-radius:35px; box-shadow: 0 15px 40px rgba(0,255,136,0.2)">
                        <span id="tr-send-status" style="font-size:10px; font-weight:800; color:#999; letter-spacing:1px; text-transform:uppercase">Menunggu Koneksi...</span>
                        <h1 id="tr-display-pin" style="font-size:60px; letter-spacing:12px; margin:10px 0; font-family:'JetBrains Mono'; font-weight:800">----</h1>
                        <p style="font-size:10px; font-weight:700; color:#bbb">STAY DI HALAMAN INI</p>
                    </div>
                </div>

                <div id="tr-send-prog" style="display:none; margin-top:30px">
                    <div style="display:flex; justify-content:space-between; margin-bottom:10px">
                        <span class="label" id="tr-send-info" style="color:var(--green)">MENGIRIM...</span>
                        <span class="label" id="tr-send-perc">0%</span>
                    </div>
                    <div style="width:100%; height:12px; background:#111; border-radius:10px; overflow:hidden">
                        <div id="tr-send-bar" style="width:0%; height:100%; background:var(--green); transition:0.3s"></div>
                    </div>
                </div>
            </div>

            <!-- PANEL PENERIMA -->
            <div id="panel-rec" style="display:none" class="animate-in">
                <span class="label" style="text-align:center; display:block">MASUKKAN PIN DARI PENGIRIM</span>
                <input type="number" id="tr-input-pin" placeholder="0000" style="text-align:center; font-size:60px; letter-spacing:15px; color:var(--green); background:transparent; border:none; outline:none; width:100%; border-bottom:4px solid #222; padding:15px 0">
                <button id="tr-btn-connect" class="btn-calc" style="background:white; color:black; margin-top:30px">HUBUNGKAN & DOWNLOAD</button>

                <div id="tr-rec-prog" style="display:none; margin-top:40px; text-align:center">
                    <span class="label" id="tr-rec-info" style="color:var(--green); font-size:12px">MENERIMA DATA...</span>
                    <div style="width:100%; height:14px; background:#111; border-radius:10px; overflow:hidden; margin:15px 0; border:1px solid #222">
                        <div id="tr-rec-bar" style="width:0%; height:100%; background:var(--green)"></div>
                    </div>
                    <p id="tr-rec-msg" style="font-size:10px; color:var(--sub)">JANGAN TUTUP HALAMAN INI</p>
                    
                    <!-- Tombol Simpan (Penting!) -->
                    <button id="tr-final-save-btn" class="btn-calc" style="display:none; background:var(--green); color:#000; margin-top:25px; font-weight:800; animation: bounce 1s infinite">SIMPAN KE GALERI / HP</button>
                </div>
            </div>
        </div>
        <style>
            @keyframes bounce { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
            .animate-in { animation: reveal 0.4s ease-out; }
            @keyframes reveal { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        </style>
    `,
    logic: () => {
        let peer = null;
        let conn = null;
        const CHUNK_SIZE = 64 * 1024; // 64KB per chunk

        window.app_tr_switch = (mode) => {
            const isSend = mode === 'send';
            document.getElementById('panel-send').style.display = isSend ? 'block' : 'none';
            document.getElementById('panel-rec').style.display = isSend ? 'none' : 'block';
            document.getElementById('tr-tab-send').style.background = isSend ? 'var(--green)' : '#111';
            document.getElementById('tr-tab-send').style.color = isSend ? '#000' : '#fff';
            document.getElementById('tr-tab-rec').style.background = isSend ? '#111' : 'var(--green)';
            document.getElementById('tr-tab-rec').style.color = isSend ? '#fff' : '#000';
        };

        // --- PENGIRIM ---
        const bReady = document.getElementById('tr-btn-ready');
        if(bReady) {
            bReady.onclick = function() {
                const file = document.getElementById('tr-file').files[0];
                if (!file) return alert("Pilih file dulu!");

                const pin = Math.floor(1000 + Math.random() * 9000).toString();
                if (peer) peer.destroy();
                
                peer = new Peer("zuna-" + pin);
                peer.on('open', () => {
                    document.getElementById('tr-setup-send').style.display = 'none';
                    document.getElementById('tr-res-send').style.display = 'block';
                    document.getElementById('tr-display-pin').innerText = pin;
                });

                peer.on('connection', (c) => {
                    conn = c;
                    document.getElementById('tr-send-status').innerText = "PENERIMA TERHUBUNG!";
                    document.getElementById('tr-send-prog').style.display = 'block';
                    
                    let offset = 0;
                    const send = () => {
                        while (offset < file.size && conn.bufferSize < 16 * 1024 * 1024) {
                            const chunk = file.slice(offset, offset + CHUNK_SIZE);
                            conn.send({ type: 'data', data: chunk, name: file.name, size: file.size });
                            offset += CHUNK_SIZE;
                            const p = Math.min((offset / file.size) * 100, 100);
                            document.getElementById('tr-send-bar').style.width = p + '%';
                            document.getElementById('tr-send-perc').innerText = Math.round(p) + '%';
                        }
                        if (offset < file.size) { setTimeout(send, 50); } 
                        else { 
                            setTimeout(() => { 
                                conn.send({ type: 'done', name: file.name });
                                document.getElementById('tr-send-info').innerText = "SELESAI TERKIRIM!";
                            }, 2000); 
                        }
                    };
                    send();
                });
            };
        }

        // --- PENERIMA ---
        const bConnect = document.getElementById('tr-btn-connect');
        if(bConnect) {
            bConnect.onclick = function() {
                const pin = document.getElementById('tr-input-pin').value;
                if (pin.length !== 4) return alert("PIN harus 4 digit!");
                if (peer) peer.destroy();
                peer = new Peer();

                peer.on('open', () => {
                    const c = peer.connect("zuna-" + pin, { reliable: true });
                    let chunks = [];
                    let receivedSize = 0;

                    c.on('open', () => {
                        document.getElementById('tr-rec-prog').style.display = 'block';
                        bConnect.innerText = "TRANSFER BERJALAN...";
                        bConnect.disabled = true;
                    });

                    c.on('data', (payload) => {
                        if (payload.type === 'data') {
                            chunks.push(payload.data);
                            receivedSize += payload.data.byteLength;
                            const p = Math.min((receivedSize / payload.size) * 100, 100);
                            document.getElementById('tr-rec-bar').style.width = p + '%';
                            document.getElementById('tr-rec-info').innerText = `Diterima: ${Math.round(p)}%`;
                            
                            // Cadangan: Jika 100% tapi pesan 'done' gak sampai, tombol tetep muncul
                            if (p >= 100) {
                                const saveBtn = document.getElementById('tr-final-save-btn');
                                saveBtn.style.display = "block";
                                saveBtn.onclick = () => {
                                    const blob = new Blob(chunks, { type: 'application/octet-stream' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url; a.download = payload.name || "zuna_video.mp4";
                                    document.body.appendChild(a); a.click();
                                    alert("Sedang menyimpan... Cek galeri atau folder Download.");
                                };
                            }
                        } 
                        
                        if (payload.type === 'done') {
                            document.getElementById('tr-rec-info').innerText = "BERHASIL DITERIMA!";
                            document.getElementById('tr-rec-msg').innerText = "Silakan klik tombol di bawah untuk simpan.";
                            const saveBtn = document.getElementById('tr-final-save-btn');
                            saveBtn.style.display = "block";
                            saveBtn.innerText = "SIMPAN FILM SEKARANG";
                        }
                    });
                });
                peer.on('error', () => alert("Gagal hubung. PIN salah atau pengirim offline."));
            };
        }
    }
});