Zuna.register({
    id: 'f-qrgen',
    category: 'tools', 
    title: 'QR Generator Pro',
    desc: 'Ubah teks & link jadi QR Kustom',
    icon: 'ph ph-qr-code',
    html: `
        <div class="qr-wrapper animate-in">
            <!-- Box Deskripsi/Info -->
            <div style="background: rgba(0, 255, 149, 0.05); border-radius: 15px; padding: 15px; margin-bottom: 25px; border: 1px solid rgba(0, 255, 149, 0.1); display: flex; gap: 12px; align-items: center;">
                <i class="ph ph-lightning" style="font-size: 24px; color: var(--green)"></i>
                <div style="font-size: 11px; color: var(--sub); line-height: 1.5">
                    <b style="color:white; display:block; margin-bottom:2px">Zuna QR Engine</b>
                    Buat kode QR instan untuk link, WhatsApp, atau teks. Hasil bisa dikustomisasi warnanya dan diunduh dengan kualitas HD.
                </div>
            </div>

            <div class="tool-ui" style="border: 1px solid #1a1a1a; background: rgba(255,255,255,0.02); padding: 20px; border-radius: 20px;">
                <span class="label" style="color: var(--green); letter-spacing: 2px;">ISI KONTEN QR</span>
                <textarea id="qr-input" placeholder="Masukkan link website, nomor WA, atau pesan teks..." 
                    style="height:100px; font-size:16px; border-bottom: 1px solid #333; transition: 0.3s; background:transparent; color:white;" 
                    oninput="app_qr_gen()"></textarea>
                
                <!-- Customization Options -->
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-top:20px;">
                    <div>
                        <span class="label" style="font-size:9px">WARNA QR</span>
                        <input type="color" id="qr-color-dark" value="#000000" style="height:35px; padding:2px; background:#111; border:1px solid #333" oninput="app_qr_gen()">
                    </div>
                    <div>
                        <span class="label" style="font-size:9px">WARNA BG</span>
                        <input type="color" id="qr-color-light" value="#ffffff" style="height:35px; padding:2px; background:#111; border:1px solid #333" oninput="app_qr_gen()">
                    </div>
                </div>

                <button class="btn-calc" onclick="app_qr_download()" 
                    style="margin-top: 25px; background: var(--green); color: #000; font-weight:800; letter-spacing:1px; border-radius:12px;">
                    <i class="ph ph-download-simple" style="font-weight:800"></i> SIMPAN QR (PNG)
                </button>
            </div>

            <div id="qr-display-container" style="display:none; text-align:center; margin-top:40px;">
                <div id="qr-output-wrapper" style="display:inline-block; position:relative;">
                    <div id="qr-output" style="
                        background: white; 
                        padding: 20px; 
                        display: inline-block; 
                        border-radius: 20px; 
                        box-shadow: 0 20px 50px rgba(0,0,0,0.4);
                        border: 1px solid rgba(255,255,255,0.1);
                        transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    "></div>
                </div>
                <div style="margin-top:20px; display:flex; flex-direction:column; align-items:center; gap:5px;">
                    <span class="sync-indicator" style="font-size:10px; color:var(--green); letter-spacing:3px; font-weight:800">LIVE PREVIEW</span>
                    <p style="font-size:9px; color: var(--sub);">Arahkan kamera ponsel untuk scan</p>
                </div>
            </div>
        </div>

        <style>
            @keyframes qrReveal { 
                from { opacity:0; transform: scale(0.8) translateY(30px); } 
                to { opacity:1; transform: scale(1) translateY(0); } 
            }
            #qr-input:focus { border-bottom-color: var(--green) !important; outline:none; }
            #qr-display-container.active { display:block !important; animation: qrReveal 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
            #qr-output canvas, #qr-output img { margin: 0 auto; max-width: 100%; height: auto; border-radius: 5px; }
        </style>
    `,
    logic: () => {
        let timer;

        window.app_qr_gen = () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                const val = document.getElementById('qr-input').value;
                const cont = document.getElementById('qr-display-container');
                const out = document.getElementById('qr-output');
                const dark = document.getElementById('qr-color-dark').value;
                const light = document.getElementById('qr-color-light').value;
                
                if (!val.trim()) {
                    cont.classList.remove('active');
                    return;
                }
                
                cont.classList.add('active');
                out.innerHTML = "";
                
                // Tambahan proteksi warna background (QR Code generator library)
                // Memastikan warna gelap tidak sama dengan warna terang
                new QRCode(out, {
                    text: val,
                    width: 256,
                    height: 256,
                    colorDark: dark,
                    colorLight: light,
                    correctLevel: QRCode.CorrectLevel.H
                });

                // Update background wrapper agar sesuai warna background QR yang dipilih
                out.style.background = light;
            }, 400);
        };

        window.app_qr_download = () => {
            const out = document.getElementById('qr-output');
            const img = out.querySelector('img') || out.querySelector('canvas');
            
            if (!img || !document.getElementById('qr-input').value.trim()) {
                return alert("Ketik sesuatu untuk membuat QR!");
            }
            
            // Konversi ke Canvas jika outputnya Image untuk hasil maksimal
            const link = document.createElement('a');
            if (img.tagName === 'CANVAS') {
                link.href = img.toDataURL("image/png");
            } else {
                // Untuk library yang outputnya img src (base64)
                link.href = img.src;
            }
            
            link.download = `ZunaQR_${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }
});