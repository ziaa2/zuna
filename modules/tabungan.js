Zuna.register({
    id: 'f-tabungan',
    category: 'keuangan', 
    title: 'Wealth Pro',
    desc: 'Simulasi & Detail Bulanan',
    icon: 'ph ph-chart-line-up',
    html: `
        <div class="animate-in">
            <div class="tool-ui" style="margin-bottom:15px">
                <span class="label">Uang Pangkal / Modal Awal</span>
                <input type="text" id="t-p" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
                
                <span class="label">Simpanan Rutin / Per Bulan</span>
                <input type="text" id="t-m" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:20px">
                <div class="tool-ui" style="padding: 15px 20px; margin-bottom:0">
                    <span class="label">Bunga % / Thn</span>
                    <input type="number" id="t-r" value="10" step="0.1" style="font-size:18px; margin-bottom:0">
                </div>
                <div class="tool-ui" style="padding: 15px 20px; margin-bottom:0">
                    <span class="label">Durasi (Thn)</span>
                    <input type="number" id="t-t" value="10" style="font-size:18px; margin-bottom:0">
                </div>
            </div>

            <button class="btn-calc" id="t-btn" style="background: var(--green); color: black;">HASILKAN PROYEKSI</button>
            
            <div id="f-tabungan-res" style="display:none; margin-top:25px"></div>
        </div>

        <style>
            .res-card-pro { background: var(--panel); border: 1px solid var(--border); border-radius: 25px; padding: 25px; text-align: center; animation: reveal 0.5s ease-out; }
            .res-grid-mini { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 15px; }
            .mini-box { background: #111; padding: 12px; border-radius: 15px; border: 1px solid #1a1a1a; text-align: left; }
            @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            .month-row { display: flex; justify-content: space-between; font-size: 10px; font-family: 'JetBrains Mono'; padding: 8px 0; border-bottom: 1px solid #111; }
        </style>
    `,
    logic: () => {
        window.toggleMonthly = (year) => {
            const detailRow = document.getElementById(`detail-y-${year}`);
            const icon = document.getElementById(`icon-y-${year}`);
            detailRow.style.display = detailRow.style.display === 'none' ? 'table-row' : 'none';
            icon.style.transform = detailRow.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
        };

        document.getElementById('t-btn').onclick = () => {
            const principal = Zuna.val('t-p'), monthly = Zuna.val('t-m');
            const annualRate = parseFloat(document.getElementById('t-r').value) || 0;
            const years = parseInt(document.getElementById('t-t').value) || 0;
            
            const r = (annualRate / 100) / 12;
            let currentBalance = principal, totalInvested = principal;
            let rowsHTML = '';

            for (let y = 1; y <= years; y++) {
                let monthlyHTML = '';
                for (let m = 1; m <= 12; m++) {
                    let interest = currentBalance * r;
                    currentBalance += monthly + interest;
                    totalInvested += monthly;
                    monthlyHTML += `<div class="month-row"><span>Bulan ${m}</span><span style="color:var(--green)">+${Math.round(interest).toLocaleString('id')}</span><span>${Math.round(currentBalance).toLocaleString('id')}</span></div>`;
                }
                rowsHTML += `
                    <tr onclick="toggleMonthly(${y})" style="cursor:pointer" class="year-row">
                        <td><b>Thn ${y}</b></td>
                        <td><small>Rp</small>${Math.round(totalInvested).toLocaleString('id-ID')}</td>
                        <td style="color:var(--green); font-weight:800">Rp ${Math.round(currentBalance).toLocaleString('id-ID')}</td>
                        <td><i class="ph ph-caret-down" id="icon-y-${y}" style="transition:0.3s"></i></td>
                    </tr>
                    <tr id="detail-y-${y}" style="display:none; background:#050505"><td colspan="4"><div style="padding:15px; border-left:2px solid var(--green); margin:10px">${monthlyHTML}</div></td></tr>`;
            }

            const res = document.getElementById('f-tabungan-res');
            res.style.display = 'block';
            res.innerHTML = `
                <div class="res-card-pro">
                    <span class="label">ESTIMASI TOTAL AKHIR</span>
                    <h1 style="color:var(--green); font-size:32px; margin:10px 0">Rp ${Math.round(currentBalance).toLocaleString('id-ID')}</h1>
                    <div class="res-grid-mini">
                        <div class="mini-box"><span class="label">TOTAL MODAL</span><b style="font-size:12px">Rp ${totalInvested.toLocaleString('id')}</b></div>
                        <div class="mini-box"><span class="label">TOTAL BUNGA</span><b style="color:var(--green); font-size:12px">Rp ${Math.round(currentBalance - totalInvested).toLocaleString('id')}</b></div>
                    </div>
                </div>
                <div class="table-container" style="margin-top:20px"><table>
                    <thead><tr><th>Tahun</th><th>Modal</th><th>Hasil</th><th></th></tr></thead>
                    <tbody>${rowsHTML}</tbody>
                </table></div>`;
            res.scrollIntoView({ behavior: 'smooth' });
        };
    }
});
