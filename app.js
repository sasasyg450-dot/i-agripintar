/**
 * Agri Pintar Engine - 100% Client Side Application Architecture
 * @author Senior Full Stack & Agronomist Developer
 * @version 1.0.0 (2026)
 */

class AgriPintarApp {
    constructor() {
        this.database = { penyakit: [], artikel: [], produk: {} };
        this.currentView = 'beranda';
        this.placeholderImg = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23e2e8f0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%2394a3b8">Gambar Gejala Belum Tersedia</text></svg>';
        
        // Inisialisasi Event Listener Inti
        document.addEventListener('DOMContentLoaded', () => this.init());
    }

    async init() {
        this.domContainer = document.getElementById('app-view-container');
        this.setupNavigation();
        await this.loadDatabases();
        this.navigate('beranda'); // Render halaman utama saat inisialisasi selesai
    }

    /**
     * Mengambil file JSON secara asinkron dari folder data/
     */
    async loadDatabases() {
        try {
            // Simulasi load data statis (bisa diganti URL Vercel/Netlify lokal)
            const resPenyakit = await fetch('./data/penyakit.json').then(r => r.json()).catch(() => this.getFallbackPenyakit());
            const resArtikel = await fetch('./data/artikel.json').then(r => r.json()).catch(() => this.getFallbackArtikel());
            const resProduk = await fetch('./data/produk.json').then(r => r.json()).catch(() => this.getFallbackProduk());

            this.database.penyakit = resPenyakit;
            this.database.artikel = resArtikel;
            this.database.produk = resProduk;
        } catch (error) {
            console.error('Gagal memuat database Agri Pintar:', error);
        }
    }

    setupNavigation() {
        // Toggle mobile menu
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        }

        // Click Handler pada link navigasi global
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetView = link.getAttribute('data-target');
                
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                navMenu.classList.remove('active'); // Sembunyikan menu di mobile setelah klik
                
                this.navigate(targetView);
            });
        });
    }

    navigate(view, param = null) {
        this.currentView = view;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        switch(view) {
            case 'beranda':
                this.renderBeranda();
                break;
            case 'penyakit':
                this.renderPenyakit(param);
                break;
            case 'detail-penyakit':
                this.renderDetailPenyakit(param);
                break;
            case 'artikel':
                this.renderArtikel();
                break;
            case 'affiliate':
                this.renderAffiliate();
                break;
            case 'tentang':
                this.renderTentang();
                break;
            default:
                this.renderBeranda();
        }
    }

    /**
     * Resolusi URL Affiliate Terpusat (Satu Pintu)
     */
    getAffiliateLink(productItem) {
        if (productItem.link_override && productItem.link_override !== "") {
            return productItem.link_override;
        }
        const config = this.database.produk.global_config || { base_affiliate_url: '#' };
        return `${config.base_affiliate_url}/search?keyword=${encodeURIComponent(productItem.slug_toko || productItem.nama)}`;
    }

    /* ==========================================================================
       VIEW RENDER ENGINE (UI GENERATORS)
       ========================================================================== */

    renderBeranda() {
        const totalPenyakit = this.database.penyakit.length;
        const totalArtikel = this.database.artikel.length;
        const totalProduk = this.database.produk.items ? this.database.produk.items.length : 0;

        let html = `
            <section class="hero-section">
                <div class="container">
                    <h1>Solusi Pintar Pertanian Indonesia</h1>
                    <p>Cari diagnosis penyakit tanaman, panduan agronomi terpercaya, dan produk agrokimia pendukung terbaik.</p>
                    <div class="search-box-container">
                        <input type="text" id="mainSearchInput" class="search-input" placeholder="Ketik gejala atau nama penyakit, contoh: 'daun cabai menguning' atau 'bulai'...">
                    </div>
                </div>
            </section>

            <section class="container">
                <div class="section-title">
                    <h2>Komoditas Tanaman Utama</h2>
                </div>
                <div class="crop-grid">
                    <div class="crop-card" onclick="app.navigate('penyakit', 'Cabai')"><span class="icon">🌶️</span><h4>Cabai</h4></div>
                    <div class="crop-card" onclick="app.navigate('penyakit', 'Padi')"><span class="icon">🌾</span><h4>Padi</h4></div>
                    <div class="crop-card" onclick="app.navigate('penyakit', 'Jagung')"><span class="icon">🌽</span><h4>Jagung</h4></div>
                    <div class="crop-card" onclick="app.navigate('penyakit', 'Timun')"><span class="icon">🥒</span><h4>Timun</h4></div>
                    <div class="crop-card" onclick="app.navigate('penyakit', 'Kacang Panjang')"><span class="icon">🌱</span><h4>Kacang Panjang</h4></div>
                </div>

                <div class="detail-block" style="margin-top: 40px; display: flex; justify-content: space-around; text-align: center; background: var(--color-primary-light);">
                    <div><h2 style="color: var(--color-primary); font-size: 2.2rem;">${totalPenyakit}</h2><p>Database Penyakit</p></div>
                    <div><h2 style="color: var(--color-primary); font-size: 2.2rem;">${totalArtikel}</h2><p>Artikel SEO Edukasi</p></div>
                    <div><h2 style="color: var(--color-primary); font-size: 2.2rem;">${totalProduk}</h2><p>Rekomendasi Produk</p></div>
                </div>

                <div class="section-title">
                    <h2>Penyakit yang Sering Menyerang</h2>
                </div>
                <div class="main-grid" id="featured-penyakit"></div>

                <div class="section-title">
                    <h2>Produk Affiliate Unggulan</h2>
                </div>
                <div class="main-grid" id="featured-products"></div>
            </section>
        `;

        this.domContainer.innerHTML = html;

        // Render Sub-Komponen
        this.renderPenyakitListGrid(this.database.penyakit.slice(0, 3), 'featured-penyakit');
        this.renderProductListGrid(this.database.produk.items ? this.database.produk.items.slice(0, 3) : [], 'featured-products');

        // Setup Listener Pencarian Pintar Real-time
        const searchInput = document.getElementById('mainSearchInput');
        searchInput.addEventListener('input', (e) => this.executeSmartSearch(e.target.value));
    }

    renderPenyakit(filterTanaman = null) {
        let titleText = "Daftar Penyakit Tanaman Lengkap";
        let filteredData = this.database.penyakit;

        if (filterTanaman) {
            titleText = `Penyakit pada Tanaman ${filterTanaman}`;
            filteredData = this.database.penyakit.filter(p => p.tanaman.toLowerCase() === filterTanaman.toLowerCase());
        }

        let html = `
            <div class="container" style="padding-top: 30px;">
                <div class="section-title">
                    <h2>${titleText}</h2>
                </div>
                <div class="main-grid" id="all-penyakit-grid"></div>
            </div>
        `;
        this.domContainer.innerHTML = html;
        this.renderPenyakitListGrid(filteredData, 'all-penyakit-grid');
    }

    renderPenyakitListGrid(data, containerId) {
        const container = document.getElementById(containerId);
        if (!container || data.length === 0) {
            container.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--color-text-muted);">Data tidak ditemukan atau belum tersedia.</p>`;
            return;
        }

        container.innerHTML = data.map(item => `
            <div class="card">
                <div class="card-img-wrapper">
                    <img class="card-img" src="${item.gambar.daun || item.gambar.buah || this.placeholderImg}" alt="${item.nama}" loading="lazy">
                </div>
                <div class="card-content">
                    <span class="badge badge-${item.tingkat_bahaya.toLowerCase()}">Bahaya: ${item.tingkat_bahaya}</span>
                    <h3 style="margin-bottom: 5px;">${item.nama}</h3>
                    <p style="font-style: italic; font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 12px;">Tanaman: ${item.tanaman} | Patogen: ${item.nama_ilmiah}</p>
                    <p style="font-size: 0.9rem; margin-bottom: 15px; color: #475569;">${item.ringkasan}</p>
                    <button class="btn" onclick="app.navigate('detail-penyakit', '${item.id}')">Lihat Solusi Lengkap</button>
                </div>
            </div>
        `).join('');
    }

    renderDetailPenyakit(id) {
        const item = this.database.penyakit.find(p => p.id === id);
        if (!item) {
            this.domContainer.innerHTML = `<div class="container"><p>Penyakit tidak ditemukan.</p></div>`;
            return;
        }

        let html = `
            <div class="container" style="padding-top: 30px;">
                <span class="badge badge-${item.tingkat_bahaya.toLowerCase()}">Tingkat Bahaya: ${item.tingkat_bahaya}</span>
                <h1 style="font-size: 2.2rem; margin-bottom: 5px;">Penyakit ${item.nama}</h1>
                <p style="color: var(--color-text-muted); margin-bottom: 25px;">Kategori Komoditas: <strong>${item.tanaman}</strong> | Nama Patogen Ilmiah: <em>${item.nama_ilmiah} (${item.patogen})</em></p>
                
                <div class="detail-grid">
                    <div class="left-column">
                        <div class="detail-block">
                            <h3>📋 Ringkasan Gejala</h3>
                            <p style="margin-top: 10px;"><strong>Gejala Awal:</strong> ${item.gejala_awal}</p>
                            <p style="margin-top: 8px;"><strong>Gejala Sedang:</strong> ${item.gejala_sedang}</p>
                            <p style="margin-top: 8px;"><strong>Gejala Parah:</strong> ${item.gejala_parah}</p>
                        </div>
                        
                        <div class="detail-block">
                            <h3>🔬 Epidemiologi & Pemicu</h3>
                            <p style="margin-top: 10px;"><strong>Penyebab Utama:</strong> ${item.penyebab}</p>
                            <p style="margin-top: 8px;"><strong>Mekanisme Penularan:</strong> ${item.cara_penularan}</p>
                            <p style="margin-top: 8px;"><strong>Kondisi Lingkungan Optimal:</strong> ${item.kondisi_memicu}</p>
                            <p style="margin-top: 8px; color: #b91c1c;"><strong>Dampak Kerusakan Ekonomi / Panen:</strong> ${item.dampak_panen}</p>
                        </div>

                        <div class="detail-block" style="border-left: 4px solid var(--color-primary);">
                            <h3>🛡️ Protokol Pengendalian Terpadu (PHT)</h3>
                            <p style="margin-top: 10px;"><strong>Langkah Pencegahan:</strong> ${item.cara_pencegahan}</p>
                            <p style="margin-top: 12px;"><strong>Pengendalian Organik (Hayati/Nabati):</strong> <br>${item.pengendalian_organik}</p>
                            <p style="margin-top: 12px;"><strong>Pengendalian Kimia (Kuratif Agrokimia):</strong> <br>${item.pengendalian_kimia}</p>
                            <p style="margin-top: 12px;"><strong>Waktu Aplikasi Terbaik:</strong> ${item.waktu_pengendalian}</p>
                        </div>

                        <div class="detail-block" style="background-color: #fff1f2; border: 1px solid #fecdd3;">
                            <h3 style="color: #991b1b;">⚠️ Kesalahan Fatal Petani di Lapangan</h3>
                            <p style="margin-top: 8px; color: #991b1b;">${item.kesalahan_petani}</p>
                        </div>
                    </div>

                    <div class="sidebar">
                        <div class="detail-block">
                            <h3>📸 Galeri Diagnosis</h3>
                            <div class="gallery-grid">
                                <div class="gallery-item"><img src="${item.gambar.daun || this.placeholderImg}" alt="Gejala Daun"></div>
                                <div class="gallery-item"><img src="${item.gambar.batang || this.placeholderImg}" alt="Gejala Batang"></div>
                                <div class="gallery-item"><img src="${item.gambar.buah || this.placeholderImg}" alt="Gejala Buah"></div>
                                <div class="gallery-item"><img src="${item.gambar.akar || this.placeholderImg}" alt="Gejala Akar"></div>
                            </div>
                        </div>

                        <div class="detail-block" style="text-align: center;">
                            <h3>🛒 Obat/Fungisida Rekomendasi</h3>
                            <p style="font-size: 0.9rem; margin: 10px 0; color: var(--color-text-muted);">Beli produk rekomendasi mitra ahli kami untuk memulihkan infeksi tanaman ini.</p>
                            <button class="btn btn-secondary" onclick="app.navigate('affiliate')">Cari Produk Solutif</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.domContainer.innerHTML = html;
    }

    renderArtikel() {
        let html = `
            <div class="container" style="padding-top: 30px;">
                <div class="section-title">
                    <h2>Hub Edukasi & Artikel SEO Pertanian</h2>
                </div>
                <div class="main-grid">
                    ${this.database.artikel.map(art => `
                        <div class="card" style="padding: 20px;">
                            <span class="badge" style="background:#e0f2fe; color:#0369a1;">${art.kategori}</span>
                            <h3 style="font-size: 1.15rem; margin-bottom: 10px; line-height: 1.4;">${art.judul}</h3>
                            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 12px;">Fokus Komoditas: <strong>${art.tag_tanaman}</strong> | Waktu Baca: ${art.read_time}</p>
                            <p style="font-size: 0.9rem; color:#475569; margin-bottom: 15px;">${art.ringkasan}</p>
                            <a href="#" class="btn" style="background: none; color: var(--color-primary); border: 1px solid var(--color-primary); padding: 8px;" onclick="alert('Membuka Artikel Lengkap: ${art.judul}. (Implementasi halaman artikel mandiri siap diintegrasikan via slug: ${art.slug})')">Baca Artikel</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        this.domContainer.innerHTML = html;
    }

    renderAffiliate() {
        let html = `
            <div class="container" style="padding-top: 30px;">
                <div class="section-title">
                    <h2>Etalase Produk Affiliate Rekomendasi Ahli</h2>
                </div>
                <div class="main-grid" id="all-products-grid"></div>
            </div>
        `;
        this.domContainer.innerHTML = html;
        this.renderProductListGrid(this.database.produk.items || [], 'all-products-grid');
    }

    renderProductListGrid(data, containerId) {
        const container = document.getElementById(containerId);
        if (!container || data.length === 0) return;

        container.innerHTML = data.map(item => `
            <div class="card">
                <div class="card-img-wrapper">
                    <img class="card-img" src="${item.gambar || this.placeholderImg}" alt="${item.nama}">
                </div>
                <div class="card-content">
                    <span class="badge" style="background:#fef3c7; color:#d97706;">${item.kategori}</span>
                    <h3 style="margin-bottom: 8px;">${item.nama}</h3>
                    <p style="font-size: 0.9rem; color: #475569; margin-bottom: 12px;">${item.deskripsi}</p>
                    <ul style="font-size: 0.85rem; margin-left: 20px; margin-bottom: 15px; color: var(--color-text-dark);">
                        ${item.manfaat.map(m => `<li>${m}</li>`).join('')}
                    </ul>
                    <div style="font-size: 1.25rem; font-weight: 700; color: #b91c1c; margin-bottom: 15px;">${item.harga}</div>
                    <a href="${this.getAffiliateLink(item)}" target="_blank" rel="noopener noreferrer nofollow" class="btn btn-secondary">Beli Sekarang Resmi 🛒</a>
                </div>
            </div>
        `).join('');
    }

    renderTentang() {
        this.domContainer.innerHTML = `
            <div class="container" style="padding: 50px 20px; max-width: 800px;">
                <div class="detail-block">
                    <h2>Tentang Platform Agri Pintar</h2>
                    <p style="margin-top: 15px;">Agri Pintar adalah platform digital inovasi agronomi terintegrasi yang bertujuan menjembatani jurang pengetahuan teknologi pertanian bagi petani di pedesaan Indonesia. Kami menyediakan sistem pakar penentu diagnosis penyakit tanaman pangan dan hortikultura secara instan berbasis web.</p>
                    <p style="margin-top: 10px;">Seluruh rekomendasi bahan aktif fungisida, pestisida, maupun tata kelola penanganan biologis didasarkan pada jurnal penelitian serta pustaka rujukan resmi Kementerian Pertanian Republik Indonesia.</p>
                </div>
            </div>
        `;
    }

    /* ==========================================================================
       ALGORTIMA PENCARIAN PINTAR SEMANTIK (REAL-TIME FILTERING)
       ========================================================================== */
    executeSmartSearch(query) {
        const gridContainer = document.getElementById('featured-penyakit');
        const sectionTitle = document.querySelector('#featured-penyakit').previousElementSibling;
        
        if (!query || query.trim() === "") {
            sectionTitle.innerHTML = "<h2>Penyakit yang Sering Menyerang</h2>";
            this.renderPenyakitListGrid(this.database.penyakit.slice(0, 3), 'featured-penyakit');
            return;
        }

        const cleanQuery = query.toLowerCase().trim();
        sectionTitle.innerHTML = `<h2>Hasil Pencarian Pintar Untuk: "${query}"</h2>`;

        // Aturan Scoring / Filter Berdasarkan Tokenisasi Kata Kunci Gejala & Taksonomi
        const filteredResults = this.database.penyakit.filter(item => {
            return item.nama.toLowerCase().includes(cleanQuery) ||
                   item.tanaman.toLowerCase().includes(cleanQuery) ||
                   item.nama_ilmiah.toLowerCase().includes(cleanQuery) ||
                   item.gejala_awal.toLowerCase().includes(cleanQuery) ||
                   item.gejala_sedang.toLowerCase().includes(cleanQuery) ||
                   item.gejala_parah.toLowerCase().includes(cleanQuery) ||
