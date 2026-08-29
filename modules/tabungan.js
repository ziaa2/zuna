Zuna.register({
    id: 'f-tabungan',
    category: 'keuangan', 
    title: 'Wealth Pro',
    desc: 'Simulasi Compound Interest & Goal',
    icon: 'ph ph-chart-line-up',
    html: `
        <div class="animate-in">
            <!-- Header Info -->
            <div style="background: rgba(34, 197, 94, 0.05); border-radius: 15px; padding: 15px; margin-bottom: 25px; border: 1px solid rgba(34, 197, 94, 0.1); display: flex; gap: 12px; align-items: center;">
                <i class="ph ph-magic-wand" style="font-size: 24px; color: var(--green)"></i>
                <div style="font-size: 11px; color: var(--sub); line-height: 1.5">
                    <b style="color:white; display:block; margin-bottom:2px">The Power of Compounding</b>
                    Lihat bagaimana uangmu bekerja. Simulasi ini menghitung bunga majemuk bulanan untuk membantu perencanaan masa depanmu.
                </div>
            </div>

            <div class="tool-ui" style="margin-bottom:15px">
                <span class="label">MODAL AWAL (LUMP SUM)</span>
                <input type="text" id="t-p" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
                
                <span class="label">SIMPANAN RUTIN / BULAN</span>
                <input type="text" id="t-m" placeholder="0" oninput="this.value=Zuna.fmt(this.value)">
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:20px">
                <div class="tool-ui" style="padding: 15px 20px; margin-bottom:0">
                    <span class="label">BUNGA (% / THN)</span>
                    <input type="number" id="t-r" value="10" step="0.1" style="font-size:18px; margin-bottom:0; font-weight:800; color:var(--green)">
                </div>
                <div class="tool-ui" style="padding: 15px 20px; margin-bottom:0">
                    <span class="label">DURASI (THN)</span>
                    <input type="number" id="t-t" value="10" style="font-size:18px; margin-bottom:0; font-weight:800">
                </div>
            </div>

            <button class="btn-calc" id="t-btn" style="background: var(--green); color: black; font-weight:900; letter-spacing:1px; height:50px; border-radius:15px">HASILKAN PROYEKSI KEKAYAAN</button>
            
            <!-- Result Section -->
            <div id="f-tabungan-res" style="display:none; margin-top:30px">
                <!-- Summary Card -->
                <div class="res-card-pro">
                    <span class="label" style="letter-spacing:2px">PROYEKSI AKHIR</span>
                    <h1 id="res-final-balance" style="color:var(--green); font-size:38px; margin:10px 0; font-weight:900">Rp 0</h1>
                    
                    <!-- Progress Bar Modal vs Bunga -->
                    <div style="height: 8px; background: #222; border-radius: 10px; margin: 20px 0; overflow: hidden; display: flex;">
                        <div id="bar-modal" style="height: 100%; background: #eee; width: 50%; transition: 1s cubic-bezier(0.16, 1, 0.3, 1)"></div>
                        <div id="bar-bunga" style="height: 100%; background: var(--green); width: 50%; transition: 1s cubic-bezier(0.16, 1, 0.3, 1)"></div>
                    </div>

                    <div class="res-grid-mini">
                        <div class="mini-box">
                            <span class="label" style="font-size:9px">TOTAL MODAL</span>
                            <b id="res-total-modal" style="font-size:13px; color:#fff">Rp 0</b>
                        </div>
                        <div class="mini-box">
                            <span class="label" style="font-size:9px">HASIL BUNGA</span>
                            <b id="res-total-interest" style="color:var(--green); font-size:13px">Rp 0</b>
                        </div>
                    </div>
                </div>

                <!-- Milestone Info -->
                <div id="milestone-box" style="margin-top:20px; background:rgba(255,255,255,0.02); padding:15px; border-radius:15px; border:1px dashed #333; display:none">
                    <span class="label" style="font-size:9px; color:var(--green)">⭐ MILESTONE TERCAPAI</span>
                    <p id="milestone-text" style="font-size:11px; color:#ccc; margin-top:5px; line-height:1.4"></p>
                </div>

                <!-- Detail Table -->
                <div class="table-container" style="margin-top:25px; background:#111; border-radius:20px; border:1px solid #1a1a1a">
                    <p style="font-size:10px; font-weight:800; color:var(--sub); text-align:center; padding:15px 0 5px 0">RINCIAN PERTUMBUHAN TAHUNAN</p>
                    <table style="width:100%">
                        <thead>
                            <tr>
                                <th>Tahun</th>
                                <th>Modal</th>
                                <th>Hasil Akhir</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="t-table-body"></tbody>
                    </table>
                </div>
                <p style="font-size:9px; color:var(--sub); text-align:center; margin-top:20px; line-height:1.5">
                    *Perhitungan menggunakan bunga majemuk bulanan.<br>Hasil akhir adalah estimasi kotor sebelum pajak.
                </p>
            </div>
        </div>

        <style>
            .res-card-pro { 
                background: linear-gradient(145deg, #111 0%, #050505 100%); 
                border: 1px solid #222; 
                border-radius: 28px; 
                padding: 30px 25px; 
                text-align: center;
                box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            }
            .res-grid-mini { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 15px; }
            .mini-box { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 18px; border: 1px solid rgba(255,255,255,0.05); text-align: left; }
            .year-row { transition: background 0.2s; }
            .year-row:active { background: rgba(255,255,255,0.05); }
            .month-row { display: flex; justify-content: space-between; font-size: 11px; font-family: 'JetBrains Mono'; padding: 10px 0; border-bottom: 1px solid #111; color: #888; }
            
            @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
            .animate-res { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        </style>
    `,
    logic: () => {
        window.toggleMonthly = (year) => {
            const detailRow = document.getElementById(`detail-y-${year}`);
            const icon = document.getElementById(`icon-y-${year}`);
            const isHidden = detailRow.style.display === 'none';
            
            detailRow.style.display = isHidden ? 'table-row' : 'none';
            icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
            icon.style.transition = '0.3s';
        };

        document.getElementById('t-btn').onclick = () => {
            const principal = Zuna.val('t-p'), monthly = Zuna.val('t-m');
            const annualRate = parseFloat(document.getElementById('t-r').value) || 0;
            const years = parseInt(document.getElementById('t-t').value) || 0;
            
            if (years <= 0) return alert("Masukkan durasi minimal 1 tahun");

            const r = (annualRate / 100) / 12;
            let currentBalance = principal, totalInvested = principal;
            let rowsHTML = '';
            
            // Milestone Finder
            let milestone100m = false, milestone1b = false;
            let milestoneText = "";

            for (let y = 1; y <= years; y++) {
                let monthlyHTML = '';
                let interestThisYear = 0;
                
                for (let m = 1; m <= 12; m++) {
                    let interest = currentBalance * r;
                    interestThisYear += interest;
                    currentBalance += monthly + interest;
                    totalInvested += monthly;
                    
                    // Check Milestones
                    if (!milestone100m && currentBalance >= 100000000) {
                        milestone100m = true;
                        milestoneText += `Kamu mencapai <b>Rp 100 Juta</b> pertama di Tahun ke-${y}, Bulan ke-${m}.<br>`;
                    }
                    if (!milestone1b && currentBalance >= 1000000000) {
                        milestone1b = true;
                        milestoneText += `Kamu mencapai <b>Rp 1 Miliar</b> pertama di Tahun ke-${y}, Bulan ke-${m}.<br>`;
                    }

                    monthlyHTML += `
                        <div class="month-row">
                            <span>Bulan ${m}</span>
                            <span style="color:var(--green)">+${Math.round(interest).toLocaleString('id')}</span>
                            <span style="color:#fff">${Math.round(currentBalance).toLocaleString('id')}</span>
                        </div>`;
                }

                rowsHTML += `
                    <tr onclick="toggleMonthly(${y})" class="year-row" style="cursor:pointer">
                        <td><div style="display:flex; align-items:center; gap:5px"><b>Thn ${y}</b><i class="ph ph-caret-down" id="icon-y-${y}" style="font-size:10px; color:var(--sub)"></i></div></td>
                        <td><small style="opacity:0.5">Rp</small> ${Math.round(totalInvested).toLocaleString('id-ID')}</td>
                        <td style="color:var(--green); font-weight:800">Rp ${Math.round(currentBalance).toLocaleString('id-ID')}</td>
                    </tr>
                    <tr id="detail-y-${y}" style="display:none; background:#080808">
                        <td colspan="3">
                            <div style="padding:10px 20px; border-left:3px solid var(--green); margin:5px 0">
                                ${monthlyHTML}
                            </div>
                        </td>
                    </tr>`;
            }

            // Update UI
            const resSection = document.getElementById('f-tabungan-res');
            resSection.style.display = 'block';
            resSection.className = 'animate-res';

            document.getElementById('res-final-balance').innerText = "Rp " + Math.round(currentBalance).toLocaleString('id-ID');
            document.getElementById('res-total-modal').innerText = "Rp " + totalInvested.toLocaleString('id-ID');
            document.getElementById('res-total-interest').innerText = "Rp " + Math.round(currentBalance - totalInvested).toLocaleString('id-ID');

            // Milestone Box
            const mBox = document.getElementById('milestone-box');
            if (milestoneText) {
                mBox.style.display = 'block';
                document.getElementById('milestone-text').innerHTML = milestoneText;
            } else {
                mBox.style.display = 'none';
            }

            // Progress Bar Logic
            const modalPercent = (totalInvested / currentBalance) * 100;
            document.getElementById('bar-modal').style.width = modalPercent + '%';
            document.getElementById('bar-bunga').style.width = (100 - modalPercent) + '%';

            document.getElementById('t-table-body').innerHTML = rowsHTML;
            resSection.scrollIntoView({ behavior: 'smooth' });
        };
    }
});