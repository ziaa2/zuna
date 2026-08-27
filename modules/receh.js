Zuna.register({
    id: 'f-receh',
    title: 'Pelacak Receh',
    desc: 'Catat pengeluaran kecil (24j)',
    icon: 'ph ph-coins',
    html: `
        <div class="tool-ui">
            <div style="text-align:center; margin-bottom:25px">
                <span class="label">TOTAL PENGELUARAN RECEH</span>
                <h1 id="receh-total" style="font-size:40px; color:var(--red); font-family:'JetBrains Mono'">Rp 0</h1>
            </div>

            <!-- Tombol Nominal -->
            <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:10px; margin-bottom:30px">
                <button class="btn-calc" onclick="app_receh_add(500)" style="font-size:12px">500</button>
                <button class="btn-calc" onclick="app_receh_add(1000)" style="font-size:12px">1.000</button>
                <button class="btn-calc" onclick="app_receh_add(2000)" style="font-size:12px">2.000</button>
                <button class="btn-calc" onclick="app_receh_add(5000)" style="font-size:12px">5.000</button>
                <button class="btn-calc" onclick="app_receh_add(10000)" style="font-size:12px">10.000</button>
                <button class="btn-calc" onclick="app_receh_custom()" style="background:var(--sub); font-size:10px">CUSTOM</button>
            </div>

            <!-- History Singkat -->
            <span class="label">RIWAYAT (KLIK UNTUK HAPUS)</span>
            <div id="receh-logs" style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px">
                <!-- Log muncul di sini -->
            </div>
        </div>
        <p style="font-size:9px; color:var(--sub); text-align:center; margin-top:20px">OTOMATIS RESET TIAP 24 JAM</p>
    `,
    logic: () => {
        const KEY = 'zuna_receh_data';

        const getCleanData = () => {
            const now = Date.now();
            const data = JSON.parse(localStorage.getItem(KEY) || '[]');
            return data.filter(i => (now - i.time) < 86400000); // 24 Jam
        };

        window.app_receh_render = () => {
            const items = getCleanData();
            localStorage.setItem(KEY, JSON.stringify(items));

            const total = items.reduce((a, b) => a + b.amt, 0);
            document.getElementById('receh-total').innerText = 'Rp ' + Zuna.fmt(total);

            const logCont = document.getElementById('receh-logs');
            logCont.innerHTML = items.length === 0 ? '<p style="font-size:10px; color:#333">Belum ada catatan.</p>' : '';
            
            items.forEach((item, i) => {
                const btn = document.createElement('div');
                btn.style = "background:#111; border:1px solid #222; padding:8px 12px; border-radius:10px; font-size:11px; font-family:'JetBrains Mono'; cursor:pointer";
                btn.innerHTML = `Rp${Zuna.fmt(item.amt)} <span style="color:var(--red); margin-left:5px">✕</span>`;
                btn.onclick = () => app_receh_del(i);
                logCont.appendChild(btn);
            });
        };

        window.app_receh_add = (amt) => {
            if (amt <= 0) return;
            const items = getCleanData();
            items.unshift({ amt, time: Date.now() });
            localStorage.setItem(KEY, JSON.stringify(items));
            app_receh_render();
        };

        window.app_receh_custom = () => {
            const val = prompt("Masukkan nominal receh:");
            if (val) app_receh_add(parseInt(val.replace(/[^0-9]/g, '')));
        };

        window.app_receh_del = (idx) => {
            const items = getCleanData();
            items.splice(idx, 1);
            localStorage.setItem(KEY, JSON.stringify(items));
            app_receh_render();
        };

        app_receh_render();
    }
});
