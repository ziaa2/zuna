Zuna.register({
    id: 'f-transfer',
    title: 'Zuna Transfer',
    desc: 'Kirim Film Langsung (P2P Unlimited)',
    icon: 'ph ph-share-network',
    html: `
        <div class="tool-ui">
            <!-- Navigasi Tab -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:25px">
                <button id="tr-tab-send" onclick="app_tr_switch('send')" style="padding:12px; border-radius:15px; border:none; background:var(--green); color:#000; font-weight:800; cursor:pointer">KIRIM</button>
                <button id="tr-tab-rec" onclick="app_tr_switch('rec')" style="padding:12px; border-radius:15px; border:none; background:#111; color:#fff; font-weight:800; cursor:pointer">TERIMA</button>
            </div>

            <!-- PANEL PENGIRIM -->
            <div id="panel-send">
                <div id="tr-setup-send">
                    <div class="tool-ui" style="background:rgba(255,255,255,0.02); border-style:dashed; text-align:center; padding:30px 15px">
                        <i class="ph ph-video" style="font-size:40px; color:var(--sub); margin-bottom:15px; display:block"></i>
                        <span class="label">PILIH FILE VIDEO / FILM</span>
                        <input type="file" id="tr-file" style="font-size:12px; margin-top:10px; width:100%">
                    </div>
                    <button id="tr-btn-ready" class="btn-calc" style="background:var(--green); color:#000; margin-top:20px">BUAT PIN KONEKSI</button>
                </div>
                
                <div id="tr-res-send" style="display:none; margin-top:20px; text-align:center;">
                    <div style="background:#fff; color:#000; padding:25px; border-radius:30px; box-shadow: 0 15px 40px rgba(0,255,136,0.2)">
                        <span id="tr-send-status" style="font-size:10px; font-weight:800; color:#999; letter-spacing:1px">MENUNGGU PENERIMA...</span>
                        <h1 id="tr-display-pin" style="font-size:60px; letter-spacing:10px; margin:10px 0; font-family:'JetBrains Mono'; font-weight:800">----</h1>
                        <p style="font-size:9px; color:#999">JANGAN TUTUP HALAMAN INI</p>
                    </div>
                </div>

                <div id="tr-send-prog" style="display:none; margin-top:20px">
                    <span class="label" id="tr-send-info" style="color:var(--green)">MENGIRIM...</span>
                    <div style="width:100%; height:10px; background:#111; border-radius:10px; overflow:hidden">
                        <div id="tr-send-bar" style="width:0%; height:100%; background:var(--green)"></div>
                    </div>
                </div>
            </div>

            <!-- PANEL PENERIMA -->
            <div id="panel-rec" style="display:none">
                <span class="label">PIN DARI PENGIRIM</span>
                <input type="number" id="tr-input-pin" placeholder="0000" style="text-align:center; font-size:50px; letter-spacing:10px; color:var(--green); background:transparent; border:none; outline:none; width:100%; border-bottom:3px solid #222; padding:15px 0">
                <button id="tr-btn-connect" class="btn-calc" style="background:white; color:black; margin-top:20px">HUBUNGKAN & DOWNLOAD</button>

                <div id="tr-rec-prog" style="display:none; margin-top:30px; text-align:center">
                    <span class="label" id="tr-rec-info" style="color:var(--green)">MENYIAPKAN DATA...</span>
                    <div style="width:100%; height:10px; background:#111; border-radius:10px; overflow:hidden; margin:10px 0">
                        <div id="tr-rec-bar" style="width:0%; height:100%; background:var(--green)"></div>
                    </div>
                    <p id="tr-rec-msg" style="font-size:9px; color:var(--sub)">STAY DI BROWSER</p>
                    <!-- Tombol Simpan Manual -->
                    <button id="tr-final-save-btn" class="btn-calc" style="display:none; background:var(--green); color:#000; margin-top:20px">SIMPAN FILM KE HP</button>
                </div>
            </div>
        </div>
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

        // --- SENDER LOGIC ---
        const btnReady = document.getElementById('tr-btn-ready');
        if(btnReady) {
            btnReady.onclick = function() {
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

                peer.on('connection', (connection) => {
                    conn = connection;
                    document.getElementById('tr-send-status').innerText = "TERHUBUNG!";
                    document.getElementById('tr-send-status').style.color = "var(--green)";
                    document.getElementById('tr-send-prog').style.display = 'block';
                    
                    let offset = 0;
                    const sendNext = () => {
                        while (offset < file.size && conn.bufferSize < 16 * 1024 * 1024) {
                            const chunk = file.slice(offset, offset + CHUNK_SIZE);
                            conn.send({
                                type: 'data',
                                data: chunk,
                                name: file.name,
                                size: file.size
                            });
                            offset += CHUNK_SIZE;
                            const p = Math.min((offset / file.size) * 100, 100);
                            document.getElementById('tr-send-bar').style.width = p + '%';
                            document.getElementById('tr-send-info').innerText = `MENGIRIM: ${Math.round(p)}%`;
                        }
                        if (offset < file.size) {
                            setTimeout(sendNext, 50);
                        } else {
                            setTimeout(() => {
                                conn.send({ type: 'done', name: file.name });
                                document.getElementById('tr-send-info').innerText = "SELESAI!";
                            }, 1500);
                        }
                    };
                    sendNext();
                });
            };
        }

        // --- RECEIVER LOGIC ---
        const btnConnect = document.getElementById('tr-btn-connect');
        if(btnConnect) {
            btnConnect.onclick = function() {
                const pin = document.getElementById('tr-input-pin').value;
                if (pin.length !== 4) return alert("PIN 4 Digit!");

                if (peer) peer.destroy();
                peer = new Peer();

                peer.on('open', () => {
                    const connection = peer.connect("zuna-" + pin, { reliable: true });
                    let chunks = [];
                    let receivedSize = 0;

                    connection.on('open', () => {
                        document.getElementById('tr-rec-prog').style.display = 'block';
                        btnConnect.innerText = "TRANSFER BERJALAN...";
                        btnConnect.disabled = true;
                    });

                    connection.on('data', (payload) => {
                        if (payload.type === 'data') {
                            chunks.push(payload.data);
                            receivedSize += payload.data.byteLength;
                            const p = Math.min((receivedSize / payload.size) * 100, 100);
                            document.getElementById('tr-rec-bar').style.width = p + '%';
                            document.getElementById('tr-rec-info').innerText = `Menerima: ${Math.round(p)}%`;
                        } 
                        
                        if (payload.type === 'done') {
                            document.getElementById('tr-rec-info').innerText = "BERHASIL DITERIMA!";
                            document.getElementById('tr-rec-msg').innerText = "Klik tombol di bawah untuk simpan.";
                            
                            const saveBtn = document.getElementById('tr-final-save-btn');
                            saveBtn.style.display = "block";
                            
                            saveBtn.onclick = () => {
                                try {
                                    const blob = new Blob(chunks, { type: 'application/octet-stream' });
                                    const url = window.URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.style.display = 'none';
                                    a.href = url;
                                    a.download = payload.name || "zuna_file";
                                    document.body.appendChild(a);
                                    a.click();
                                    
                                    setTimeout(() => {
                                        document.body.removeChild(a);
                                        window.URL.revokeObjectURL(url);
                                        alert("File disimpan ke folder Download.");
                                        location.reload(); 
                                    }, 2000);
                                } catch (e) {
                                    alert("Gagal menyimpan. Memori mungkin penuh.");
                                }
                            };
                        }
                    });
                });
                peer.on('error', () => alert("Gagal hubung. PIN salah atau pengirim offline."));
            };
        }
    }
});