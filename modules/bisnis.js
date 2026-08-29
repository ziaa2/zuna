Zuna.register({
    id: 'f-bisnis',
    category:'keuangan', 
    title: 'Bisnis Pro',
    desc: 'Modal & Balik Modal',
    icon: 'ph ph-briefcase',
    html: `
        <div class="animate-in">
            <!-- Box Deskripsi Fitur -->
            <div style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%); border-radius: 15px; padding: 15px; margin-bottom: 25px; border: 1px solid rgba(99, 102, 241, 0.2); display: flex; gap: 12px; align-items: center;">
                <div style="background: var(--indigo); width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <i class="ph ph-chart-line-up" style="font-size: 24px; color: white"></i>
                </div>
                <div style="font-size: 11px; color: var(--sub); line-height: 1.5">
                    <b style="color:white; display:block; font-size: 13px">Business Analytics</b>
                    Hitung BEP, ROI, dan profitabilitas bisnismu secara instan untuk pengambilan keputusan yang lebih tepat.
                </div>
            </div>

            <!-- INPUT SECTION -->
            <div class="tool-ui" style="margin-bottom:15px">
                <span class="label">Modal Awal (Alat, Sewa, Lisensi)</span>
                <input type="text" id="b-initial" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
                
                <span class="label">Biaya Operasional / Bulan</span>
                <input type="text" id="b-opex" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
            </div>

            <div class="tool-ui" style="margin-bottom:20px">
                <span class="label">Target Pendapatan (Omzet) / Bulan</span>
                <input type="text" id="b-revenue" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
            </div>

            <button class="btn-calc" id="b-btn" style="background:var(--indigo); color:white; height: 50px; font-weight: 800; letter-spacing: 1px">ANILISIS KELAYAKAN</button>

            <!-- HASIL ANALISIS (UPGRADED VISUAL) -->
            <div id="f-bisnis-res" class="res-display" style="display:none; margin-top:35px; border-top: 1px solid #222; pt: 30px">
                
                <!-- Main BEP Card -->
                <div style="background: #111; border-radius: 25px; padding: 25px; text-align: center; border: 1px solid #1a1a1a; margin-bottom: 20px; position: relative; overflow: hidden">
                    <div style="position: absolute; top: -10px; right: -10px; opacity: 0.05">
                        <i class="ph ph-rocket" style="font-size: 100px"></i>
                    </div>
                    <span style="font-size: 11px; color: var(--sub); text-transform: uppercase; letter-spacing: 2px">Estimasi Balik Modal</span>
                    <div id="b-res-status" style="margin: 10px 0">
                        <!-- Filled by Logic -->
                    </div>
                    <div id="b-health-badge" style="display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 10px; font-weight: 800; text-transform: uppercase;">-</div>
                </div>
                
                <!-- Stats Grid -->
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:25px">
                    <div style="background:#111; padding:15px; border-radius:20px; border:1px solid #1a1a1a">
                        <span class="label" style="margin-bottom:8px; display:block">Laba Bersih / bln</span>
                        <div id="b-profit" style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px; color:var(--green)">0</div>
                    </div>
                    <div style="background:#111; padding:15px; border-radius:20px; border:1px solid #1a1a1a">
                        <span class="label" style="margin-bottom:8px; display:block">Margin Laba</span>
                        <div id="b-margin" style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px">0%</div>
                    </div>
                    <div style="background:#111; padding:15px; border-radius:20px; border:1px solid #1a1a1a">
                        <span class="label" style="margin-bottom:8px; display:block">ROI Tahunan</span>
                        <div id="b-roi" style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px; color:var(--indigo)">0%</div>
                    </div>
                    <div style="background:#111; padding:15px; border-radius:20px; border:1px solid #1a1a1a">
                        <span class="label" style="margin-bottom:8px; display:block">Payback Ratio</span>
                        <div id="b-ratio" style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px">0.0</div>
                    </div>
                </div>

                <!-- Timeline Table -->
                <div style="background: #090909; border-radius: 20px; padding: 5px; border: 1px solid #111">
                    <p style="font-size:10px; font-weight:800; text-align:center; margin: 15px 0; color: var(--sub); letter-spacing: 1px">PROYEKSI AKUMULASI PROFIT</p>
                    <div class="table-container" style="margin:0; background: transparent">
                        <table id="b-table">
                            <thead>
                                <tr>
                                    <th style="font-size:10px">PERIODE</th>
                                    <th style="font-size:10px">KUMULATIF</th>
                                    <th style="font-size:10px">STATUS</th>
                                </tr>
                            </thead>
                            <tbody id="b-body"></tbody>
                        </table>
                    </div>
                </div>

                <p id="b-advice" style="font-size: 11px; color: var(--sub); text-align: center; margin-top: 20px; line-height: 1.6; padding: 0 10px;"></p>
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

            // ROI & Ratio
            const annualROI = ((profitPerMonth * 12) / initial) * 100;
            const paybackRatio = (initial / (profitPerMonth * 12)).toFixed(2);
            document.getElementById('b-roi').innerText = annualROI.toFixed(1) + "%";
            document.getElementById('b-ratio').innerText = paybackRatio + " Tahun";

            // Health Status & Advice
            const badge = document.getElementById('b-health-badge');
            const advice = document.getElementById('b-advice');
            if (margin > 35) {
                badge.innerText = "Sangat Menguntungkan";
                badge.style.background = "rgba(34, 197, 94, 0.1)";
                badge.style.color = "#22c55e";
                advice.innerText = "Luar biasa! Margin labamu sangat tebal. Bisnis ini sangat layak untuk segera dijalankan.";
            } else if (margin > 15) {
                badge.innerText = "Potensial / Normal";
                badge.style.background = "rgba(99, 102, 241, 0.1)";
                badge.style.color = "var(--indigo)";
                advice.innerText = "Bisnis dalam kondisi sehat. Pastikan biaya operasional tetap terkontrol agar BEP konsisten.";
            } else {
                badge.innerText = "Resiko Tinggi (Margin Tipis)";
                badge.style.background = "rgba(239, 68, 68, 0.1)";
                badge.style.color = "#ef4444";
                advice.innerText = "Hati-hati, margin labamu di bawah 15%. Sedikit kenaikan biaya operasional bisa membuatmu rugi.";
            }

            // Hitung BEP
            const monthsToBEP = Math.ceil(initial / profitPerMonth);
            resStatus.innerHTML = `
                <div style="font-size: 55px; font-weight: 900; color: white; line-height: 1">
                    ${monthsToBEP} <span style="font-size: 18px; color: var(--sub); font-weight: 400">Bulan</span>
                </div>
            `;

            // Proyeksi Tabel
            tbody.innerHTML = "";
            let periods = [1, 3, 6, 12, 24];
            if (!periods.includes(monthsToBEP)) {
                periods.push(monthsToBEP);
                periods.sort((a, b) => a - b);
            }
            
            periods.forEach(m => {
                const totalProfit = profitPerMonth * m;
                const isBEP = totalProfit >= initial;
                const isExactBEP = m === monthsToBEP;

                tbody.innerHTML += `
                    <tr style="${isExactBEP ? 'background:rgba(34, 197, 94, 0.05);' : ''}">
                        <td style="${isExactBEP ? 'color:white; font-weight:bold' : ''}">Bulan ${m} ${isExactBEP ? '🚀' : ''}</td>
                        <td style="font-family:JetBrains Mono">Rp ${totalProfit.toLocaleString('id-ID')}</td>
                        <td>
                            <span style="font-size:9px; padding:3px 8px; border-radius:5px; background:${isBEP ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)'}; color:${isBEP ? '#22c55e' : '#ef4444'}; font-weight:800">
                                ${isBEP ? 'PROFIT' : 'MINUS'}
                            </span>
                        </td>
                    </tr>
                `;
            });

            resArea.scrollIntoView({ behavior: 'smooth' });
        };
    }
});