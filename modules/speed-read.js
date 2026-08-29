Zuna.register({
    id: 'f-speedread',
    category: 'tools', 
    title: 'Speed Reader Pro',
    desc: 'Baca kilat dengan teknik RSVP',
    icon: 'ph ph-lightning',
    html: `
        <div class="tool-ui animate-in">
            <!-- Box Deskripsi Fitur -->
            <div style="background: rgba(0, 255, 149, 0.05); border-radius: 15px; padding: 15px; margin-bottom: 25px; border: 1px solid rgba(0, 255, 149, 0.1); display: flex; gap: 12px; align-items: center;">
                <i class="ph ph-brain" style="font-size: 24px; color: var(--green)"></i>
                <div style="font-size: 11px; color: var(--sub); line-height: 1.5">
                    <b style="color:white; display:block; margin-bottom:2px">Teknik RSVP Reading</b>
                    Latih otak untuk memproses kata tanpa "subvocalizing" (membaca dalam hati). Fokus pada titik tengah untuk kecepatan baca maksimal.
                </div>
            </div>

            <div id="sr-input-area">
                <span class="label">TEMPEL TEKS ARTIKEL</span>
                <textarea id="sr-text" placeholder="Tempel teks yang ingin dibaca cepat di sini..." 
                    style="height:150px; font-size:14px; line-height:1.6; background: rgba(255,255,255,0.02); border: 1px solid #222; border-radius:15px; padding:15px; color:#eee"></textarea>
                
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; margin-top:20px">
                    <div>
                        <span class="label">KECEPATAN: <b id="sr-wpm-val" style="color:var(--green)">300</b> WPM</span>
                        <input type="range" id="sr-wpm" min="100" max="1000" step="50" value="300" 
                            style="width:100%; margin:10px 0" oninput="document.getElementById('sr-wpm-val').innerText = this.value">
                    </div>
                    <div>
                        <span class="label">CHUNK (KATA)</span>
                        <select id="sr-chunk" style="width:100%; background:#111; color:white; border:1px solid #222; padding:8px; border-radius:10px; margin-top:5px; outline:none">
                            <option value="1">1 Kata</option>
                            <option value="2" selected>2 Kata</option>
                            <option value="3">3 Kata</option>
                        </select>
                    </div>
                </div>

                <button class="btn-calc" onclick="app_sr_start()" style="background:var(--green); color:#000; font-weight:800; margin-top:20px; border-radius:15px">
                    MULAI LATIHAN BACA
                </button>
            </div>

            <!-- Play Area -->
            <div id="sr-play-area" style="display:none; text-align:center; padding:30px 0">
                <div style="font-size:10px; color:var(--sub); margin-bottom:10px; letter-spacing:2px">FOKUS PADA TITIK TENGAH</div>
                
                <div class="display-box" style="position:relative; background:#0a0a0a; border:1px solid #1a1a1a; height:120px; border-radius:20px; display:flex; align-items:center; justify-content:center; overflow:hidden">
                    <!-- Garis Fokus -->
                    <div style="position:absolute; top:0; left:50%; width:2px; height:10px; background:var(--green); opacity:0.5"></div>
                    <div style="position:absolute; bottom:0; left:50%; width:2px; height:10px; background:var(--green); opacity:0.5"></div>
                    
                    <div id="sr-display" style="font-size:26px; font-weight:800; color:white; font-family:'JetBrains Mono'; line-height:1.2; padding:0 20px; text-shadow: 0 0 15px rgba(255,255,255,0.2)"></div>
                </div>
                
                <div style="display:flex; justify-content:space-between; margin:20px 0 5px 0">
                    <span id="sr-timer-rem" style="font-size:10px; color:var(--sub)">Sisa: --:--</span>
                    <span id="sr-percent" style="font-size:10px; color:var(--green); font-weight:800">0%</span>
                </div>

                <div style="width:100%; height:6px; background:#111; margin-bottom:30px; border-radius:10px; overflow:hidden; border:1px solid #1a1a1a">
                    <div id="sr-progress" style="width:0%; height:100%; background:var(--green); transition:0.3s cubic-bezier(0.4, 0, 0.2, 1)"></div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px">
                    <button id="sr-btn-pause" class="btn-calc" onclick="app_sr_pause()" style="background:#222; color:#fff; border-radius:12px">PAUSE</button>
                    <button class="btn-calc" onclick="app_sr_stop()" style="background:rgba(239, 68, 68, 0.1); color:var(--red); border:1px solid rgba(239, 68, 68, 0.2); border-radius:12px">STOP</button>
                </div>
            </div>
        </div>

        <style>
            @keyframes srPulse { from { opacity: 0.8; } to { opacity: 1; } }
            #sr-display { animation: srPulse 0.1s infinite alternate; }
            #sr-text:focus { border-color: var(--green) !important; outline: none; }
        </style>
    `,
    logic: () => {
        let words = [];
        let index = 0;
        let timer = null;
        let isPaused = false;
        let chunkSize = 2;

        window.app_sr_start = () => {
            const rawText = document.getElementById('sr-text').value.trim();
            if (!rawText) return alert("Tempel teks dulu!");

            words = rawText.substring(0, 15000).split(/\s+/);
            index = 0;
            isPaused = false;
            chunkSize = parseInt(document.getElementById('sr-chunk').value);

            document.getElementById('sr-input-area').style.display = 'none';
            document.getElementById('sr-play-area').style.display = 'block';
            
            app_sr_play();
        };

        window.app_sr_play = () => {
            const wpm = document.getElementById('sr-wpm').value;
            // Interval dihitung berdasarkan WPM dan jumlah kata per muncul
            const ms = (60000 / wpm) * chunkSize; 

            timer = setInterval(() => {
                if (index < words.length) {
                    const chunk = words.slice(index, index + chunkSize).join(" ");
                    document.getElementById('sr-display').innerText = chunk;
                    
                    // Update Progress & UI
                    const progress = Math.min(((index + chunkSize) / words.length) * 100, 100);
                    document.getElementById('sr-progress').style.width = progress + '%';
                    document.getElementById('sr-percent').innerText = Math.round(progress) + '%';
                    
                    // Estimasi Sisa Waktu
                    const remainingWords = words.length - index;
                    const remSec = Math.round((remainingWords / wpm) * 60);
                    const min = Math.floor(remSec / 60);
                    const sec = remSec % 60;
                    document.getElementById('sr-timer-rem').innerText = `Sisa: ${min}:${sec.toString().padStart(2, '0')}`;
                    
                    index += chunkSize;
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
                btn.style.background = "var(--green)";
                btn.style.color = "#000";
                isPaused = true;
            } else {
                app_sr_play();
                btn.innerText = "PAUSE";
                btn.style.background = "#222";
                btn.style.color = "#fff";
                isPaused = false;
            }
        };

        window.app_sr_stop = () => {
            clearInterval(timer);
            document.getElementById('sr-input-area').style.display = 'block';
            document.getElementById('sr-play-area').style.display = 'none';
            document.getElementById('sr-display').innerText = "";
            document.getElementById('sr-progress').style.width = '0%';
        };
    }
});