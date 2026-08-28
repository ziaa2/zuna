Zuna.register({
    id: 'f-belanja',
    category:'keuangan', 
    title: 'List Belanja',
    desc: 'Hapus otomatis dlm 24 jam',
    icon: 'ph ph-shopping-cart',
    html: `
        <div class="tool-ui">
            <span class="label">Tambah Barang</span>
            <div style="display:flex; gap:10px; margin-bottom:20px">
                <input type="text" id="item-input" placeholder="Misal: Token Listrik..." style="margin-bottom:0; font-size:16px; border-bottom: 2px solid #222">
                <button class="btn-calc" onclick="app_list_add()" style="width:60px; padding:0; background:var(--green); color:#000">
                    <i class="ph ph-plus" style="font-size:20px"></i>
                </button>
            </div>

            <div id="list-container" style="display:flex; flex-direction:column; gap:10px">
                <!-- Barang muncul di sini -->
            </div>

            <div id="list-empty" style="text-align:center; padding:40px 0; color:var(--sub); display:none">
                <i class="ph ph-package" style="font-size:30px; opacity:0.3"></i>
                <p style="font-size:11px; margin-top:10px">List kosong / sudah kadaluarsa</p>
            </div>
        </div>
        <p style="font-size:9px; color:var(--sub); text-align:center; letter-spacing:1px">ITEM OTOMATIS TERHAPUS SETELAH 24 JAM</p>
    `,
    logic: () => {
        const STORAGE_KEY = 'zuna_shopping_list';

        // 1. Fungsi Ambil Data & Bersihkan yang > 24 Jam
        const getValidItems = () => {
            const now = Date.now();
            const raw = localStorage.getItem(STORAGE_KEY);
            const items = raw ? JSON.parse(raw) : [];
            // Filter: Hanya ambil yang umurnya kurang dari 24 jam (86400000 ms)
            return items.filter(item => (now - item.time) < 86400000);
        };

        // 2. Fungsi Render ke Layar
        window.app_list_render = () => {
            const items = getValidItems();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); // Simpan hasil filter

            const container = document.getElementById('list-container');
            const emptyHint = document.getElementById('list-empty');
            
            container.innerHTML = "";
            
            if (items.length === 0) {
                emptyHint.style.display = 'block';
                return;
            }
            
            emptyHint.style.display = 'none';
            items.forEach((item, index) => {
                const div = document.createElement('div');
                div.style = "display:flex; justify-content:space-between; align-items:center; background:#111; padding:15px 20px; border-radius:15px; border:1px solid #1a1a1a";
                div.innerHTML = `
                    <div style="display:flex; flex-direction:column">
                        <span style="font-size:14px; font-weight:700; color:${item.done ? 'var(--sub)' : 'white'}; text-decoration:${item.done ? 'line-through' : 'none'}">${item.text}</span>
                        <span style="font-size:8px; color:#444; margin-top:4px">Dibuat: ${new Date(item.time).toLocaleTimeString()}</span>
                    </div>
                    <div style="display:flex; gap:10px">
                        <i class="ph ${item.done ? 'ph-check-circle' : 'ph-circle'}" onclick="app_list_toggle(${index})" style="color:var(--green); font-size:22px"></i>
                        <i class="ph ph-trash" onclick="app_list_del(${index})" style="color:var(--red); font-size:22px"></i>
                    </div>
                `;
                container.appendChild(div);
            });
        };

        // 3. Tambah Barang
        window.app_list_add = () => {
            const inp = document.getElementById('item-input');
            if (!inp.value.trim()) return;
            
            const items = getValidItems();
            items.unshift({ text: inp.value, time: Date.now(), done: false });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            
            inp.value = "";
            app_list_render();
        };

        // 4. Ceklis Barang
        window.app_list_toggle = (index) => {
            const items = getValidItems();
            items[index].done = !items[index].done;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            app_list_render();
        };

        // 5. Hapus Manual
        window.app_list_del = (index) => {
            const items = getValidItems();
            items.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            app_list_render();
        };

        // Jalankan render pertama kali saat modul dibuka
        app_list_render();
    }
});
