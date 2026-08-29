Zuna.register({
    id: 'f-belanja',
    category: 'keuangan', 
    title: 'List Belanja Pro',
    desc: 'Auto-hapus 24 jam + Hitung Total',
    icon: 'ph ph-shopping-cart',
    html: `
        <div class="tool-ui">
            <!-- Box Deskripsi/Info di Atas -->
            <div style="background: rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 12px; margin-bottom: 20px; border: 1px dashed rgba(255,255,255,0.1); display: flex; gap: 10px; align-items: center;">
                <i class="ph ph-clock-counter-clockwise" style="font-size: 20px; color: var(--green)"></i>
                <div style="font-size: 11px; color: var(--sub); line-height: 1.4">
                    Catat kebutuhan belanja harianmu. Demi kebersihan data, <b style="color:white">setiap barang akan terhapus otomatis 24 jam</b> setelah ditambahkan.
                </div>
            </div>

            <div style="margin-bottom:20px">
                <span class="label">Tambah Barang</span>
                <input type="text" id="item-input" placeholder="Nama barang..." style="margin-bottom:10px; font-size:16px; border-bottom: 2px solid #222">
                
                <div style="display:flex; gap:10px">
                    <input type="number" id="item-price" placeholder="Harga (opsional)" style="flex:2; font-size:14px; border-bottom: 2px solid #222">
                    <input type="number" id="item-qty" placeholder="Qty" value="1" style="flex:1; font-size:14px; border-bottom: 2px solid #222">
                    <button class="btn-calc" onclick="app_list_add()" style="width:50px; padding:0; background:var(--green); color:#000">
                        <i class="ph ph-plus" style="font-size:20px"></i>
                    </button>
                </div>
            </div>

            <div id="list-container" style="display:flex; flex-direction:column; gap:10px">
                <!-- Barang muncul di sini -->
            </div>

            <div id="list-summary" style="margin-top:20px; padding:15px; background:rgba(255,255,255,0.05); border-radius:12px; display:none">
                <div style="display:flex; justify-content:space-between; align-items:center">
                    <span style="font-size:11px; color:var(--sub)">ESTIMASI BELANJA:</span>
                    <span id="total-price" style="font-size:16px; font-weight:800; color:var(--green)">Rp 0</span>
                </div>
            </div>

            <div id="list-empty" style="text-align:center; padding:40px 0; color:var(--sub); display:none">
                <i class="ph ph-package" style="font-size:30px; opacity:0.3"></i>
                <p style="font-size:11px; margin-top:10px">List kosong / sudah kadaluarsa</p>
            </div>

            <div style="display:flex; gap:10px; margin-top:20px">
                <button onclick="app_list_clear_done()" style="flex:1; background:#222; font-size:10px; padding:10px; border-radius:8px; color:var(--sub)">HAPUS SELESAI</button>
                <button onclick="app_list_share()" style="flex:1; background:#222; font-size:10px; padding:10px; border-radius:8px; color:var(--sub)">SHARE KE WA</button>
            </div>
        </div>
        <p style="font-size:9px; color:var(--sub); text-align:center; letter-spacing:1px; margin-top:20px; opacity:0.5">ZUNA SHOPPING ASSISTANT</p>
    `,
    logic: () => {
        const STORAGE_KEY = 'zuna_shopping_list';

        const getValidItems = () => {
            const now = Date.now();
            const raw = localStorage.getItem(STORAGE_KEY);
            const items = raw ? JSON.parse(raw) : [];
            // Filter: 86400000 ms = 24 jam
            return items.filter(item => (now - item.time) < 86400000);
        };

        const formatRupiah = (num) => {
            return "Rp " + Number(num).toLocaleString('id-ID');
        };

        window.app_list_render = () => {
            const items = getValidItems();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

            const container = document.getElementById('list-container');
            const emptyHint = document.getElementById('list-empty');
            const summary = document.getElementById('list-summary');
            const totalText = document.getElementById('total-price');
            
            container.innerHTML = "";
            let totalBiaya = 0;
            
            if (items.length === 0) {
                emptyHint.style.display = 'block';
                summary.style.display = 'none';
                return;
            }
            
            emptyHint.style.display = 'none';
            summary.style.display = 'block';

            items.forEach((item, index) => {
                const subTotal = (item.price || 0) * (item.qty || 1);
                if(!item.done) totalBiaya += subTotal;

                const div = document.createElement('div');
                div.style = `display:flex; justify-content:space-between; align-items:center; background:#111; padding:15px; border-radius:15px; border:1px solid ${item.done ? '#111' : '#1a1a1a'}; opacity:${item.done ? '0.5' : '1'}`;
                div.innerHTML = `
                    <div style="display:flex; flex-direction:column; gap:2px">
                        <span style="font-size:14px; font-weight:700; color:${item.done ? 'var(--sub)' : 'white'}; text-decoration:${item.done ? 'line-through' : 'none'}">${item.text}</span>
                        <span style="font-size:10px; color:var(--green)">${item.qty}x ${formatRupiah(item.price || 0)}</span>
                    </div>
                    <div style="display:flex; gap:15px; align-items:center">
                        <i class="ph ${item.done ? 'ph-check-circle' : 'ph-circle'}" onclick="app_list_toggle(${index})" style="color:var(--green); font-size:24px"></i>
                        <i class="ph ph-trash" onclick="app_list_del(${index})" style="color:var(--red); font-size:20px"></i>
                    </div>
                `;
                container.appendChild(div);
            });

            totalText.innerText = formatRupiah(totalBiaya);
        };

        window.app_list_add = () => {
            const inp = document.getElementById('item-input');
            const prc = document.getElementById('item-price');
            const qty = document.getElementById('item-qty');

            if (!inp.value.trim()) return;
            
            const items = getValidItems();
            items.unshift({ 
                text: inp.value, 
                price: parseInt(prc.value) || 0,
                qty: parseInt(qty.value) || 1,
                time: Date.now(), 
                done: false 
            });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            
            inp.value = "";
            prc.value = "";
            qty.value = "1";
            app_list_render();
        };

        window.app_list_toggle = (index) => {
            const items = getValidItems();
            items[index].done = !items[index].done;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            app_list_render();
        };

        window.app_list_del = (index) => {
            const items = getValidItems();
            items.splice(index, 1);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            app_list_render();
        };

        window.app_list_clear_done = () => {
            const items = getValidItems().filter(item => !item.done);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
            app_list_render();
        };

        window.app_list_share = () => {
            const items = getValidItems();
            if(items.length === 0) return;
            
            let text = "*LIST BELANJA SAYA*\n\n";
            items.forEach(item => {
                const status = item.done ? "✅" : "▫️";
                const priceInfo = item.price > 0 ? ` (@ ${formatRupiah(item.price)})` : "";
                text += `${status} ${item.text} - ${item.qty} pcs${priceInfo}\n`;
            });
            
            const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
        };

        app_list_render();
    }
});