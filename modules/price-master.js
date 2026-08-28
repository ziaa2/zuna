Zuna.register({
    id: 'f-pricemaster',
    category: 'kreatif',
    title: 'Price Master',
    desc: 'Hitung HPP, Margin, & Harga Grosir',
    icon: 'ph ph-tag',
    html: `
        <style>
            @keyframes pm-pop {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); color: var(--green); }
                100% { transform: scale(1); }
            }
            .animate-pop { animation: pm-pop 0.3s ease-out; }
            .pm-res-box { background: rgba(0,255,136,0.05); padding: 25px; border-radius: 24px; border: 1px solid rgba(0,255,136,0.2); text-align: center; margin-bottom: 25px; }
            .pm-desc-box { background: rgba(255,255,255,0.02); padding: 15px; border-radius: 15px; border: 1px solid #1a1a1a; margin-bottom: 25px; }
            .pm-info-text { font-size: 10px; color: var(--sub); line-height: 1.4; margin-top: 5px; }
            .sync-indicator { font-size: 8px; color: var(--green); font-weight: 800; letter-spacing: 1px; }
        </style>

        <div class="tool-ui">
            <div class="pm-desc-box">
                <h3 style="font-size: 14px; margin-bottom: 8px; color: #fff;">Zuna Price Master</h3>
                <p style="font-size: 11px; color: var(--sub); line-height: 1.5;">
                    Gunakan alat ini untuk menentukan harga jual. Masukkan modal, lalu tentukan untung lewat Margin atau Markup.
                </p>
            </div>

            <div style="margin-bottom: 25px;">
                <span class="label">MODAL / HPP (BIAYA PRODUK)</span>
                <input type="text" id="pm-hpp" placeholder="Rp 0" oninput="Zuna.calcPriceMaster('margin')">
                <p class="pm-info-text">Total biaya beli barang + operasional per unit.</p>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px;">
                <div>
                    <span class="label">MARGIN (%) <span class="sync-indicator">◀</span></span>
                    <input type="number" id="pm-margin" value="30" oninput="Zuna.calcPriceMaster('margin')">
                    <p class="pm-info-text">Untung dari <b>Harga Jual</b>.</p>
                </div>
                <div>
                    <span class="label">MARKUP (%) <span class="sync-indicator">◀</span></span>
                    <input type="number" id="pm-markup" value="42.8" oninput="Zuna.calcPriceMaster('markup')">
                    <p class="pm-info-text">Untung dari <b>Harga Modal</b>.</p>
                </div>
            </div>

            <div class="pm-res-box">
                <span class="label" style="color: var(--green);">REKOMENDASI HARGA JUAL</span>
                <h1 id="pm-res-price" style="font-size: 36px; color: #fff; margin: 10px 0;">Rp 0</h1>
                <p id="pm-res-profit" style="font-size: 11px; color: var(--sub); font-weight: 800;">PROFIT BERSIH: Rp 0</p>
            </div>

            <div style="background: #111; padding: 20px; border-radius: 20px; margin-bottom: 25px;">
                <span class="label">SIMULASI DISKON PROMO (%)</span>
                <div style="display: flex; gap: 15px; align-items: center;">
                    <input type="number" id="pm-disc" value="10" style="margin-bottom: 0; width: 80px;" oninput="Zuna.calcPriceMaster('margin')">
                    <div style="flex: 1; text-align: right;">
                        <span id="pm-res-disc" style="font-size: 18px; font-weight: 800; color: var(--red);">Rp 0</span>
                        <p id="pm-res-disc-profit" style="font-size: 9px; color: var(--sub);">SISA UNTUNG: Rp 0</p>
                    </div>
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <span class="label">ESTIMASI HARGA GROSIR</span>
                <div id="pm-grosir-list" style="display: flex; flex-direction: column; gap: 10px;"></div>
            </div>
        </div>
    `,
    logic: () => {
        Zuna.bindFmt('pm-hpp');

        Zuna.calcPriceMaster = (source) => {
            const hpp = Zuna.val('pm-hpp');
            const elMargin = document.getElementById('pm-margin');
            const elMarkup = document.getElementById('pm-markup');
            const discPersen = parseFloat(document.getElementById('pm-disc').value) || 0;

            let hargaJual = 0;

            if (source === 'margin') {
                // Jika input dari MARGIN
                const margin = parseFloat(elMargin.value) || 0;
                if (margin >= 100) return; // Mencegah error pembagian nol
                hargaJual = hpp / (1 - (margin / 100));
                
                // Update Nilai Markup secara otomatis agar sinkron
                const markup = hpp > 0 ? ((hargaJual - hpp) / hpp) * 100 : 0;
                elMarkup.value = markup.toFixed(1);

            } else {
                // Jika input dari MARKUP
                const markup = parseFloat(elMarkup.value) || 0;
                hargaJual = hpp * (1 + (markup / 100));
                
                // Update Nilai Margin secara otomatis agar sinkron
                const margin = hargaJual > 0 ? ((hargaJual - hpp) / hargaJual) * 100 : 0;
                elMargin.value = margin.toFixed(1);
            }

            const profit = hargaJual - hpp;

            // Render Harga Utama
            const elPrice = document.getElementById('pm-res-price');
            elPrice.innerText = "Rp " + Zuna.fmt(Math.round(hargaJual || 0));
            
            elPrice.classList.remove('animate-pop');
            void elPrice.offsetWidth; 
            elPrice.classList.add('animate-pop');

            document.getElementById('pm-res-profit').innerText = "PROFIT BERSIH: Rp " + Zuna.fmt(Math.round(profit || 0));

            // Diskon
            const hargaDisc = hargaJual * (1 - (discPersen / 100));
            const profitDisc = hargaDisc - hpp;
            document.getElementById('pm-res-disc').innerText = "Rp " + Zuna.fmt(Math.round(hargaDisc || 0));
            const elDiscProfit = document.getElementById('pm-res-disc-profit');
            elDiscProfit.innerText = "SISA UNTUNG: Rp " + Zuna.fmt(Math.round(profitDisc || 0));
            elDiscProfit.style.color = profitDisc < 0 ? '#ff4444' : '#666';

            // Grosir
            const levels = [
                { qty: 12, disc: 5, label: 'HARGA LUSINAN (-5%)' },
                { qty: 50, disc: 10, label: 'PARTAI KECIL (-10%)' },
                { qty: 100, disc: 15, label: 'GROSIR BESAR (-15%)' }
            ];

            let grosirHTML = '';
            levels.forEach((lvl) => {
                const pGrosir = Math.round(hargaJual * (1 - (lvl.disc / 100)));
                grosirHTML += '<div style="display:flex; justify-content:space-between; align-items:center; background:#0d0d0d; padding:15px; border-radius:15px; border:1px solid #1a1a1a;">' +
                                '<div>' +
                                    '<p style="font-size:10px; font-weight:800; color:#fff;">' + lvl.label + '</p>' +
                                    '<p style="font-size:8px; color:var(--sub);">Min. Beli ' + lvl.qty + ' pcs</p>' +
                                '</div>' +
                                '<span style="font-size:14px; font-weight:800; color:var(--green);">Rp ' + Zuna.fmt(pGrosir) + '</span>' +
                              '</div>';
            });
            document.getElementById('pm-grosir-list').innerHTML = grosirHTML;
        };

        // Jalankan kalkulasi pertama kali
        setTimeout(() => Zuna.calcPriceMaster('margin'), 100);
    }
});