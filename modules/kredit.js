Zuna.register({
    id: 'f-kredit',
    title: 'Kredit Pro',
    category: 'keuangan', 
    desc: 'Cicilan KPR & Motor',
    icon: 'ph ph-hand-coins',
    html: `
        <div class="animate-in">
            <div class="tool-ui" style="margin-bottom:15px">
                <span class="label">Jumlah Pinjaman (Pokok)</span>
                <input type="text" id="k-p" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
                
                <span class="label">Bunga % / Tahun</span>
                <input type="number" id="k-r" value="9" step="0.01">
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:20px">
                <div class="tool-ui" style="padding: 15px 20px; margin-bottom:0">
                    <span class="label">Tenor (Tahun)</span>
                    <input type="number" id="k-t" value="15" style="font-size:18px; margin-bottom:0">
                </div>
                <div class="tool-ui" style="padding: 15px 20px; margin-bottom:0">
                    <span class="label">Metode</span>
                    <select id="k-m" style="background:transparent; color:white; border:none; width:100%; font-size:12px; font-weight:bold; outline:none">
                        <option value="anuitas" style="color:black">Anuitas (KPR)</option>
                        <option value="flat" style="color:black">Flat (Motor)</option>
                    </select>
                </div>
            </div>

            <button class="btn-calc" id="k-btn" style="background: white; color: black;">HITUNG CICILAN</button>
            <div id="f-kredit-res" style="display:none; margin-top:25px"></div>
        </div>

        <style>
            .kredit-summary { background: #fff; color: #000; border-radius: 25px; padding: 25px; animation: reveal 0.5s ease-out; }
            .kredit-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px; }
            @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        </style>
    `,
    logic: () => {
        window.toggleKreditMonthly = (year) => {
            const row = document.getElementById(`k-detail-y-${year}`);
            const icon = document.getElementById(`k-icon-y-${year}`);
            row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
            icon.style.transform = row.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
        };

        document.getElementById('k-btn').onclick = () => {
            const P = Zuna.val('k-p'), annualRate = parseFloat(document.getElementById('k-r').value) || 0;
            const years = parseInt(document.getElementById('k-t').value) || 0, method = document.getElementById('k-m').value;
            const n = years * 12, i = (annualRate / 100) / 12;
            
            let cicilan = method === 'anuitas' ? (P * i * Math.pow(1 + i, n) / (Math.pow(1 + i, n) - 1)) : ((P / n) + (P * (annualRate/100) / 12));
            let rowsHTML = '', tempHutang = P, akmBunga = 0;

            for (let y = 1; y <= years; y++) {
                let monthlyHTML = '', bungaThn = 0;
                for (let m = 1; m <= 12; m++) {
                    let b = (method === 'anuitas') ? tempHutang * i : (P * (annualRate/100) / 12);
                    tempHutang -= (cicilan - b); akmBunga += b;
                    monthlyHTML += `<div class="month-row"><span>Bulan ${(y-1)*12+m}</span><span style="color:var(--red)">Bunga: ${Math.round(b).toLocaleString('id')}</span><span>Sisa: ${Math.max(0, Math.round(tempHutang)).toLocaleString('id')}</span></div>`;
                }
                rowsHTML += `<tr onclick="toggleKreditMonthly(${y})" class="year-row"><td><b>Tahun ${y}</b></td><td style="color:var(--red)">Rp ${Math.round(akmBunga).toLocaleString('id')}</td><td>Rp ${Math.max(0, Math.round(tempHutang)).toLocaleString('id')}</td><td><i class="ph ph-caret-down" id="k-icon-y-${y}"></i></td></tr>
                             <tr id="k-detail-y-${y}" style="display:none; background:#050505"><td colspan="4"><div style="padding:15px; border-left:2px solid var(--red); margin:10px">${monthlyHTML}</div></td></tr>`;
            }

            const res = document.getElementById('f-kredit-res');
            res.style.display = 'block';
            res.innerHTML = `
                <div class="kredit-summary">
                    <span class="label" style="color:#666">CICILAN PER BULAN</span>
                    <h1 style="font-size:32px; margin:5px 0">Rp ${Math.round(cicilan).toLocaleString('id-ID')}</h1>
                    <div class="kredit-grid">
                        <div><span class="label" style="color:#666">TOTAL BUNGA</span><b style="color:var(--red)">Rp ${Math.round(akmBunga).toLocaleString('id')}</b></div>
                        <div><span class="label" style="color:#666">TOTAL BAYAR</span><b>Rp ${Math.round(cicilan * n).toLocaleString('id')}</b></div>
                    </div>
                </div>
                <div class="table-container" style="margin-top:20px"><table>
                    <thead><tr><th>Tahun</th><th>Bunga Dibayar</th><th>Sisa Pokok</th><th></th></tr></thead>
                    <tbody>${rowsHTML}</tbody>
                </table></div>`;
            res.scrollIntoView({ behavior: 'smooth' });
        };
    }
});
