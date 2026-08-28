Zuna.register({
    id: 'f-budget',
    category:'keuangan', 
    title: 'Salary Splitter',
    desc: 'Atur gaji dengan rumus 50/30/20',
    icon: 'ph ph-wallet',
    html: `
        <div class="tool-ui">
            <span class="label">Total Gaji Bulanan</span>
            <input type="text" id="salary-input" placeholder="Rp 0" 
                style="color:var(--green); border-bottom: 2px solid #222; font-family:'JetBrains Mono'">
            
            <div class="context-box" style="margin-top:10px; font-size:10px; color:var(--sub)">
                Gunakan titik otomatis untuk mempermudah input.
            </div>
        </div>

        <div id="budget-res" style="display:none; flex-direction:column; gap:12px; margin-top:20px">
            <div class="res-card">
                <span class="label">KEBUTUHAN (50%)</span>
                <span id="res-needs" class="res-num" style="color:#fff">Rp 0</span>
            </div>
            <div class="res-card">
                <span class="label">KEINGINAN (30%)</span>
                <span id="res-wants" class="res-num" style="color:#fff">Rp 0</span>
            </div>
            <div class="res-card">
                <span class="label">TABUNGAN (20%)</span>
                <span id="res-savings" class="res-num" style="color:#fff">Rp 0</span>
            </div>
        </div>

        <style>
            .res-card { background: #0a0a0a; border: 1px solid #1a1a1a; padding: 20px; border-radius: 20px; }
            .res-card .label { color: var(--sub); margin-bottom: 8px; }
        </style>
    `,
    logic: () => {
        // Fungsi hitung
        const calculate = () => {
            const salary = Zuna.val('salary-input');
            const resDiv = document.getElementById('budget-res');
            
            if (salary <= 0) {
                resDiv.style.display = 'none';
                return;
            }

            resDiv.style.display = 'flex';
            document.getElementById('res-needs').innerText = 'Rp ' + Zuna.fmt((salary * 0.5).toString());
            document.getElementById('res-wants').innerText = 'Rp ' + Zuna.fmt((salary * 0.3).toString());
            document.getElementById('res-savings').innerText = 'Rp ' + Zuna.fmt((salary * 0.2).toString());
        };

        // Pasang format titik otomatis & auto-hitung
        Zuna.bindFmt('salary-input', calculate);
    }
});
