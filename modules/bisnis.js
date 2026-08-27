Zuna.register({
    id: 'f-bisnis',
    title: 'Bisnis Pro',
    desc: 'Modal & Balik Modal',
    icon: 'ph ph-briefcase',
    html: `
        <div class="animate-in">
            <div class="context-box">
                <p class="pain">Mau buka usaha tapi bingung kapan balik modalnya?</p>
                <p class="solution">Hitung total modal awal vs keuntungan bersih untuk tahu estimasi BEP (Break-Even Point) kamu.</p>
            </div>

            <!-- MODAL AWAL -->
            <div class="tool-ui" style="margin-bottom:15px">
                <span class="label">Modal Awal (Alat, Sewa, Lisensi)</span>
                <input type="text" id="b-initial" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
                
                <span class="label">Biaya Operasional / Bulan (Gaji, Listrik, Bahan)</span>
                <input type="text" id="b-opex" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
            </div>

            <!-- TARGET PENJUALAN -->
            <div class="tool-ui" style="margin-bottom:20px">
                <span class="label">Target Pendapatan (Omzet) / Bulan</span>
                <input type="text" id="b-revenue" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
            </div>

            <button class="btn-calc" id="b-btn" style="background:var(--indigo); color:white">HITUNG ANALISIS USAHA</button>

            <!-- HASIL ANALISIS -->
            <div id="f-bisnis-res" class="res-display" style="display:none; margin-top:30px">
                <div id="b-res-status" style="margin-bottom:20px"></div>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
                    <div class="tool-ui" style="padding:15px; margin:0; border-radius:20px">
                        <span class="label">Laba Bersih/Bln</span>
                        <div id="b-profit" style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px; color:var(--green)">0</div>
                    </div>
                    <div class="tool-ui" style="padding:15px; margin:0; border-radius:20px">
                        <span class="label">Margin Laba</span>
                        <div id="b-margin" style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px">0%</div>
                    </div>
                </div>

                <!-- TIMELINE -->
                <div class="table-container" style="margin-top:20px">
                    <table id="b-table">
                        <thead>
                            <tr>
                                <th>Periode</th>
                                <th>Akumulasi Profit</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody id="b-body"></tbody>
                    </table>
                </div>
            </div>
        </div>
    `,
    logic: () => {
        const btn = document.getElementById('b-btn');
        
        btn.onclick = () => {
            const initial = Zuna.val('b-initial');
            const opex = Zuna.val('b-opex');
            const revenue = Zuna.val('b-revenue');
            
            const profitPerMonth = revenue - opex;
            const margin = revenue > 0 ? (profitPerMonth / revenue) * 100 : 0;
            const resArea = document.getElementById('f-bisnis-res');
            const resStatus = document.getElementById('b-res-status');
            const tbody = document.getElementById('b-body');

            if (profitPerMonth <= 0) {
                alert("Peringatan: Pengeluaran lebih besar dari pendapatan. Usaha akan rugi!");
                return;
            }

            resArea.style.display = 'block';
            document.getElementById('b-profit').innerText = "Rp " + profitPerMonth.toLocaleString('id-ID');
            document.getElementById('b-margin').innerText = margin.toFixed(1) + "%";

            // Hitung Kapan Balik Modal
            const monthsToBEP = Math.ceil(initial / profitPerMonth);
            
            resStatus.innerHTML = `
                <span class="res-num" style="font-size:45px; color:var(--green)">${monthsToBEP} <small style="font-size:15px">Bulan</small></span>
                <span class="res-tag">ESTIMASI BALIK MODAL (BEP)</span>
            `;

            // Buat Proyeksi Tabel
            tbody.innerHTML = "";
            const periods = [1, 3, 6, 12, 24]; // Proyeksi bulan
            
            periods.forEach(m => {
                const totalProfit = profitPerMonth * m;
                const isBEP = totalProfit >= initial;
                tbody.innerHTML += `
                    <tr>
                        <td>Bulan ${m}</td>
                        <td>Rp ${totalProfit.toLocaleString('id-ID')}</td>
                        <td style="color:${isBEP ? 'var(--green)' : 'var(--red)'}; font-weight:800">
                            ${isBEP ? 'PROFIT' : 'MINUS'}
                        </td>
                    </tr>
                `;
            });

            resArea.scrollIntoView({ behavior: 'smooth' });
        };
    }
});
