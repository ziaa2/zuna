Zuna.register({
    id: 'f-receh',
    category: 'keuangan', 
    title: 'Pelacak Receh Pro',
    desc: 'Catat pengeluaran kecil harian',
    icon: 'ph ph-coins',
    html: `
        <div class="tool-ui animate-in">
            <!-- Box Deskripsi -->
            <div style="background: rgba(239, 68, 68, 0.05); border-radius: 12px; padding: 12px; margin-bottom: 20px; border: 1px solid rgba(239, 68, 68, 0.1); display: flex; gap: 10px; align-items: center;">
                <i class="ph ph-clock-counter-clockwise" style="font-size: 20px; color: var(--red)"></i>
                <div style="font-size: 11px; color: var(--sub); line-height: 1.4">
                    Catat pengeluaran kecil yang sering terlupakan. Data <b style="color:white">otomatis reset tiap 24 jam</b> untuk menjaga list tetap bersih.
                </div>
            </div>

            <!-- Dashboard Total -->
            <div style="background: #111; border: 1px solid #1a1a1a; padding: 20px; border-radius: 20px; text-align: center; margin-bottom: 25px;">
                <span class="label" style="letter-spacing: 2px; font-size: 9px">TOTAL RECEH KELUAR</span>
                <h1 id="receh-total" style="font-size:45px; color:var(--red); font-family:'JetBrains Mono'; margin: 5px 0; font-weight: 800">Rp 0</h1>
            </div>

            <!-- Tombol Nominal Cepat -->
            <span class="label">PILIH NOMINAL</span>
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-top:10px; margin-bottom:30px">
                <button class="btn-receh" onclick="app_receh_add(500)">500</button>
                <button class="btn-receh" onclick="app_receh_add(1000)">1.000</button>
                <button class="btn-receh" onclick="app_receh_add(2000)">2.000</button>
                <button class="btn-receh" onclick="app_receh_add(5000)">5.000</button>
                <button class="btn-receh" onclick="app_receh_add(10000)">10.000</button>
                <button class="btn-receh" onclick="app_receh_custom()" style="background:var(--indigo); color:white; border-color:var(--indigo)">+ LAINNYA</button>
            </div>

            <!-- History -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px">
                <span class="label">RIWAYAT (TAP UNTUK HAPUS)</span>
                <button onclick="app_receh_clear()" style="background:transparent; border:none; color:var(--red); font-size:10px; font-weight:bold; cursor:pointer">RESET</button>
            </div>
            <div id="receh-logs" style="display:flex; flex-wrap:wrap; gap:8px;">
                <!-- Log muncul di sini -->
            </div>
        </div>

        <style>
            .btn-receh {
                background: #111; border: 1px solid #222; color: white;
                padding: 15px 0; border-radius: 12px; font-size: 14px; font-weight: 800;
                font-family: 'JetBrains Mono'; transition: 0.2s; cursor: pointer;
            }
            .btn-receh:active { transform: scale(0.95); background: #1a1a1a; }
            
            .log-item {
                background: #111; border: 1px solid #1a1a1a; padding: 8px 12px;
                border-radius: 10px; font-size: 11px; font-family: 'JetBrains Mono';
                color: #eee; cursor: pointer; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            }
            .log-item:hover { border-color: var(--red); color: var(--red); }
            @keyframes popIn { from { opacity:0; transform: scale(0.8); } to { opacity:1; transform: scale(1); } }
        </style>
    `,
    logic: () => {
        const KEY = 'zuna_receh_data';

        const getCleanData = () => {
            const now = Date.now();
            const raw = localStorage.getItem(KEY);
            const data = raw ? JSON.parse(raw) : [];
            return data.filter(i => (now - i.time) < 86400000); 
        };

        window.app_receh_render = () => {
            const items = getCleanData();
            localStorage.setItem(KEY, JSON.stringify(items));

            const total = items.reduce((a, b) => a + b.amt, 0);
            document.getElementById('receh-total').innerText = 'Rp ' + Zuna.fmt(total);

            const logCont = document.getElementById('receh-logs');
            if (items.length === 0) {
                logCont.innerHTML = '<p style="font-size:11px; color:#333; width:100%; text-align:center; padding:10px">Kosong</p>';
                return;
            }

            logCont.innerHTML = '';
            items.forEach((item, i) => {
                const span = document.createElement('div');
                span.className = 'log-item';
                span.innerHTML = `Rp${Zuna.fmt(item.amt)} <span style="opacity:0.3; margin-left:4px">✕</span>`;
                span.onclick = () => app_receh_del(i);
                logCont.appendChild(span);
            });
        };

        window.app_receh_add = (amt) => {
            if (!amt || amt <= 0) return;
            const items = getCleanData();
            items.unshift({ amt, time: Date.now() });
            localStorage.setItem(KEY, JSON.stringify(items));
            app_receh_render();
        };

        window.app_receh_custom = () => {
            const val = prompt("Masukkan nominal:");
            if (val) {
                const num = parseInt(val.replace(/[^0-9]/g, ''));
                if(num > 0) app_receh_add(num);
            }
        };

        window.app_receh_del = (idx) => {
            const items = getCleanData();
            items.splice(idx, 1);
            localStorage.setItem(KEY, JSON.stringify(items));
            app_receh_render();
        };

        window.app_receh_clear = () => {
            if(confirm("Hapus semua riwayat receh?")) {
                localStorage.setItem(KEY, '[]');
                app_receh_render();
            }
        };

        app_receh_render();
    }
});