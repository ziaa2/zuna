Zuna.register({
    id: 'f-booksearch',
    category: 'produktivitas',
    title: 'Zuna Books',
    desc: 'Cari Buku & Lihat Detail Lengkap',
    icon: 'ph ph-books',
    html: `
        <style>
            /* --- ANIMASI & STYLE BARU --- */
            @keyframes bookReveal {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .book-card {
                background: #0d0d0d; border: 1px solid #1a1a1a; border-radius: 18px;
                padding: 12px; display: flex; gap: 15px; margin-bottom: 12px;
                animation: bookReveal 0.4s ease-out forwards; opacity: 0; cursor: pointer;
                transition: transform 0.2s;
            }
            .book-card:active { transform: scale(0.96); }
            
            .book-cover {
                width: 70px; height: 100px; background: #1a1a1a; border-radius: 8px;
                object-fit: cover; flex-shrink: 0; box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            }

            /* --- DETAIL SHEET (MODAL) --- */
            #bs-detail-sheet {
                position: fixed; bottom: 0; left: 0; width: 100%; height: 85%;
                background: #050505; border-top: 1px solid #222; border-radius: 30px 30px 0 0;
                z-index: 2000; transform: translateY(100%); transition: 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
                padding: 30px; overflow-y: auto; display: block;
            }
            #bs-detail-sheet.active { transform: translateY(0); }
            .sheet-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7); backdrop-filter: blur(5px); z-index: 1999;
                display: none; animation: fadeIn 0.3s;
            }

            .detail-header { text-align: center; margin-bottom: 25px; }
            .detail-cover-big { width: 140px; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); margin-bottom: 15px; }
            .detail-title { font-size: 20px; font-weight: 800; color: #fff; margin-bottom: 5px; }
            .detail-author { color: var(--green); font-weight: 700; margin-bottom: 20px; }
            
            .detail-desc { font-size: 13px; color: #bbb; line-height: 1.6; margin-bottom: 25px; }
            .tag-pill { display: inline-block; padding: 5px 12px; background: #111; border: 1px solid #222; border-radius: 50px; font-size: 10px; margin: 3px; color: var(--sub); }

            /* LOADER */
            .loader-line { width: 100%; height: 3px; background: #111; overflow: hidden; border-radius: 10px; display: none; margin-bottom: 20px; }
            .loader-bar { width: 40%; height: 100%; background: var(--green); animation: loadMove 1.5s infinite linear; }
            @keyframes loadMove { from { margin-left: -40%; } to { margin-left: 100%; } }
        </style>

        <div class="tool-ui">
            <div style="margin-bottom: 25px;">
                <span class="label">CARI JUDUL BUKU / PENULIS</span>
                <div style="display:flex; gap:10px;">
                    <input type="text" id="bs-query" placeholder="Contoh: Atomic Habits..." style="margin-bottom:0;">
                    <button id="bs-btn" class="btn-calc" style="width:60px; padding:0; background:var(--green); color:#000;">
                        <i class="ph ph-magnifying-glass" style="font-size:20px;"></i>
                    </button>
                </div>
            </div>

            <div id="bs-loader" class="loader-line"><div class="loader-bar"></div></div>
            <div id="bs-results"></div>

            <!-- DETAIL OVERLAY -->
            <div id="bs-overlay" class="sheet-overlay" onclick="Zuna.closeBookDetail()"></div>
            <div id="bs-detail-sheet">
                <div style="width:40px; height:4px; background:#333; border-radius:10px; margin: 0 auto 25px auto;"></div>
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
                const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=15`);
                const data = await res.json();
                renderResults(data.docs);
            } catch (err) {
                results.innerHTML = `<p style="color:var(--red); text-align:center;">Gagal koneksi.</p>`;
            } finally {
                loader.style.display = 'none';
                results.style.opacity = '1';
            }
        };

        const renderResults = (books) => {
            results.innerHTML = '';
            if (!books || books.length === 0) {
                results.innerHTML = `<p style="text-align:center; color:var(--sub);">Tidak ditemukan.</p>`;
                return;
            }
            books.forEach((book, i) => {
                const coverUrl = book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : `https://via.placeholder.com/70x100/111/444?text=No+Cover`;
                const card = document.createElement('div');
                card.className = 'book-card';
                card.style.animationDelay = `${i * 0.08}s`;
                card.onclick = () => Zuna.showBookDetail(book.key, coverUrl, book.title, book.author_name ? book.author_name[0] : 'Anonim');
                
                card.innerHTML = `
                    <img class="book-cover" src="${coverUrl}">
                    <div class="book-info">
                        <h4 class="book-title">${book.title}</h4>
                        <p class="book-author">${book.author_name ? book.author_name[0] : 'Anonim'}</p>
                        <p class="book-meta">${book.first_publish_year || '-'} • Click for Details</p>
                    </div>
                `;
                results.appendChild(card);
            });
        };

        Zuna.showBookDetail = async (key, cover, title, author) => {
            // Tampilan Awal (Skeleton)
            detailContent.innerHTML = `
                <div class="detail-header">
                    <img src="${cover}" class="detail-cover-big">
                    <h2 class="detail-title">${title}</h2>
                    <p class="detail-author">${author}</p>
                </div>
                <div style="text-align:center; color:var(--sub); font-size:12px;">Memuat deskripsi...</div>
            `;
            
            sheet.classList.add('active');
            overlay.style.display = 'block';

            try {
                const res = await fetch(`https://openlibrary.org${key}.json`);
                const data = await res.json();
                
                let desc = "Tidak ada deskripsi tersedia untuk buku ini.";
                if (data.description) {
                    desc = typeof data.description === 'string' ? data.description : data.description.value;
                }

                detailContent.innerHTML = `
                    <div class="detail-header">
                        <img src="${cover}" class="detail-cover-big">
                        <h2 class="detail-title">${title}</h2>
                        <p class="detail-author">${author}</p>
                    </div>
                    
                    <span class="label">DESKRIPSI BUKU</span>
                    <p class="detail-desc">${desc.substring(0, 800)}${desc.length > 800 ? '...' : ''}</p>
                    
                    <span class="label">SUBJEK / KATEGORI</span>
                    <div style="margin-bottom:30px;">
                        ${(data.subjects || ['Umum']).slice(0, 8).map(s => `<span class="tag-pill">${s}</span>`).join('')}
                    </div>

                    <button class="btn-calc" style="background:var(--green); color:#000;" onclick="window.open('https://openlibrary.org${key}', '_blank')">
                        BACA LENGKAP DI OPEN LIBRARY
                    </button>
                `;
            } catch (e) {
                detailContent.innerHTML += `<p style="color:var(--red); text-align:center;">Gagal memuat detail.</p>`;
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