Zuna.register({
    id: 'f-thumb-tester',
    title: 'Thumbnail Preview',
    desc: 'Cek Thumbnail di Berbagai Ukuran',
    icon: 'ph ph-projector-screen',
    html: `
        <div class="tool-ui">
            <!-- Upload Area -->
            <div id="thumb-upload-box" style="width:100%; border:2px dashed #333; border-radius:20px; padding:30px; text-align:center; cursor:pointer;" onclick="document.getElementById('thumb-input').click()">
                <i class="ph ph-image-plus" style="font-size:40px; color:var(--sub);"></i>
                <p style="font-size:11px; color:var(--sub); margin-top:10px; font-weight:800;">UPLOAD GAMBAR THUMBNAIL</p>
                <input type="file" id="thumb-input" accept="image/*" style="display:none">
            </div>

            <!-- Kontrol Simulasi -->
            <div id="thumb-controls" style="display:none; margin-top:20px; gap:10px; display:none;">
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px;">
                    <button onclick="toggleThumbFilter('blur(4px)')" class="btn-calc" style="font-size:10px; padding:10px; background:#222; color:white;">TEST MATA RABUN</button>
                    <button onclick="toggleThumbFilter('grayscale(1)')" class="btn-calc" style="font-size:10px; padding:10px; background:#222; color:white;">TEST KONTRAS</button>
                </div>
                <button onclick="resetThumbFilters()" class="btn-calc" style="font-size:10px; padding:5px; background:none; color:var(--sub); border:1px solid #222;">RESET FILTER</button>
            </div>

            <!-- Preview Grid -->
            <div id="thumb-preview-area" style="display:none; margin-top:30px;">
                
                <!-- 1. YouTube Desktop (Large) -->
                <div style="margin-bottom:30px;">
                    <span class="label">BERANDA DESKTOP (BESAR)</span>
                    <div style="width:100%; max-width:360px; background:#000; border-radius:12px; overflow:hidden;">
                        <img class="t-img" style="width:100%; aspect-ratio:16/9; object-fit:cover;">
                        <div style="padding:12px; display:flex; gap:12px;">
                            <div style="width:36px; height:36px; background:#222; border-radius:50%;"></div>
                            <div style="flex:1;">
                                <div style="height:12px; background:#222; width:90%; margin-bottom:8px;"></div>
                                <div style="height:10px; background:#111; width:60%;"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns:1fr; gap:20px;">
                    <!-- 2. YouTube Mobile -->
                    <div>
                        <span class="label">MOBILE / HP</span>
                        <div style="width:200px; background:#000;">
                            <img class="t-img" style="width:100%; aspect-ratio:16/9; object-fit:cover;">
                            <div style="padding:8px; display:flex; gap:8px;">
                                <div style="width:24px; height:24px; background:#222; border-radius:50%;"></div>
                                <div style="flex:1;">
                                    <div style="height:8px; background:#222; width:90%; margin-bottom:5px;"></div>
                                    <div style="height:6px; background:#111; width:50%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Sidebar / Up Next -->
                    <div>
                        <span class="label">SIDEBAR / REKOMENDASI</span>
                        <div style="display:flex; gap:10px; width:100%;">
                            <div style="width:120px; position:relative;">
                                <img class="t-img" style="width:100%; aspect-ratio:16/9; object-fit:cover; border-radius:8px;">
                                <div style="position:absolute; bottom:4px; right:4px; background:rgba(0,0,0,0.8); color:white; font-size:8px; padding:2px 4px;">10:05</div>
                            </div>
                            <div style="flex:1;">
                                <div style="height:10px; background:#222; width:100%; margin-bottom:5px;"></div>
                                <div style="height:10px; background:#222; width:80%; margin-bottom:8px;"></div>
                                <div style="height:7px; background:#111; width:50%;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 4. Notifikasi -->
                    <div>
                        <span class="label">NOTIFIKASI (SANGAT KECIL)</span>
                        <div style="display:flex; align-items:center; gap:10px; background:#111; padding:10px; border-radius:10px; border:1fr solid #222;">
                            <div style="width:30px; height:30px; background:#222; border-radius:50%;"></div>
                            <div style="flex:1; height:8px; background:#222;"></div>
                            <img class="t-img" style="width:45px; aspect-ratio:16/9; object-fit:cover; border-radius:4px;">
                        </div>
                    </div>
                </div>

            </div>
        </div>
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
                    uploadBox.style.border = '1px solid #222';
                    uploadBox.querySelector('p').innerText = "GANTI GAMBAR";
                };
                reader.readAsDataURL(file);
            }
        };

        window.toggleThumbFilter = (filter) => {
            images.forEach(img => {
                img.style.filter = img.style.filter === filter ? 'none' : filter;
            });
        };

        window.resetThumbFilters = () => {
            images.forEach(img => img.style.filter = 'none');
        };
    }
});