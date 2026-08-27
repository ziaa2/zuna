Zuna.register({
    id: 'f-qrgen',
    title: 'QR Generator',
    desc: 'Ubah teks & link jadi QR',
    icon: 'ph ph-qr-code',
    html: `
        <div class="qr-wrapper">
            <div class="tool-ui" style="border: none; background: rgba(255,255,255,0.03); backdrop-filter: blur(10px);">
                <span class="label" style="color: var(--green); letter-spacing: 2px;">INPUT DATA</span>
                <textarea id="qr-input" placeholder="Masukkan link atau teks..." 
                    style="height:120px; font-size:16px; border-bottom: 2px solid var(--border); transition: 0.3s;" 
                    oninput="app_qr_gen()"></textarea>
                
                <button class="btn-calc" onclick="app_qr_download()" 
                    style="margin-top: 10px; background: var(--green); color: #000; box-shadow: 0 10px 20px rgba(0,255,136,0.2);">
                    <i class="ph ph-download-simple"></i> SIMPAN GAMBAR (PNG)
                </button>
            </div>

            <div id="qr-display-container" style="display:none; text-align:center; margin-top:40px; animation: fadeIn 0.5s ease;">
                <div id="qr-output" style="
                    background: white; 
                    padding: 25px; 
                    display: inline-block; 
                    border-radius: 30px; 
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                    border: 8px solid rgba(255,255,255,0.1);
                "></div>
                <p style="font-size:10px; color: var(--sub); margin-top:20px; font-weight:700; letter-spacing:3px;">READY TO SCAN</p>
            </div>
        </div>

        <style>
            @keyframes fadeIn { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
            #qr-input:focus { border-color: var(--green); }
            #qr-output canvas, #qr-output img { margin: 0 auto; max-width: 100%; height: auto; }
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
                
                if (!val.trim()) {
                    cont.style.display = 'none';
                    return;
                }
                
                cont.style.display = 'block';
                out.innerHTML = "";
                
                new QRCode(out, {
                    text: val,
                    width: 240,
                    height: 240,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
            }, 300);
        };

        window.app_qr_download = () => {
            const img = document.querySelector('#qr-output img') || document.querySelector('#qr-output canvas');
            if (!img) return alert("Ketik sesuatu dulu!");
            
            const link = document.createElement('a');
            // Jika QRCode generate canvas, ubah ke URL. Jika img, ambil src-nya.
            link.href = img.tagName === 'CANVAS' ? img.toDataURL("image/png") : img.src;
            link.download = `QR-Zuna-${Date.now()}.png`;
            link.click();
        };
    }
});
