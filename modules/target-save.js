Zuna.register({
    id: 'f-targetsave',
    category: 'keuangan', 
    title: 'Saving Planner',
    desc: 'Breakdown tabungan buat barang impian',
    icon: 'ph ph-target',
    html: `
        <div class="tool-ui">
            <span class="label">Nama Barang</span>
            <input type="text" id="target-name" placeholder="Misal: iPhone 16 Pro" style="font-size:16px; margin-bottom:15px">
            
            <span class="label">Harga Barang</span>
            <input type="text" id="target-price" placeholder="Rp 0" style="color:var(--green); font-family:'JetBrains Mono'">
            
            <div id="target-res" style="display:none; margin-top:25px">
                <div class="ideal-box">
                    <span class="label" style="color:#000">REKOMENDASI NABUNG (IDEAL)</span>
                    <h2 id="res-ideal" style="color:#000; font-size:28px">Rp 0</h2>
                    <p id="res-note" style="color:rgba(0,0,0,0.5); font-size:10px; font-weight:700; margin-top:5px"></p>
                </div>

                <div class="grid-res" style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:15px">
                    <div class="mini-card">
                        <span class="label">PER HARI</span>
                        <span id="res-day" class="val-save">0</span>
                        <span class="sub-label">Target 1 Bulan</span>
                    </div>
                    <div class="mini-card">
                        <span class="label">PER BULAN</span>
                        <span id="res-month" class="val-save">0</span>
                        <span class="sub-label">Target 1 Tahun</span>
                    </div>
                    <div class="mini-card">
                        <span class="label">PER TAHUN</span>
                        <span id="res-year" class="val-save">0</span>
                        <span class="sub-label">Target 5 Tahun</span>
                    </div>
                    <div class="mini-card" style="background:var(--indigo)">
                        <span class="label" style="color:white">5 TAHUN</span>
                        <span id="res-5year" class="val-save" style="color:white">0</span>
                        <span class="sub-label" style="color:rgba(255,255,255,0.6)">Total Nabung</span>
                    </div>
                </div>
            </div>
        </div>

        <style>
            .ideal-box { background: var(--green); padding: 25px; border-radius: 25px; text-align: center; }
            .mini-card { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 15px; border-radius: 20px; }
            .val-save { display: block; font-size: 16px; font-weight: 800; color: #fff; margin: 5px 0; font-family: 'JetBrains Mono'; }
            .sub-label { font-size: 8px; font-weight: 800; color: var(--sub); letter-spacing: 1px; text-transform: uppercase; }
        </style>
    `,
    logic: () => {
        const calculate = () => {
            const price = Zuna.val('target-price');
            const resDiv = document.getElementById('target-res');
            
            if (price <= 0) {
                resDiv.style.display = 'none';
                return;
            }
            resDiv.style.display = 'block';

            // 1. Kalkulasi Dasar
            const perDay = Math.ceil(price / 30);      // Jika target 1 bulan
            const perMonth = Math.ceil(price / 12);    // Jika target 1 tahun
            const perYear = Math.ceil(price / 5);      // Jika target 5 tahun
            const fiveYearTotal = price;               // Total yang harus dikumpul

            // 2. Logika "Ideal" (Kita sarankan nabung harian dengan target 1 tahun biar gak berat)
            const idealDaily = Math.ceil(price / 365);
            
            // 3. Update UI
            document.getElementById('res-ideal').innerText = 'Rp ' + Zuna.fmt(idealDaily);
            document.getElementById('res-note').innerText = `NABUNG HARIAN SELAMA 1 TAHUN UNTUK MENCAPAI RP ${Zuna.fmt(price)}`;
            
            document.getElementById('res-day').innerText = 'Rp ' + Zuna.fmt(perDay);
            document.getElementById('res-month').innerText = 'Rp ' + Zuna.fmt(perMonth);
            document.getElementById('res-year').innerText = 'Rp ' + Zuna.fmt(perYear);
            document.getElementById('res-5year').innerText = 'Rp ' + Zuna.fmt(fiveYearTotal);
        };

        // Pasang auto-format titik dan auto-hitung
        Zuna.bindFmt('target-price', calculate);
    }
});
