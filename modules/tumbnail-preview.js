Zuna.register({
    id: 'f-thumb-tester',
    category: 'kreatif', 
    title: 'Thumbnail Tester Pro',
    desc: 'Simulasi Beranda YouTube & Safe Zones',
    icon: 'ph ph-projector-screen',
    html: `
        <div class="tool-ui animate-in">
            <!-- Box Deskripsi Fitur -->
            <div style="background: rgba(99, 102, 241, 0.05); border-radius: 15px; padding: 15px; margin-bottom: 25px; border: 1px solid rgba(99, 102, 241, 0.1); display: flex; gap: 12px; align-items: center;">
                <i class="ph ph-eye" style="font-size: 24px; color: var(--indigo)"></i>
                <div style="font-size: 11px; color: var(--sub); line-height: 1.5">
                    <b style="color:white; display:block; margin-bottom:2px">Thumbnail Optimization</b>
                    Uji keterbacaan thumbnail-mu dengan <i>Squint Test</i> (Mata Rabun) dan pastikan elemen penting tidak tertutup oleh durasi video (Safe Zones).
                </div>
            </div>

            <!-- Upload Area -->
            <div id="thumb-upload-box" style="width:100%; border:2px dashed #333; border-radius:24px; padding:40px 20px; text-align:center; cursor:pointer; transition: 0.3s; background: rgba(255,255,255,0.01)" 
                onclick="document.getElementById('thumb-input').click()"
                onmouseover="this.style.borderColor='var(--indigo)'" 
                onmouseout="this.style.borderColor='#333'">
                <div style="background: #111; width:60px; height:60px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin: 0 auto 15px auto;">
                    <i class="ph ph-cloud-arrow-up" style="font-size:30px; color:var(--indigo);"></i>
                </div>
                <p style="font-size:12px; color:#fff; font-weight:800; margin-bottom:5px">UPLOAD THUMBNAIL</p>
                <p style="font-size:10px; color:var(--sub);">Rasio 16:9 (1280x720) direkomendasikan</p>
                <input type="file" id="thumb-input" accept="image/*" style="display:none">
            </div>

            <!-- Kontrol Simulasi -->
            <div id="thumb-controls" style="display:none; margin-top:25px; animation: slideUp 0.4s ease-out forwards;">
                <span class="label">SIMULATION FILTERS</span>
                <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:15px;">
                    <button onclick="app_thumb_filter('blur(5px)')" class="btn-sm">SQUINT TEST</button>
                    <button onclick="app_thumb_filter('grayscale(1)')" class="btn-sm">CONTRAST</button>
                    <button onclick="app_thumb_toggle_theme()" class="btn-sm">TOGGLE THEME</button>
                </div>
                
                <div style="display:flex; justify-content:space-between; align-items:center; background:#111; padding:10px 15px; border-radius:12px; border:1px solid #1a1a1a">
                    <span style="font-size:10px; color:var(--sub); font-weight:800">SAFE ZONES (OVERLAY)</span>
                    <label class="switch-small">
                        <input type="checkbox" id="safe-zone-toggle" onchange="app_thumb_safe_zone()">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>

            <!-- Preview Grid -->
            <div id="thumb-preview-area" style="display:none; margin-top:35px;" class="theme-dark">
                
                <!-- 1. YouTube Desktop -->
                <div class="preview-item" style="margin-bottom:35px;">
                    <span class="label">YOUTUBE HOME (DESKTOP)</span>
                    <div class="mock-container" style="max-width:380px;">
                        <div class="thumb-wrapper">
                            <img class="t-img">
                            <div class="overlay-time">12:45</div>
                            <div class="safe-zone-marker">SAFE ZONE ERROR</div>
                        </div>
                        <div class="mock-meta">
                            <div class="avatar"></div>
                            <div class="text-meta">
                                <div class="line title"></div>
                                <div class="line sub"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr; gap:25px;">
                    <!-- 2. YouTube Mobile -->
                    <div class="preview-item">
                        <span class="label">YOUTUBE MOBILE</span>
                        <div class="mock-container" style="width:240px;">
                            <div class="thumb-wrapper">
                                <img class="t-img">
                                <div class="overlay-time">08:20</div>
                                <div class="safe-zone-marker"></div>
                            </div>
                            <div class="mock-meta">
                                <div class="avatar"></div>
                                <div class="text-meta"><div class="line title"></div><div class="line sub"></div></div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Sidebar / Recommendations -->
                    <div class="preview-item">
                        <span class="label">SIDEBAR / UP NEXT</span>
                        <div style="display:flex; gap:12px;">
                            <div class="thumb-wrapper" style="width:140px; height:fit-content">
                                <img class="t-img" style="border-radius:8px;">
                                <div class="overlay-time">15:00</div>
                                <div class="safe-zone-marker"></div>
                            </div>
                            <div style="flex:1; padding-top:4px">
                                <div class="line title" style="width:100%; margin-bottom:6px"></div>
                                <div class="line title" style="width:70%; margin-bottom:10px"></div>
                                <div class="line sub" style="width:50%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .btn-sm { background:#111; border:1px solid #222; color:#eee; font-size:9px; padding:10px; border-radius:10px; font-weight:800; cursor:pointer; transition:0.2s; }
            .btn-sm:hover { border-color: var(--indigo); background: #161616; }
            
            #thumb-preview-area.theme-light { background: #f1f1f1 !important; padding: 20px; border-radius: 20px; margin-left: -10px; margin-right: -10px; }
            #thumb-preview-area.theme-light .label { color: #666; }
            #thumb-preview-area.theme-light .line.title { background: #ddd; }
            #thumb-preview-area.theme-light .line.sub { background: #eee; }
            
            .mock-container { background: transparent; overflow: hidden; }
            .thumb-wrapper { position: relative; width: 100%; aspect-ratio: 16/9; background: #222; border-radius: 12px; overflow: hidden; }
            .t-img { width: 100%; height: 100%; object-fit: cover; transition: filter 0.3s ease; }
            
            .overlay-time { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.8); color: #fff; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; font-family: sans-serif; z-index: 5; }
            
            .safe-zone-marker { 
                position: absolute; bottom: 5px; right: 5px; width: 50px; height: 25px; 
                background: rgba(239, 68, 68, 0.4); border: 2px dashed #ef4444; 
                display: none; align-items: center; justify-content: center; 
                color: #fff; font-size: 6px; font-weight: 900; z-index: 10;
            }

            .mock-meta { display: flex; gap: 12px; padding: 12px 0; }
            .avatar { width: 36px; height: 36px; background: #222; border-radius: 50%; flex-shrink: 0; }
            .text-meta { flex: 1; }
            .line { height: 12px; background: #222; border-radius: 4px; }
            .line.title { width: 90%; margin-bottom: 8px; }
            .line.sub { width: 60%; height: 10px; }

            @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            
            /* Switch Styling */
            .switch-small { position: relative; display: inline-block; width: 34px; height: 18px; }
            .switch-small input { opacity: 0; width: 0; height: 0; }
            .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #333; transition: .4s; border-radius: 34px; }
            .slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
            input:checked + .slider { background-color: var(--indigo); }
            input:checked + .slider:before { transform: translateX(16px); }
        </style>
    `,
    logic: () => {
        const input = document.getElementById('thumb-input');
        const uploadBox = document.getElementById('thumb-upload-box');
        const previewArea = document.getElementById('thumb-preview-area');
        const controls = document.getElementById('thumb-controls');
        const images = document.querySelectorAll('.t-img');

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    images.forEach(img => img.src = event.target.result);
                    previewArea.style.display = 'block';
                    controls.style.display = 'block';
                    uploadBox.querySelector('p').innerText = "GANTI GAMBAR";
                    uploadBox.style.padding = "20px";
                };
                reader.readAsDataURL(file);
            }
        };

        window.app_thumb_filter = (filter) => {
            images.forEach(img => {
                img.style.filter = img.style.filter.includes(filter) ? 'none' : filter;
            });
        };

        window.app_thumb_toggle_theme = () => {
            previewArea.classList.toggle('theme-light');
        };

        window.app_thumb_safe_zone = () => {
            const isChecked = document.getElementById('safe-zone-toggle').checked;
            const markers = document.querySelectorAll('.safe-zone-marker');
            markers.forEach(m => {
                m.style.display = isChecked ? 'flex' : 'none';
            });
        };
    }
});