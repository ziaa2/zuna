Zuna.register({
    id: 'f-booksearch',
    category: 'produktivitas',
    title: 'Zuna Books',
    desc: 'Eksplorasi Jutaan Judul Buku',
    icon: 'ph ph-books',
    html: `
        <style>
            /* --- REFINED STYLES --- */
            @keyframes bookReveal {
                from { opacity: 0; transform: translateY(15px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .book-card {
                background: linear-gradient(145deg, #0f0f0f 0%, #050505 100%); 
                border: 1px solid #1a1a1a; border-radius: 20px;
                padding: 15px; display: flex; gap: 15px; margin-bottom: 15px;
                animation: bookReveal 0.4s ease-out forwards; opacity: 0; cursor: pointer;
                transition: all 0.2s ease;
            }
            .book-card:hover { border-color: var(--green); background: #111; }
            .book-card:active { transform: scale(0.97); }
            
            .book-cover {
                width: 80px; height: 115px; background: #1a1a1a; border-radius: 10px;
                object-fit: cover; flex-shrink: 0; box-shadow: 5px 5px 15px rgba(0,0,0,0.5);
            }

            .book-info { display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
            .book-title { font-size: 14px; font-weight: 800; color: #fff; margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
            .book-author { color: var(--green); font-size: 12px; font-weight: 600; margin-bottom: 8px; }
            .book-meta { font-size: 10px; color: #555; display: flex; align-items: center; gap: 5px; }

            /* --- DETAIL SHEET --- */
            #bs-detail-sheet {
                position: fixed; bottom: 0; left: 0; width: 100%; height: 90%;
                background: #080808; border-top: 1px solid #222; border-radius: 30px 30px 0 0;
                z-index: 2000; transform: translateY(100%); transition: 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                padding: 25px; overflow-y: auto;
            }
            #bs-detail-sheet.active { transform: translateY(0); }
            .sheet-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 1999;
                display: none; animation: fadeIn 0.3s;
            }

            .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
            .meta-item { background: #111; padding: 12px; border-radius: 15px; border: 1px solid #1a1a1a; text-align: center; }
            .meta-val { display: block; font-size: 14px; font-weight: 800; color: white; }
            .meta-lab { font-size: 9px; color: var(--sub); text-transform: uppercase; letter-spacing: 1px; }

            /* LOADER */
            .loader-line { width: 100%; height: 3px; background: #111; overflow: hidden; border-radius: 10px; display: none; margin-bottom: 20px; }
            .loader-bar { width: 40%; height: 100%; background: var(--green); animation: loadMove 1.5s infinite linear; }
            @keyframes loadMove { from { margin-left: -40%; } to { margin-left: 100%; } }
        </style>

        <div class="tool-ui">
            <!-- Box Deskripsi/Info di Atas -->
            <div style="background: rgba(0, 255, 149, 0.05); border-radius: 15px; padding: 15px; margin-bottom: 25px; border: 1px solid rgba(0, 255, 149, 0.1); display: flex; gap: 12px; align-items: center;">
                <i class="ph ph-info" style="font-size: 24px; color: var(--green)"></i>
                <div style="font-size: 11px; color: var(--sub); line-height: 1.5">
                    <b style="color:white; display:block; margin-bottom:2px">Zuna Digital Library</b>
                    Cari referensi dari jutaan koleksi buku dunia. Dapatkan detail publikasi, deskripsi lengkap, hingga subjek kategori secara akurat.
                </div>
            </div>

            <div style="margin-bottom: 25px;">
                <span class="label">CARI JUDUL BUKU / PENULIS</span>
                <div style="display:flex; gap:10px;">
                    <input type="text" id="bs-query" placeholder="Atomic Habits, Harry Potter..." style="margin-bottom:0; font-size:16px;">
                    <button id="bs-btn" class="btn-calc" style="width:60px; padding:0; background:var(--green); color:#000;">
                        <i class="ph ph-magnifying-glass" style="font-size:22px;"></i>
                    </button>
                </div>
            </div>

            <div id="bs-loader" class="loader-line"><div class="loader-bar"></div></div>
            <div id="bs-results"></div>

            <!-- DETAIL OVERLAY -->
            <div id="bs-overlay" class="sheet-overlay" onclick="Zuna.closeBookDetail()"></div>
            <div id="bs-detail-sheet">
                <div style="width:45px; height:5px; background:#333; border-radius:10px; margin: 0 auto 25px auto;" onclick="Zuna.closeBookDetail()"></div>
                <div id="bs-detail-content">
                    <!-- Detail Konten Muncul Di Sini -->
                </div>
            </div>
        </div>
    `,
    logic: () => {
        const input = document.getElementById('bs-query');
        const btn = document.getElementById('bs-btn');
        const results = document.getElementById('bs-results');
        const loader = document.getElementById('bs-loader');
        const sheet = document.getElementById('bs-detail-sheet');
        const overlay = document.getElementById('bs-overlay');
        const detailContent = document.getElementById('bs-detail-content');

        const searchBooks = async () => {
            const query = input.value.trim();
            if (!query) return;
            loader.style.display = 'block';
            results.style.opacity = '0.5';

            try {
                const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20`);
                const data = await res.json();
                renderResults(data.docs);
            } catch (err) {
                results.innerHTML = `<p style="color:var(--red); text-align:center; padding:20px;">Gagal terhubung ke database. Cek koneksi internetmu.</p>`;
            } finally {
                loader.style.display = 'none';
                results.style.opacity = '1';
            }
        };

        const renderResults = (books) => {
            results.innerHTML = '';
            if (!books || books.length === 0) {
                results.innerHTML = `<div style="text-align:center; padding:40px 0; color:var(--sub)">
                    <i class="ph ph-ghost" style="font-size:40px; opacity:0.2"></i>
                    <p style="margin-top:10px; font-size:12px">Buku tidak ditemukan.</p>
                </div>`;
                return;
            }
            books.forEach((book, i) => {
                const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : `https://via.placeholder.com/80x115/111/444?text=No+Cover`;
                const card = document.createElement('div');
                card.className = 'book-card';
                card.style.animationDelay = `${i * 0.05}s`;
                card.onclick = () => Zuna.showBookDetail(book, coverUrl);
                
                card.innerHTML = `
                    <img class="book-cover" src="${coverUrl}" loading="lazy">
                    <div class="book-info">
                        <h4 class="book-title">${book.title}</h4>
                        <p class="book-author">${book.author_name ? book.author_name[0] : 'Unknown Author'}</p>
                        <div class="book-meta">
                            <span><i class="ph ph-calendar"></i> ${book.first_publish_year || '-'}</span>
                            <span style="opacity:0.3">|</span>
                            <span><i class="ph ph-files"></i> ${book.edition_count || 1} Editions</span>
                        </div>
                    </div>
                `;
                results.appendChild(card);
            });
        };

        Zuna.showBookDetail = async (book, cover) => {
            // Skeleton Detail
            detailContent.innerHTML = `
                <div style="text-align: center; margin-bottom: 25px;">
                    <img src="${cover}" style="width:140px; border-radius:15px; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
                    <h2 style="font-size:22px; margin: 20px 0 5px 0; color:white">${book.title}</h2>
                    <p style="color:var(--green); font-weight:700;">${book.author_name ? book.author_name[0] : 'Unknown'}</p>
                </div>
                <div style="text-align:center; color:var(--sub); font-size:12px; padding:20px;">Menyelam ke dalam data...</div>
            `;
            
            sheet.classList.add('active');
            overlay.style.display = 'block';

            try {
                const res = await fetch(`https://openlibrary.org${book.key}.json`);
                const data = await res.json();
                
                let desc = "Deskripsi belum tersedia untuk edisi ini.";
                if (data.description) {
                    desc = typeof data.description === 'string' ? data.description : data.description.value;
                }

                detailContent.innerHTML = `
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="${cover}" style="width:160px; border-radius:15px; box-shadow: 0 20px 40px rgba(0,0,0,0.8); border: 1px solid #222">
                        <h2 style="font-size:22px; margin: 20px 0 5px 0; color:white; line-height:1.2">${book.title}</h2>
                        <p style="color:var(--green); font-weight:700; font-size:14px">${book.author_name ? book.author_name[0] : 'Unknown Author'}</p>
                    </div>

                    <div class="meta-grid">
                        <div class="meta-item">
                            <span class="meta-lab">Tahun Terbit</span>
                            <span class="meta-val">${book.first_publish_year || '-'}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-lab">Bahasa</span>
                            <span class="meta-val">${(book.language ? book.language[0] : 'Intl').toUpperCase()}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-lab">Edisi</span>
                            <span class="meta-val">${book.edition_count || 1}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-lab">Rating</span>
                            <span class="meta-val" style="color:#FFD700">★ ${book.ratings_average ? book.ratings_average.toFixed(1) : 'N/A'}</span>
                        </div>
                    </div>
                    
                    <span class="label" style="display:flex; align-items:center; gap:8px"><i class="ph ph-text-align-left"></i> Sinopsis / Deskripsi</span>
                    <p style="font-size: 14px; color: #aaa; line-height: 1.7; margin-bottom: 25px; background: #111; padding: 15px; border-radius: 15px;">${desc.substring(0, 1000)}${desc.length > 1000 ? '...' : ''}</p>
                    
                    <span class="label">SUBJEK KATEGORI</span>
                    <div style="margin-bottom:35px; display:flex; flex-wrap:wrap; gap:5px">
                        ${(data.subjects || ['Umum', 'Referensi']).slice(0, 10).map(s => `<span class="tag-pill">${s}</span>`).join('')}
                    </div>

                    <button class="btn-calc" style="background:var(--green); color:#000; font-weight:800;" onclick="window.open('https://openlibrary.org${book.key}', '_blank')">
                        BACA LENGKAP DI OPEN LIBRARY
                    </button>
                    <div style="height:40px"></div>
                `;
            } catch (e) {
                detailContent.innerHTML += `<p style="color:var(--red); text-align:center;">Gagal memuat detail mendalam.</p>`;
            }
        };

        Zuna.closeBookDetail = () => {
            sheet.classList.remove('active');
            overlay.style.display = 'none';
        };

        btn.onclick = searchBooks;
        input.onkeypress = (e) => { if(e.key === 'Enter') searchBooks(); };
    }
});