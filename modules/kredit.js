Zuna.register({
    id: 'f-kredit',
    title: 'Kredit Pro',
    category: 'keuangan', 
    desc: 'Cicilan KPR, Mobil & Motor',
    icon: 'ph ph-hand-coins',
    html: `
        <div class="animate-in">
            <!-- Box Deskripsi Fitur -->
            <div style="background: rgba(255, 255, 255, 0.03); border-radius: 15px; padding: 15px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1); display: flex; gap: 12px; align-items: center;">
                <i class="ph ph-info" style="font-size: 24px; color: var(--indigo)"></i>
                <div style="font-size: 11px; color: var(--sub); line-height: 1.5">
                    <b style="color:white; display:block; margin-bottom:2px">Smart Credit Analyzer</b>
                    Bandingkan metode <span style="color:white">Anuitas</span> (bunga menurun/KPR) vs <span style="color:white">Flat</span> (bunga tetap/Motor). Lihat rincian bunga yang kamu bayar setiap tahunnya.
                </div>
            </div>

            <div class="tool-ui" style="margin-bottom:15px">
                <span class="label">Jumlah Pinjaman (Pokok)</span>
                <input type="text" id="k-p" placeholder="Contoh: 100.000.000" oninput="this.value=Zuna.fmt(this.value)">
                
                <span class="label">Bunga % per Tahun</span>
                <input type="number" id="k-r" value="9" step="0.01" style="font-weight:bold; color:var(--green)">
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:20px">
                <div class="tool-ui" style="padding: 15px 20px; margin-bottom:0">
                    <span class="label">Tenor (Tahun)</span>
                    <input type="number" id="k-t" value="15" style="font-size:18px; margin-bottom:0; font-weight:bold">
                </div>
                <div class="tool-ui" style="padding: 15px 20px; margin-bottom:0">
                    <span class="label">Metode Bunga</span>
                    <select id="k-m" style="background:transparent; color:white; border:none; width:100%; font-size:13px; font-weight:bold; outline:none; cursor:pointer">
                        <option value="anuitas" style="color:black">Anuitas (KPR/Mobil)</option>
                        <option value="flat" style="color:black">Flat (Motor/HP)</option>
                    </select>
                </div>
            </div>

            <button class="btn-calc" id="k-btn" style="background: var(--indigo); color: white; font-weight:800; letter-spacing:1px; height:50px; border-radius:15px">HITUNG ANALISIS KREDIT</button>
            
            <div id="f-kredit-res" style="display:none; margin-top:30px">
                <!-- Result area -->
            </div>
        </div>

        <style>
            .kredit-summary { 
                background: white; 
                color: #000; 
                border-radius: 25px; 
                padding: 30px 25px; 
                box-shadow: 0 15px 35px rgba(0,0,0,0.2);
                position: relative;
                overflow: hidden;
            }
            .kredit-summary::before {
                content: ""; position: absolute; top:0; left:0; width:100%; height:5px; background: var(--indigo);
            }
            .kredit-grid { 
                display: grid; 
                grid-template-columns: 1fr 1fr; 
                gap: 15px; 
                margin-top: 25px; 
                border-top: 1px solid #eee; 
                padding-top: 20px; 
            }
            .year-row { cursor: pointer; transition: background 0.2s; }
            .year-row:hover { background: rgba(255,255,255,0.05); }
            
            .month-row { 
                display: flex; 
                justify-content: space-between; 
                font-size: 11px; 
                padding: 8px 0; 
                border-bottom: 1px solid #111;
                color: #888;
            }
            
            @keyframes revealUp { 
                from { opacity: 0; transform: translateY(30px); } 
                to { opacity: 1; transform: translateY(0); } 
            }
            .animate-reveal { animation: revealUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        </style>
    `,
    logic: () => {
        window.toggleKreditMonthly = (year) => {
            const row = document.getElementById(`k-detail-y-${year}`);
            const icon = document.getElementById(`k-icon-y-${year}`);
            const isHidden = row.style.display === 'none';
            
            row.style.display = isHidden ? 'table-row' : 'none';
            icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            icon.style.transition = '0.3s';
        };

        document.getElementById('k-btn').onclick = () => {
            const P = Zuna.val('k-p');
            const annualRate = parseFloat(document.getElementById('k-r').value) || 0;
            const years = parseInt(document.getElementById('k-t').value) || 0;
            const method = document.getElementById('k-m').value;
            
            if (!P || P <= 0) return alert("Masukkan jumlah pinjaman");

            const n = years * 12;
            const i = (annualRate / 100) / 12;
            
            let cicilan = method === 'anuitas' 
                ? (P * i * Math.pow(1 + i, n) / (Math.pow(1 + i, n) - 1)) 
                : ((P / n) + (P * (annualRate/100) / 12));
            
            let rowsHTML = '';
            let tempHutang = P;
            let totalBungaPaid = 0;

            for (let y = 1; y <= years; y++) {
                let monthlyHTML = '';
                let bungaTahunIni = 0;
                
                for (let m = 1; m <= 12; m++) {
                    let b = (method === 'anuitas') ? tempHutang * i : (P * (annualRate/100) / 12);
                    let pokokBulanan = cicilan - b;
                    tempHutang -= pokokBulanan;
                    bungaTahunIni += b;
                    totalBungaPaid += b;

                    monthlyHTML += `
                        <div class="month-row">
                            <span>Bulan ${(y-1)*12+m}</span>
                            <span style="color:#ef4444">Bunga: ${Math.round(b).toLocaleString('id')}</span>
                            <span>Sisa: ${Math.max(0, Math.round(tempHutang)).toLocaleString('id')}</span>
                        </div>`;
                }

                rowsHTML += `
                    <tr onclick="toggleKreditMonthly(${y})" class="year-row">
                        <td><div style="display:flex; align-items:center; gap:8px"><b>Thn ${y}</b><i class="ph ph-caret-down" id="k-icon-y-${y}" style="font-size:10px; color:var(--sub)"></i></div></td>
                        <td style="color:#ef4444">Rp ${Math.round(bungaTahunIni).toLocaleString('id')}</td>
                        <td>Rp ${Math.max(0, Math.round(tempHutang)).toLocaleString('id')}</td>
                    </tr>
                    <tr id="k-detail-y-${y}" style="display:none; background:#080808">
                        <td colspan="3">
                            <div style="padding:10px 20px; border-left:3px solid var(--indigo); margin:5px 0">
                                ${monthlyHTML}
                            </div>
                        </td>
                    </tr>`;
            }

            const totalBayar = cicilan * n;
            const res = document.getElementById('f-kredit-res');
            res.style.display = 'block';
            res.className = 'animate-reveal';
            
            res.innerHTML = `
                <div class="kredit-summary">
                    <span class="label" style="color:#888; letter-spacing:1px">ESTIMASI CICILAN / BULAN</span>
                    <h1 style="font-size:36px; margin:8px 0; font-weight:900; color:#111">Rp ${Math.round(cicilan).toLocaleString('id-ID')}</h1>
                    
                    <div class="kredit-grid">
                        <div>
                            <span class="label" style="color:#888; font-size:9px">TOTAL BUNGA</span>
                            <b style="color:#ef4444; font-size:14px; font-family:'JetBrains Mono'">Rp ${Math.round(totalBungaPaid).toLocaleString('id')}</b>
                        </div>
                        <div>
                            <span class="label" style="color:#888; font-size:9px">TOTAL PENGEMBALIAN</span>
                            <b style="color:#111; font-size:14px; font-family:'JetBrains Mono'">Rp ${Math.round(totalBayar).toLocaleString('id')}</b>
                        </div>
                    </div>
                </div>

                <div style="margin-top:30px">
                    <span class="label" style="text-align:center; display:block; margin-bottom:15px">JADWAL AMORTISASI TAHUNAN</span>
                    <div class="table-container" style="background:#111; border-radius:20px; border:1px solid #1a1a1a">
                        <table>
                            <thead>
                                <tr>
                                    <th>Periode</th>
                                    <th>Bunga</th>
                                    <th>Sisa Pokok</th>
                                </tr>
                            </thead>
                            <tbody>${rowsHTML}</tbody>
                        </table>
                    </div>
                </div>
            `;
            
            res.scrollIntoView({ behavior: 'smooth' });
        };
    }
});