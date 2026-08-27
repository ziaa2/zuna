Zuna.register({
    id: 'f-speedread',
    title: 'Speed Reader 2X',
    desc: 'Baca 2 kata sekaligus biar lebih kilat',
    icon: 'ph ph-lightning',
    html: `
        <div class="tool-ui" id="sr-input-area">
            <span class="label">Tempel Teks (Maks 10.000 Karakter)</span>
            <textarea id="sr-text" placeholder="Paste artikel di sini..." 
                style="height:150px; font-size:14px; line-height:1.5"></textarea>
            
            <div style="margin-top:15px">
                <span class="label">Kecepatan: <b id="sr-wpm-val">300</b> WPM</span>
                <input type="range" id="sr-wpm" min="100" max="1000" step="50" value="300" 
                    style="width:100%; margin:10px 0" oninput="document.getElementById('sr-wpm-val').innerText = this.value">
            </div>

            <button class="btn-calc" onclick="app_sr_start()" style="background:var(--green); color:#000">
                MULAI MEMBACA (2 KATA)
            </button>
        </div>

        <div id="sr-play-area" style="display:none; text-align:center; padding:50px 0">
            <!-- Tampilan 2 Kata -->
            <div id="sr-display" style="font-size:28px; font-weight:800; min-height:80px; display:flex; align-items:center; justify-content:center; color:white; font-family:'JetBrains Mono'; line-height:1.2"></div>
            
            <div style="width:100%; height:4px; background:#111; margin:30px 0; border-radius:10px; overflow:hidden">
                <div id="sr-progress" style="width:0%; height:100%; background:var(--green); transition:0.3s"></div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px">
                <button id="sr-btn-pause" class="btn-calc" onclick="app_sr_pause()" style="background:#222; color:#fff">PAUSE</button>
                <button class="btn-calc" onclick="app_sr_stop()" style="background:var(--red); color:#fff">STOP</button>
            </div>
        </div>
    `,
    logic: () => {
        let words = [];
        let index = 0;
        let timer = null;
        let isPaused = false;

        window.app_sr_start = () => {
            const rawText = document.getElementById('sr-text').value.trim();
            if (!rawText) return alert("Paste teks dulu!");

            // Pecah jadi array kata
            words = rawText.substring(0, 10000).split(/\s+/);
            index = 0;
            isPaused = false;

            document.getElementById('sr-input-area').style.display = 'none';
            document.getElementById('sr-play-area').style.display = 'block';
            
            app_sr_play();
        };

        window.app_sr_play = () => {
            const wpm = document.getElementById('sr-wpm').value;
            // Karena muncul 2 kata sekaligus, durasi tiap muncul dikali 2
            // Rumus: (60.000ms / WPM) * 2
            const ms = (60000 / wpm) * 2; 

            timer = setInterval(() => {
                if (index < words.length) {
                    // Ambil 2 kata menggunakan slice
                    const chunk = words.slice(index, index + 2).join(" ");
                    
                    document.getElementById('sr-display').innerText = chunk;
                    
                    // Update Progress
                    const progress = ((index + 2) / words.length) * 100;
                    document.getElementById('sr-progress').style.width = progress + '%';
                    
                    index += 2; // Lompat 2 kata
                } else {
                    app_sr_stop();
                }
            }, ms);
        };

        window.app_sr_pause = () => {
            const btn = document.getElementById('sr-btn-pause');
            if (!isPaused) {
                clearInterval(timer);
                btn.innerText = "RESUME";
                isPaused = true;
            } else {
                app_sr_play();
                btn.innerText = "PAUSE";
                isPaused = false;
            }
        };

        window.app_sr_stop = () => {
            clearInterval(timer);
            document.getElementById('sr-input-area').style.display = 'block';
            document.getElementById('sr-play-area').style.display = 'none';
            document.getElementById('sr-display').innerText = "";
        };
    }
});