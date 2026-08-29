Zuna.register({
    id: 'f-pricemaster',
    category: 'kreatif',
    title: 'Price Master Pro',
    desc: 'Strategi Harga & Profit Maksimal',
    icon: 'ph ph-tag',
    html: `
        <style>
            @keyframes pm-pop {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); color: var(--green); }
                100% { transform: scale(1); }
            }
            .animate-pop { animation: pm-pop 0.3s ease-out; }
            .pm-res-box { 
                background: linear-gradient(135deg, rgba(0,255,136,0.1) 0%, rgba(0,0,0,0) 100%); 
                padding: 30px 25px; border-radius: 28px; border: 1px solid rgba(0,255,136,0.2); 
                text-align: center; margin-bottom: 25px;
            }
            .pm-desc-box { background: rgba(255,255,255,0.03); padding: 15px; border-radius: 18px; border: 1px dashed #333; margin-bottom: 25px; display: flex; gap: 12px; align-items: center; }
            .health-bar { width: 100%; height: 6px; background: #111; border-radius: 10px; margin: 15px 0; overflow: hidden; display: flex; }
        </style>

        <div class="tool-ui">
            <!-- Deskripsi Fitur -->
            <div class="pm-desc-box">
                <i class="ph ph-chart-pie-slice" style="font-size: 24px; color: var(--green)"></i>
                <div style="font-size: 11px; color: var(--sub); line-height: 1.5">
                    <b style="color:white; display:block">Profit Strategy Tool</b>
                    Tentukan harga jual ideal dengan memperhitungkan biaya admin, margin aman, dan psikologi harga.
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <span class="label">MODAL / HPP PRODUK</span>
                <input type="text" id="pm-hpp" placeholder="Rp 0" oninput="app_pm_calc('margin')">
                
                <div style="margin-top: 10px;">
                    <span class="label" style="font-size:9px">BIAYA OPERASIONAL / ADMIN (OPSIONAL)</span>
                    <input type="text" id="pm-admin" placeholder="Rp 0" oninput="app_pm_calc('margin')">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div>
                    <span class="label">MARGIN (%)</span>
                    <input type="number" id="pm-margin" value="30" oninput="app_pm_calc('margin')">
                </div>
                <div>
                    <span class="label">MARKUP (%)</span>
                    <input type="number" id="pm-markup" value="42.8" oninput="app_pm_calc('markup')">
                </div>
            </div>

            <div class="pm-res-box">
                <span class="label" style="color: var(--green); letter-spacing: 2px;">REKOMENDASI HARGA JUAL</span>
                <h1 id="pm-res-price" style="font-size: 42px; font-weight: 900; color: #fff; margin: 5px 0;">Rp 0</h1>
                
                <div class="health-bar">
                    <div id="pm-bar-inner" style="width: 0%; background: var(--green); transition: 0.5s"></div>
                </div>
                <p id="pm-res-health" style="font-size: 9px; font-weight: 800; text-transform: uppercase; color: var(--sub); margin-bottom:15px">-</p>

                <div style="padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.05)">
                    <p id="pm-res-profit" style="font-size: 13px; color: #fff; font-weight: 800; font-family: 'JetBrains Mono'">LABA: Rp 0</p>
                </div>
            </div>

            <!-- Psikologi Harga -->
            <div style="background: rgba(255,255,255,0.03); padding: 20px; border-radius: 20px; margin-bottom: 25px; border: 1px solid #1a1a1a;">
                <span class="label" style="display:flex; justify-content:space-between">PEMBULATAN PSIKOLOGI <span id="pm-res-psy" style="color:var(--green)">Normal</span></span>
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px; margin-top:10px">
                    <button onclick="app_pm_set_psy(0)" style="background:#000; color:white; border:1px solid #222; padding:10px; border-radius:8px; font-size:10px">NORMAL</button>
                    <button onclick="app_pm_set_psy(900)" style="background:#000; color:white; border:1px solid #222; padding:10px; border-radius:8px; font-size:10px">.900</button>
                    <button onclick="app_pm_set_psy(999)" style="background:#000; color:white; border:1px solid #222; padding:10px; border-radius:8px; font-size:10px">.999</button>
                </div>
            </div>

            <div style="background: #090909; padding: 20px; border-radius: 20px; margin-bottom: 25px;">
                <span class="label">SIMULASI DISKON (%)</span>
                <div style="display: flex; gap: 15px; align-items: center;">
                    <input type="number" id="pm-disc" value="10" style="margin-bottom: 0; width: 80px;" oninput="app_pm_calc('margin')">
                    <div style="flex: 1; text-align: right;">
                        <span id="pm-res-disc" style="font-size: 18px; font-weight: 800; color: var(--red);">Rp 0</span>
                        <p id="pm-res-disc-profit" style="font-size: 9px; color: var(--sub);">SISA LABA: Rp 0</p>
                    </div>
                </div>
            </div>

            <div id="pm-grosir-list" style="display: flex; flex-direction: column; gap: 10px; margin-bottom:25px"></div>
        </div>
    `,
    logic: () => {
        // Helper untuk ambil angka murni dari input yang ber-format (titik/koma)
        const getNum = (id) => {
            const val = document.getElementById(id).value;
            return parseFloat(val.replace(/[^0-9]/g, '')) || 0;
        };

        const fmt = (num) => Math.round(num).toLocaleString('id-ID');

        let psyVal = 0;

        window.app_pm_set_psy = (v) => {
            psyVal = v;
            document.getElementById('pm-res-psy').innerText = v === 0 ? "Normal" : "Akhiran " + v;
            window.app_pm_calc('margin');
        };

        window.app_pm_calc = (source) => {
            const hpp = getNum('pm-hpp');
            const admin = getNum('pm-admin');
            const totalHpp = hpp + admin;
            
            const elMargin = document.getElementById('pm-margin');
            const elMarkup = document.getElementById('pm-markup');
            const discPersen = parseFloat(document.getElementById('pm-disc').value) || 0;

            let hargaJual = 0;

            if (source === 'margin') {
                const m = parseFloat(elMargin.value) || 0;
                if (m >= 100) return;
                hargaJual = totalHpp / (1 - (m / 100));
                // Sync Markup
                elMarkup.value = totalHpp > 0 ? (((hargaJual - totalHpp) / totalHpp) * 100).toFixed(1) : 0;
            } else {
                const mk = parseFloat(elMarkup.value) || 0;
                hargaJual = totalHpp * (1 + (mk / 100));
                // Sync Margin
                elMargin.value = hargaJual > 0 ? (((hargaJual - totalHpp) / hargaJual) * 100).toFixed(1) : 0;
            }

            // Terapkan Psikologi Harga
            if (psyVal > 0 && hargaJual > 1000) {
                hargaJual = Math.floor(hargaJual / 1000) * 1000 + psyVal;
            }

            const profit = hargaJual - totalHpp;
            const marginActual = hargaJual > 0 ? (profit / hargaJual) * 100 : 0;

            // Update UI
            const elPrice = document.getElementById('pm-res-price');
            elPrice.innerText = "Rp " + fmt(hargaJual);
            document.getElementById('pm-res-profit').innerText = "LABA BERSIH: Rp " + fmt(profit);

            // Health Bar
            const bar = document.getElementById('pm-bar-inner');
            const hText = document.getElementById('pm-res-health');
            bar.style.width = Math.min(marginActual, 100) + "%";
            
            if (marginActual < 15) {
                bar.style.background = "var(--red)";
                hText.innerText = "Margin Tipis";
                hText.style.color = "var(--red)";
            } else if (marginActual < 35) {
                bar.style.background = "var(--indigo)";
                hText.innerText = "Margin Sehat";
                hText.style.color = "var(--indigo)";
            } else {
                bar.style.background = "var(--green)";
                hText.innerText = "Margin Tebal";
                hText.style.color = "var(--green)";
            }

            // Diskon
            const hDisc = hargaJual * (1 - (discPersen / 100));
            document.getElementById('pm-res-disc').innerText = "Rp " + fmt(hDisc);
            document.getElementById('pm-res-disc-profit').innerText = "SISA LABA: Rp " + fmt(hDisc - totalHpp);

            // Grosir
            let grosirHTML = '<span class="label">ESTIMASI GROSIR</span>';
            [ {l: 'LUSINAN (-5%)', d: 0.95}, {l: 'PARTAI (-10%)', d: 0.90} ].forEach(i => {
                grosirHTML += `
                <div style="display:flex; justify-content:space-between; background:#111; padding:12px 15px; border-radius:12px; border:1px solid #1a1a1a; margin-top:8px">
                    <span style="font-size:10px; color:#fff">${i.l}</span>
                    <span style="font-size:12px; font-weight:800; color:var(--green)">Rp ${fmt(hargaJual * i.d)}</span>
                </div>`;
            });
            document.getElementById('pm-grosir-list').innerHTML = grosirHTML;
        };

        // Format Otomatis saat ketik
        const setupFmt = (id) => {
            document.getElementById(id).addEventListener('input', (e) => {
                let v = e.target.value.replace(/[^0-9]/g, '');
                e.target.value = v ? parseInt(v).toLocaleString('id-ID') : '';
            });
        };
        setupFmt('pm-hpp');
        setupFmt('pm-admin');

        // Initial Calc
        window.app_pm_calc('margin');
    }
});