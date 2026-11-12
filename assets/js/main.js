// Amil Salih Güngören - İnteraktif CV & Arşiv Yönetimi
// Güncelleme: 11 Kasım 2026 - Kitapyurdu Verileri, Tam Künye & İki Yana Yaslı Tasarım

// LocalStorage'da kayıtlı özel veriler varsa yükle (Admin panelinden yapılan canlı düzenlemeler)
(function initAppData() {
  const baseData = (typeof portfolioData !== 'undefined' ? portfolioData : (typeof window !== 'undefined' ? window.portfolioData : null)) || {};
  try {
    const saved = localStorage.getItem('amil_salih_portfolio_data');
    if (saved) {
      const customData = JSON.parse(saved);
      // Geçerli bir veri mi kontrol et (boş veya hasarlı nesneleri yok say)
      const hasContent = customData && customData.profile && customData.profile.name &&
        ((customData.translations && customData.translations.published && customData.translations.published.length > 0) ||
         (customData.editions && customData.editions.length > 0));

      if (hasContent) {
        // Eski test verisinden kalan sayfaları sıfırla: Sadece 3 ana sayfa aktif kalacak
        if (customData.pages && customData.pages.length >= 7) {
          customData.pages[0].active = true;
          customData.pages[1].active = true;
          customData.pages[2].active = true;
          customData.pages[3].active = false;
          customData.pages[4].active = false;
          customData.pages[5].active = false;
          customData.pages[6].active = false;
        }

        // Mecelle kapak görseli dosya adı onarımı (Linux/GitHub Pages büyük-küçük harf duyarlılığı)
        if (customData.editions) {
          const mecelle = customData.editions.find(e => e.id === 'e-3' || (e.title && e.title.includes('Mecelle')));
          if (mecelle && mecelle.coverImage && mecelle.coverImage.includes('mecelle.jpeg')) {
            mecelle.coverImage = 'assets/images/covers/Mecelle.jpeg';
          }
        }

        window.portfolioData = customData;
      } else {
        console.warn('LocalStorage verisi boş veya eksik tespit edildi; orijinal data.js baz alınıyor.');
        window.portfolioData = baseData;
        localStorage.removeItem('amil_salih_portfolio_data');
      }
    } else {
      window.portfolioData = baseData;
    }
  } catch (e) {
    console.error('LocalStorage veri yükleme hatası:', e);
    window.portfolioData = baseData;
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  renderSidebar();
  renderDynamicNavigation();
  renderPage1();
  renderPage2();
  renderPage3();
  renderArticles();
  renderMedia();
  renderBlog();
  renderForum();
  setupPageNavigation('page-1');
  setupModals();

  if (window.lucide) {
    lucide.createIcons();
  }
});

/* ================= 1. SOL SÜTUN (SIDEBAR) ================= */
function renderSidebar() {
  const p = portfolioData.profile;

  // İletişim Kutusu (E-postalar ve Konum Aynı Yazı Boyutu, İki Yana Yaslı, Kesintisiz)
  const contactContainer = document.getElementById('cv-contact-box');
  if (contactContainer) {
    contactContainer.innerHTML = `
      <!-- Dahili Telefon (Okul) -->
      <div class="flex items-center gap-2.5 group text-slate-700">
        <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-[#1E2D3D] group-hover:text-white transition-colors">
          <i data-lucide="phone" class="w-4 h-4"></i>
        </div>
        <div class="flex-1 min-w-0">
          <span class="font-bold text-[#1E2D3D] text-[12px] block">${p.phoneInternal}</span>
          <span class="block text-[10.5px] text-slate-400">BAİBÜ Santral: 0 (374) 254 10 00</span>
        </div>
      </div>

      <!-- Kişisel E-posta (Tek Satırda Kesintisiz, Aynı Yazı Boyutu: 11.5px - 12px) -->
      <div class="flex items-center gap-2.5 group text-slate-700">
        <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-[#1E2D3D] group-hover:text-white transition-colors">
          <i data-lucide="mail" class="w-4 h-4"></i>
        </div>
        <div class="flex-1 min-w-0">
          <a href="mailto:${p.emailPrimary}" class="hover:text-blue-600 hover:underline transition-colors font-medium text-[11.5px] sm:text-[12px] tracking-tight block whitespace-nowrap overflow-visible" title="${p.emailPrimary}">
            ${p.emailPrimary}
          </a>
        </div>
      </div>

      <!-- Kurumsal E-posta (Tek Satırda Kesintisiz, Aynı Yazı Boyutu: 11.5px - 12px) -->
      <div class="flex items-center gap-2.5 group text-slate-700">
        <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 group-hover:bg-[#1E2D3D] group-hover:text-white transition-colors">
          <i data-lucide="at-sign" class="w-4 h-4"></i>
        </div>
        <div class="flex-1 min-w-0">
          <a href="mailto:${p.emailAcademic}" class="hover:text-blue-600 hover:underline transition-colors font-medium text-[11.5px] sm:text-[12px] tracking-tight block whitespace-nowrap overflow-visible" title="${p.emailAcademic}">
            ${p.emailAcademic}
          </a>
        </div>
      </div>

      <!-- Adres / Konum (Maillerle Birebir Aynı Yazı Boyutu: 11.5px - 12px, İki Yana Yaslı) -->
      <div class="flex items-start gap-2.5 group text-slate-700">
        <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 mt-0.5 group-hover:bg-[#1E2D3D] group-hover:text-white transition-colors">
          <i data-lucide="map-pin" class="w-4 h-4"></i>
        </div>
        <div class="flex-1 min-w-0">
          <a href="${p.mapsUrl}" target="_blank" rel="noopener" class="hover:text-blue-600 transition-colors font-medium text-[11.5px] sm:text-[12px] tracking-tight leading-relaxed text-justify block" title="Haritada Aç">
            ${p.address}
          </a>
        </div>
      </div>
    `;
  }

  // Eğitim Listesi (Kurum linkleri ile, iki yana yaslı)
  const eduContainer = document.getElementById('cv-education-list');
  if (eduContainer) {
    eduContainer.innerHTML = portfolioData.education.map(section => {
      if (!section.items || section.items.length === 0) {
        return `
          <div class="mb-4 last:mb-0">
            <div class="font-bold text-sm sm:text-[15px] text-[#1E2D3D] text-justify">
              ${section.level}
              ${section.period ? `<span class="text-xs sm:text-sm font-normal text-slate-500 block sm:inline ml-0 sm:ml-1">${section.period}</span>` : ''}
            </div>
          </div>
        `;
      }

      return `
        <div class="mb-4 last:mb-0">
          <div class="font-bold text-sm sm:text-[15px] text-[#1E2D3D] mb-1.5 flex items-center justify-between text-justify">
            <span>${section.level}</span>
            ${section.period ? `<span class="text-xs sm:text-sm font-normal text-slate-500">${section.period}</span>` : ''}
          </div>
          <ul class="space-y-2 text-xs sm:text-sm text-slate-700 pl-3 border-l-2 border-[#D8E2ED]">
            ${section.items.map(item => `
              <li class="leading-snug text-justify">
                ${item.url ? `
                  <a href="${item.url}" target="_blank" rel="noopener" class="font-semibold text-slate-900 hover:text-blue-600 hover:underline inline-flex items-center gap-1 group text-justify">
                    <span>• ${item.institution}</span>
                    <i data-lucide="external-link" class="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity"></i>
                  </a>
                ` : `
                  <span class="font-semibold text-slate-900 text-justify">• ${item.institution}</span>
                `}
                <div class="text-slate-500 text-xs mt-0.5 ml-2.5 text-justify">
                  ${item.faculty} ${item.note ? `<span class="italic text-slate-400">(${item.note.replace(/^\(|\)$/g, '').trim()})</span>` : ''}
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      `;
    }).join('');
  }

  // Beceriler (5'li hap göstergesi)
  const skillsContainer = document.getElementById('cv-skills-list');
  if (skillsContainer) {
    skillsContainer.innerHTML = portfolioData.skills.map(s => `
      <div class="flex items-center justify-between text-xs sm:text-sm py-1.5">
        <span class="font-semibold text-slate-800">• ${s.name}</span>
        <div class="pill-bar">
          ${renderPills(s.level)}
        </div>
      </div>
    `).join('');
  }

  // Belge ve Sertifikalar (Yalın Bilgi Formatı - Tıklanmaz, Düz Metin)
  const certContainer = document.getElementById('cv-certificates-list');
  if (certContainer) {
    certContainer.innerHTML = portfolioData.certificates.map(c => `
      <div class="p-3 rounded-xl bg-white border border-slate-200/90 flex items-center gap-2.5 shadow-xs">
        <i data-lucide="award" class="w-4 h-4 text-[#1E2D3D] shrink-0"></i>
        <span class="text-xs sm:text-[13.5px] font-bold text-[#1E2D3D] leading-tight">${c.title}</span>
      </div>
    `).join('');
  }

  // Diller (Yeknesak tasarım rozeti altında seviye göstergeleri)
  const langContainer = document.getElementById('cv-languages-list');
  if (langContainer) {
    langContainer.innerHTML = portfolioData.languages.map(l => `
      <div class="flex items-center justify-between text-xs sm:text-sm py-1.5">
        <span class="font-semibold text-slate-800">• ${l.name}</span>
        <div class="pill-bar">
          ${renderPills(l.level)}
        </div>
      </div>
    `).join('');
  }
}

// 5'li Seviye Hapı Oluşturucu
function renderPills(level) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="pill-dot ${i <= level ? 'active' : ''}"></span>`;
  }
  return html;
}

/* ================= 2. SAYFA 1: HAKKINDA & İŞ DENEYİMİ ================= */
function renderPage1() {
  const bioContainer = document.getElementById('cv-bio-content');
  if (bioContainer) {
    bioContainer.innerHTML = portfolioData.profile.bio.split('\n\n').map(p => `
      <p class="mb-4 text-justify leading-relaxed text-slate-700">${p}</p>
    `).join('');
  }

  const expContainer = document.getElementById('cv-experience-timeline');
  if (expContainer) {
    expContainer.innerHTML = portfolioData.experience.map(item => `
      <div class="grid grid-cols-12 gap-4 mb-6 last:mb-0">
        <!-- Tarih Kolonu -->
        <div class="col-span-3 text-xs sm:text-sm font-extrabold text-[#1E2D3D] tracking-wide pt-0.5">
          ${item.period}
        </div>
        
        <!-- İçerik Kolonu (İki Yana Yaslı) -->
        <div class="col-span-9 pl-3.5 border-l-2 border-[#1E2D3D]">
          <h4 class="font-bold text-sm sm:text-base text-slate-900">${item.title}</h4>
          
          ${item.institution ? `
            <div class="text-xs sm:text-sm text-slate-700 mt-1 text-justify">
              ${item.url ? `
                <a href="${item.url}" target="_blank" rel="noopener" class="font-semibold hover:text-blue-600 hover:underline inline-flex items-center gap-1 text-justify">
                  <span>• ${item.institution}</span>
                  <i data-lucide="external-link" class="w-3 h-3 text-slate-400"></i>
                </a>
              ` : `<span class="font-semibold text-justify">• ${item.institution}</span>`}
              <span class="text-slate-500 block text-xs mt-0.5 ml-2.5 text-justify">${item.department}</span>
            </div>
          ` : ''}

          ${item.subItems ? `
            <ul class="space-y-2 text-xs sm:text-sm text-slate-700 mt-2">
              ${item.subItems.map(sub => `
                <li class="leading-relaxed text-justify">
                  <span class="font-semibold text-slate-800 text-justify">• ${sub.name}</span>
                  ${sub.role ? `<span class="text-slate-500 text-xs block ml-2.5 text-justify">(${sub.role})</span>` : ''}
                </li>
              `).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    `).join('');
  }
}

/* ================= 3. SAYFA 2: TERCÜMELER & TRANSKRİPSİYON ================= */
function renderPage2() {
  const pubListContainer = document.getElementById('cv-translations-published');
  if (pubListContainer) {
    pubListContainer.innerHTML = portfolioData.translations.published.map(item => {
      let subTitleHtml = '';
      if (item.turkishTitle) {
        const cleanTitle = item.turkishTitle.trim();
        if (cleanTitle.startsWith('(')) {
          subTitleHtml = ` <span class="text-slate-600">${cleanTitle}</span>`;
        } else {
          subTitleHtml = ` <span class="text-slate-600">(${cleanTitle})</span>`;
        }
      }

      return `
        <li class="cv-pub-item flex items-start justify-between group py-1.5" onclick="openBookModal('${item.id}', 'translation')">
          <div class="text-xs sm:text-[14px] leading-relaxed text-slate-800 text-justify flex-1">
            <span class="font-bold text-slate-950">• ${item.author}</span>, 
            <span class="italic font-bold text-[#1E2D3D]">${item.title}</span>${subTitleHtml}, 
            <span class="text-slate-500">${item.publisher} (${item.year})</span>
          </div>
          <span class="pub-action-indicator shrink-0 ml-2.5">İncele ↗</span>
        </li>
      `;
    }).join('');
  }

  const prepListContainer = document.getElementById('cv-translations-prep');
  if (prepListContainer) {
    prepListContainer.innerHTML = portfolioData.translations.inPreparation.map(item => {
      let subTitleHtml = '';
      if (item.turkishTitle) {
        const cleanTitle = item.turkishTitle.trim();
        if (cleanTitle.startsWith('(')) {
          subTitleHtml = ` <span class="text-slate-600">${cleanTitle}</span>`;
        } else {
          subTitleHtml = ` <span class="text-slate-600">(${cleanTitle})</span>`;
        }
      }

      return `
        <li class="cv-pub-item flex items-start justify-between group py-1.5" onclick="openBookModal('${item.id}', 'prep')">
          <div class="text-xs sm:text-[14px] leading-relaxed text-slate-800 text-justify flex-1">
            <span class="font-bold text-slate-950">• ${item.author}</span>, 
            <span class="italic font-bold text-[#1E2D3D]">${item.title}</span>${subTitleHtml}, 
            <span class="text-slate-500">${item.publisher}</span>
          </div>
          <span class="pub-action-indicator shrink-0 ml-2.5">İncele ↗</span>
        </li>
      `;
    }).join('');
  }

  // Sayfa 2 Galeri (Kronolojik Tarih Sıralı Tercüme Kapakları)
  const galleryContainer = document.getElementById('cv-gallery-page2');
  if (galleryContainer) {
    galleryContainer.innerHTML = portfolioData.translations.published.map(pub => {
      if (pub.coverImage) {
        return `
          <div class="gallery-book-card has-cover" onclick="openBookModal('${pub.id}', 'translation')" title="${pub.turkishTitle || pub.title} (${pub.year})">
            <img src="${pub.coverImage}" alt="${pub.title}" loading="lazy" onerror="if(!this.dataset.retried){this.dataset.retried='1';this.src=this.src.includes('Mecelle.jpeg')?this.src.replace('Mecelle.jpeg','mecelle.jpeg'):this.src.replace('mecelle.jpeg','Mecelle.jpeg');}">
          </div>
        `;
      } else {
        return `
          <div class="gallery-book-card no-cover book-theme-${pub.coverTheme || 'amber'}" onclick="openBookModal('${pub.id}', 'translation')">
            <div class="text-[10px] uppercase font-bold opacity-80 tracking-wider truncate">${pub.author}</div>
            <div class="text-xs font-bold leading-tight line-clamp-3 my-auto">${pub.turkishTitle || pub.title}</div>
            <div class="text-[9px] opacity-80 mt-auto flex items-center justify-between">
              <span class="truncate max-w-[85px]">${pub.publisher}</span>
              <span class="font-semibold">(${pub.year})</span>
            </div>
          </div>
        `;
      }
    }).join('');
  }
}

/* ================= 4. SAYFA 3: EDİSYON SEÇKİSİ ================= */
function renderPage3() {
  const editionContainer = document.getElementById('cv-editions-list');
  if (editionContainer) {
    editionContainer.innerHTML = portfolioData.editions.map(item => `
      <li class="cv-pub-item flex items-start justify-between group py-1.5" onclick="openBookModal('${item.id}', 'edition')">
        <div class="text-xs sm:text-[14px] leading-relaxed text-slate-800 text-justify flex-1">
          <span class="font-bold text-slate-950">• ${item.author}</span>, 
          <span class="italic font-bold text-[#1E2D3D]">${item.title}</span>, 
          <span class="text-slate-500">${item.publisher} (${item.year})</span>
          ${item.role && item.role.includes('Son okuma') ? '<span class="text-xs text-amber-700 font-semibold ml-1">[Son okuma]</span>' : ''}
        </div>
        <span class="pub-action-indicator shrink-0 ml-2.5">İncele ↗</span>
      </li>
    `).join('');
  }

  // Sayfa 3 Galeri (Müslüman Mühendisin Yol Haritası ve Tarih Yazan Çocuklar ile Başlayan Tam Kronolojik Sıralama)
  const galleryContainer = document.getElementById('cv-gallery-page3');
  if (galleryContainer) {
    galleryContainer.innerHTML = portfolioData.editions.map(pub => {
      if (pub.coverImage) {
        return `
          <div class="gallery-book-card has-cover" onclick="openBookModal('${pub.id}', 'edition')" title="${pub.title} (${pub.year})">
            <img src="${pub.coverImage}" alt="${pub.title}" loading="lazy" onerror="if(!this.dataset.retried){this.dataset.retried='1';this.src=this.src.includes('Mecelle.jpeg')?this.src.replace('Mecelle.jpeg','mecelle.jpeg'):this.src.replace('mecelle.jpeg','Mecelle.jpeg');}">
          </div>
        `;
      } else {
        return `
          <div class="gallery-book-card no-cover book-theme-${pub.coverTheme || 'blue'}" onclick="openBookModal('${pub.id}', 'edition')">
            <div class="text-[10px] uppercase font-bold opacity-80 tracking-wider truncate">${pub.author}</div>
            <div class="text-xs font-bold leading-tight line-clamp-3 my-auto">${pub.title}</div>
            <div class="text-[9px] opacity-80 mt-auto flex items-center justify-between">
              <span class="truncate max-w-[85px]">${pub.publisher}</span>
              <span class="font-semibold">(${pub.year})</span>
            </div>
          </div>
        `;
      }
    }).join('');
  }
}

/* ================= 4.5. DİNAMİK MENÜ & SEKMELER ================= */
function renderDynamicNavigation() {
  const container = document.getElementById('dynamic-nav-tabs');
  if (!container) return;

  const pages = portfolioData.pages || [
    { id: 'page-1', title: 'Özgeçmiş & Deneyim', icon: 'user', active: true },
    { id: 'page-2', title: 'Tercümeler & Galeri', icon: 'book-open', active: true },
    { id: 'page-3', title: 'Edisyonlar & Galeri', icon: 'bookmark', active: true }
  ];

  const activePages = pages.filter(p => p.active !== false);

  container.innerHTML = activePages.map(page => `
    <button data-target="${page.id}" class="page-nav-btn px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2">
      <i data-lucide="${page.icon || 'file'}" class="w-4 h-4"></i>
      <span>${page.title}</span>
    </button>
  `).join('');
}

/* ================= 5. SAYFA GEÇİŞLERİ (TAB & NAVİGASYON DURUM MAKİNESİ) ================= */
const NavigationState = {
  currentPageId: null,
  buttons: [],
  pages: [],

  init(defaultPage = 'page-1') {
    this.buttons = Array.from(document.querySelectorAll('.page-nav-btn'));
    this.pages = Array.from(document.querySelectorAll('.cv-content-page'));

    if (this.buttons.length === 0) return;

    // URL Hash desteği (örn: #page-2 veya #page-3 ile doğrudan açılabilme)
    const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
    const hasHashPage = this.buttons.some(b => b.getAttribute('data-target') === hash);
    const initialPage = hasHashPage ? hash : (this.buttons.some(b => b.getAttribute('data-target') === defaultPage) ? defaultPage : this.buttons[0].getAttribute('data-target'));

    this.buttons.forEach(btn => {
      btn.setAttribute('role', 'tab');
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const target = btn.getAttribute('data-target');
        this.transitionTo(target);
      });
    });

    window.addEventListener('popstate', () => {
      const currentHash = window.location.hash.replace('#', '');
      if (currentHash && this.buttons.some(b => b.getAttribute('data-target') === currentHash)) {
        this.transitionTo(currentHash, false);
      }
    });

    this.transitionTo(initialPage, false);
  },

  transitionTo(pageId, updateHistory = true) {
    if (!pageId || this.currentPageId === pageId) return; // İdempotent koruma

    this.currentPageId = pageId;

    // Mobil & Tablette (<1024px) Özgeçmiş dışındaki sayfalarda (Tercümeler, Edisyonlar vb.)
    // CV/profil sütununu gizleyip doğrudan yayınlar ve galeriyi en tepeye getir
    if (pageId === 'page-1') {
      document.body.classList.remove('subpage-active');
    } else {
      document.body.classList.add('subpage-active');
    }

    // 1. Sekme Butonlarının Durumunu Güncelle (ARIA & Tasarım)
    this.buttons.forEach(btn => {
      const isTarget = btn.getAttribute('data-target') === pageId;
      btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
      btn.setAttribute('tabindex', isTarget ? '0' : '-1');

      if (isTarget) {
        btn.classList.add('bg-[#1E2D3D]', 'text-white', 'shadow-sm');
        btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      } else {
        btn.classList.remove('bg-[#1E2D3D]', 'text-white', 'shadow-sm');
        btn.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
      }
    });

    // 2. Sayfa İçeriklerinin Durumunu Güncelle (ARIA & Görünürlük)
    this.pages.forEach(p => {
      const isTarget = p.id === pageId;
      p.setAttribute('role', 'tabpanel');
      p.setAttribute('aria-hidden', isTarget ? 'false' : 'true');

      if (isTarget) {
        p.classList.remove('hidden');
      } else {
        p.classList.add('hidden');
      }
    });

    // 3. URL Hash Güncelleme
    if (updateHistory && history.replaceState) {
      history.replaceState(null, '', '#' + pageId);
    }

    if (window.lucide) lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

function setupPageNavigation(defaultPage = 'page-1') {
  NavigationState.init(defaultPage);
}

/* ================= 5.5. YENİ SAYFALARIN ÇİZİMİ (MAKALELER, SES/VİDEO, BLOG, FORUM) ================= */
function renderArticles() {
  const container = document.getElementById('cv-articles-list');
  if (!container) return;

  const articles = portfolioData.articles || [];
  if (articles.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs italic">Henüz makale veya bildiri kaydı bulunmuyor.</div>';
    return;
  }

  container.innerHTML = articles.map(art => `
    <div class="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 shadow-xs hover:border-[#1E2D3D]/30 transition-all space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold tracking-wide uppercase">${art.type || 'Akademik Makale'}</span>
        <span class="text-xs font-semibold text-slate-500">${art.year || ''}</span>
      </div>

      <div>
        <h3 class="text-base font-bold text-[#1E2D3D] leading-snug">${art.title}</h3>
        <div class="text-xs text-slate-600 font-medium mt-1">${art.journal || ''} ${art.pages ? '&bull; ' + art.pages : ''} ${art.doi && art.doi !== '-' ? '&bull; DOI: ' + art.doi : ''}</div>
      </div>

      <p class="text-xs text-slate-700 leading-relaxed text-justify">${art.abstract || ''}</p>

      ${art.keywords && art.keywords.length > 0 ? `
        <div class="flex flex-wrap gap-1.5 pt-1">
          ${art.keywords.map(k => `<span class="px-2 py-0.5 rounded bg-slate-200/60 text-slate-600 text-[10px] font-medium">#${k}</span>`).join('')}
        </div>
      ` : ''}

      <div class="pt-2 flex items-center gap-3">
        ${art.pdfUrl ? `
          <a href="${art.pdfUrl}" target="_blank" class="px-4 py-2 rounded-xl bg-[#1E2D3D] hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            <span>PDF İncele & İndir</span>
          </a>
        ` : `
          <button onclick="alert('Bu eserin tam metin PDF\\'i yakında arşive eklenecektir.')" class="px-4 py-2 rounded-xl bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer">
            <i data-lucide="clock" class="w-3.5 h-3.5"></i>
            <span>PDF Yakında Eklenecek</span>
          </button>
        `}
      </div>
    </div>
  `).join('');
}

function renderMedia() {
  const container = document.getElementById('cv-media-list');
  if (!container) return;

  const mediaList = portfolioData.media || [];
  if (mediaList.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs italic">Henüz ses veya video kaydı bulunmuyor.</div>';
    return;
  }

  container.innerHTML = mediaList.map(m => `
    <div class="p-5 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 shadow-xs space-y-3">
      <div class="flex items-center justify-between">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${m.type === 'video' ? 'bg-rose-100 text-rose-800' : 'bg-purple-100 text-purple-800'}">
          ${m.type === 'video' ? 'Video Konferans / Söyleşi' : 'Ders Kaydı / Sesli Mülakat'}
        </span>
        <span class="text-xs text-slate-400 font-semibold">${m.duration || ''} &bull; ${m.date || ''}</span>
      </div>

      <h3 class="text-base font-bold text-[#1E2D3D]">${m.title}</h3>
      <p class="text-xs text-slate-700 leading-relaxed text-justify">${m.description || ''}</p>

      ${m.type === 'audio' && m.audioUrl ? `
        <div class="pt-2">
          <audio controls class="w-full h-9 rounded-xl focus:outline-hidden">
            <source src="${m.audioUrl}" type="audio/mpeg">
            Tarayıcınız ses oynatıcısını desteklemiyor.
          </audio>
        </div>
      ` : ''}

      ${m.type === 'video' && m.youtubeUrl ? `
        <div class="pt-2">
          <a href="${m.youtubeUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all">
            <i data-lucide="play-circle" class="w-4 h-4"></i>
            <span>Videoyu İzle (YouTube)</span>
          </a>
        </div>
      ` : ''}
    </div>
  `).join('');
}

function renderBlog() {
  const container = document.getElementById('cv-blog-list');
  if (!container) return;

  const blogs = portfolioData.blog || [];
  if (blogs.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs italic">Henüz yazı veya not bulunmuyor.</div>';
    return;
  }

  container.innerHTML = blogs.map(b => `
    <article class="p-6 rounded-2xl bg-[#FAFCFF] border border-slate-200/90 shadow-xs hover:border-[#1E2D3D]/30 transition-all space-y-3">
      <div class="flex items-center justify-between text-xs text-slate-500 font-semibold">
        <span class="px-2.5 py-0.5 rounded-md bg-slate-200/70 text-slate-700 text-[10px] uppercase font-bold tracking-wider">${b.category || 'İlmi Notlar'}</span>
        <span>${b.date || ''} &bull; ${b.readTime || '5 dk okuma'}</span>
      </div>

      <h3 class="text-lg font-bold text-[#1E2D3D] leading-snug">${b.title}</h3>

      <p class="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">${b.summary || ''}</p>

      <div class="pt-2">
        <button onclick="openBlogReadingModal('${b.id}')" class="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E2D3D] hover:text-blue-700 transition-colors cursor-pointer">
          <span>Yazının Tamamını Oku</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
        </button>
      </div>
    </article>
  `).join('');
}

function renderForum() {
  const container = document.getElementById('cv-forum-list');
  if (!container) return;

  const topics = portfolioData.forumTopics || [];
  if (topics.length === 0) {
    container.innerHTML = '<div class="p-8 text-center text-slate-400 text-xs italic">Henüz müzakere başlığı açılmadı.</div>';
    return;
  }

  container.innerHTML = topics.map(t => `
    <div class="p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-blue-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">${t.category || 'Müzakere'}</span>
          <span class="text-[11px] text-slate-400">${t.date || ''}</span>
        </div>
        <h4 class="font-bold text-sm text-[#1E2D3D]">${t.title}</h4>
        <p class="text-xs text-slate-600 text-justify">${t.summary || ''}</p>
      </div>

      <div class="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
        <div class="inline-flex items-center gap-1 text-xs font-bold text-slate-600">
          <i data-lucide="message-circle" class="w-3.5 h-3.5 text-blue-600"></i>
          <span>${t.repliesCount || 0} Yanıt</span>
        </div>
        <button onclick="alert('İlmi Meclis ve Forum tartışma katılımı yakında doğrudan aktif hale getirilecektir.')" class="px-3 py-1.5 rounded-lg bg-[#1E2D3D] hover:bg-slate-800 text-white font-bold text-[11px] transition-all cursor-pointer">
          Müzakereye Katıl
        </button>
      </div>
    </div>
  `).join('');
}

window.openBlogReadingModal = function(id) {
  const b = (portfolioData.blog || []).find(x => x.id === id);
  if (!b) return;

  const modal = document.getElementById('article-detail-modal');
  const content = document.getElementById('article-modal-content');
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="space-y-4">
      <div class="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <span class="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">${b.category || 'İlmi Notlar'}</span>
        <span>${b.date || ''}</span>
      </div>
      <h2 class="text-xl sm:text-2xl font-black text-[#1E2D3D] leading-snug">${b.title}</h2>
      <div class="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify space-y-3 pt-3 border-t border-slate-100 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        ${(b.content || b.summary || '').split('\\n\\n').map(p => `<p>${p}</p>`).join('')}
      </div>
    </div>
  `;

  modal.classList.remove('hidden');
  modal.classList.add('flex');
  ModalManager.open('article-detail-modal');
  if (window.lucide) lucide.createIcons();
};

window.closeArticleModal = function() {
  ModalManager.close('article-detail-modal');
};

/* ================= 6. AÇILIR PENCERE (MODAL DURUM MAKİNESİ) ================= */
const ModalManager = {
  activeModalId: null,
  lastTriggerElement: null,

  open(modalId, triggerElement = null) {
    if (this.activeModalId && this.activeModalId !== modalId) {
      this.close(this.activeModalId);
    }

    const modal = document.getElementById(modalId);
    if (!modal) return;

    this.activeModalId = modalId;
    this.lastTriggerElement = triggerElement || document.activeElement;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Erişilebilirlik: kapat butonuna veya ilk odaklanabilir öğeye odaklan
    const closeBtn = modal.querySelector('button[onclick*="close"], [data-close-modal]');
    if (closeBtn) closeBtn.focus();

    if (window.lucide) lucide.createIcons();
  },

  close(modalId) {
    const targetId = modalId || this.activeModalId;
    if (!targetId) return;

    const modal = document.getElementById(targetId);
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modal.setAttribute('aria-hidden', 'true');
    }

    if (this.activeModalId === targetId) {
      this.activeModalId = null;
      document.body.style.overflow = '';
      if (this.lastTriggerElement && typeof this.lastTriggerElement.focus === 'function') {
        try { this.lastTriggerElement.focus(); } catch (e) {}
      }
      this.lastTriggerElement = null;
    }
  },

  closeCurrent() {
    if (this.activeModalId) {
      this.close(this.activeModalId);
    }
  }
};
function findPublicationById(id) {
  let found = portfolioData.translations.published.find(p => p.id === id);
  if (found) return found;

  found = portfolioData.translations.inPreparation.find(p => p.id === id);
  if (found) return found;

  found = portfolioData.editions.find(p => p.id === id);
  return found || null;
}

window.openBookModal = function(id, type) {
  const pub = findPublicationById(id);
  if (!pub) return;

  const modal = document.getElementById('book-detail-modal');
  const content = document.getElementById('book-modal-content');

  // Kitapyurdu Doğrudan Linki (Öncelikli olarak doğrudan ürün linki, yoksa hedefe yönelik arama linki)
  const kitapyurduTargetUrl = pub.kitapyurduUrl || `https://www.kitapyurdu.com/index.php?route=product/search&filter_name=${encodeURIComponent(pub.turkishTitle || pub.title)}`;
  const authorProfileUrl = portfolioData.profile.kitapyurduProfile;
  const kunye = pub.kunye || {};

  // Kapak görseli HTML (Yeknesak Çerçeve & Kırpmasız İç Görsel)
  let coverHtml = '';
  if (pub.coverImage) {
    coverHtml = `
      <div class="w-full max-w-[240px] aspect-[1/1.45] rounded-xl overflow-hidden shadow-2xl border border-slate-200 bg-white p-2.5 flex items-center justify-center mx-auto">
        <img src="${pub.coverImage}" alt="${pub.title}" class="max-w-full max-h-full object-contain block rounded-sm shadow-sm" onerror="if(!this.dataset.retried){this.dataset.retried='1';this.src=this.src.includes('Mecelle.jpeg')?this.src.replace('Mecelle.jpeg','mecelle.jpeg'):this.src.replace('mecelle.jpeg','Mecelle.jpeg');}">
      </div>
    `;
  } else {
    coverHtml = `
      <div class="w-full max-w-[230px] aspect-[1/1.45] rounded-xl p-6 shadow-2xl book-theme-${pub.coverTheme || 'amber'} flex flex-col justify-between relative overflow-hidden border-l-4 border-white/40">
        <div>
          <span class="text-[11px] uppercase tracking-wider font-semibold opacity-80">${pub.role || 'Yayın'}</span>
          <div class="text-xs uppercase font-bold tracking-wide mt-1.5">${pub.author}</div>
        </div>
        <div>
          <h3 class="text-lg font-bold leading-tight font-serif-cv">${pub.title}</h3>
          ${pub.turkishTitle ? `<p class="text-xs opacity-90 italic mt-1">${pub.turkishTitle}</p>` : ''}
        </div>
        <div class="pt-3 border-t border-white/20 flex items-center justify-between text-xs opacity-80">
          <span>${pub.publisher}</span>
          <span>${pub.year}</span>
        </div>
      </div>
    `;
  }

  content.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-12 gap-7 items-start">
      
      <!-- Sol: Kitap Kapağı Görseli -->
      <div class="md:col-span-5 flex flex-col items-center">
        ${coverHtml}
        <div class="mt-3.5 text-xs sm:text-sm text-slate-500 font-semibold text-center">
          ${pub.publisher} • ${pub.year}
        </div>
      </div>

      <!-- Sağ: Bilgiler, Tanıtım Metni ve Künye -->
      <div class="md:col-span-7 flex flex-col justify-between space-y-4">
        
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-blue-100 text-blue-900">
              ${pub.role || 'Kitap'}
            </span>
            <span class="text-xs text-slate-400 font-medium">${pub.year}</span>
          </div>

          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">${pub.title}</h2>
          ${pub.turkishTitle ? `<h3 class="text-sm sm:text-base font-semibold text-slate-600 italic mt-1">${pub.turkishTitle}</h3>` : ''}
          <p class="text-xs sm:text-sm font-bold uppercase tracking-wide text-amber-700 mt-1.5">${pub.author}</p>
        </div>

        <!-- ESER HAKKINDA (Kendi İçinde Kaydırılabilir ve İki Yana Yaslı) -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div class="font-bold text-slate-900 text-xs sm:text-sm mb-1.5 uppercase tracking-wide">ESER HAKKINDA</div>
          <div class="max-h-56 sm:max-h-64 overflow-y-auto pr-2 text-xs sm:text-[13px] text-slate-700 leading-relaxed text-justify whitespace-pre-line custom-scrollbar">
            ${pub.description || 'Bu eser Amil Salih Güngören tarafından tercüme / edisyon sürecinden geçirilmiş muteber bir çalışmadır.'}
          </div>
        </div>

        <!-- Künye Tablosu (Yayın Tarihi, ISBN, Sayfa Sayısı vb.) -->
        <div class="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-[12.5px] text-slate-700 space-y-1">
          <div class="font-bold text-[#1E2D3D] text-xs uppercase tracking-wider mb-2">Künye</div>
          <div class="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div><span class="text-slate-500 font-medium">Yayın Tarihi:</span> <span class="font-semibold text-slate-900">${kunye.yayinTarihi || pub.year}</span></div>
            <div><span class="text-slate-500 font-medium">Yayınevi:</span> <span class="font-semibold text-slate-900">${pub.publisher}</span></div>
            <div><span class="text-slate-500 font-medium">ISBN:</span> <span class="font-mono font-semibold text-slate-900">${kunye.isbn || 'Mevcut'}</span></div>
            <div><span class="text-slate-500 font-medium">Sayfa Sayısı:</span> <span class="font-semibold text-slate-900">${kunye.sayfaSayisi || '-'}</span></div>
          </div>
        </div>

        <!-- Ortalanmış Kitapyurdu Satın Al & İncele Butonu -->
        <div class="pt-2 flex flex-col items-center gap-2">
          <a href="${kitapyurduTargetUrl}" target="_blank" rel="noopener" class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all text-center">
            <i data-lucide="shopping-bag" class="w-4 h-4"></i>
            <span>Kitapyurdu'nda İncele & Satın Al</span>
          </a>

          <!-- Yazar Profili Linki -->
          <a href="${authorProfileUrl}" target="_blank" rel="noopener" class="text-[11px] text-slate-500 hover:text-orange-600 hover:underline inline-flex items-center gap-1 mt-1">
            <span>Amil Salih Güngören Kitapyurdu Yazar Sayfası</span>
            <i data-lucide="external-link" class="w-3 h-3"></i>
          </a>
        </div>

      </div>

    </div>
  `;

  ModalManager.open('book-detail-modal');
};

window.closeBookModal = function() {
  ModalManager.close('book-detail-modal');
};

/* ================= 7. SERTİFİKA AÇILIR PENCERESİ ================= */
window.openCertificateModal = function(id) {
  const cert = portfolioData.certificates.find(c => c.id === id);
  if (!cert) return;

  const modal = document.getElementById('cert-detail-modal');
  const content = document.getElementById('cert-modal-content');

  content.innerHTML = `
    <div class="certificate-frame p-8 sm:p-12 text-center rounded-2xl relative overflow-hidden">
      
      <!-- Arka Plan Filigranı -->
      <div class="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <i data-lucide="scale" class="w-96 h-96"></i>
      </div>

      <div class="relative z-10 space-y-6">
        
        <!-- Üst Başlık -->
        <div>
          <div class="text-xs uppercase tracking-[0.25em] font-extrabold text-slate-500 mb-1">TÜRKİYE CUMHURİYETİ NOTERLİĞİ</div>
          <h2 class="text-2xl sm:text-3xl font-extrabold font-serif-cv text-[#1E2D3D]">${cert.title}</h2>
          <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1">${cert.subtitle}</p>
        </div>

        <!-- Mühür ve Rozet -->
        <div class="flex justify-center">
          <div class="certificate-seal flex items-center justify-center text-white">
            <i data-lucide="check-check" class="w-9 h-9"></i>
          </div>
        </div>

        <!-- Metin -->
        <div class="max-w-md mx-auto text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
          İşbu belge, <strong>Amil Salih Güngören</strong>'in <strong>Arapça</strong> dilinde yeminli tercümanlık yetkisine sahip olduğunu; resmi, ilmi, edebi ve hukuki metinleri Türkçeye ve Türkçeden Arapçaya tercüme etmeye kanunen salahiyetli kılındığını tevsik eder.
        </div>

        <div class="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-amber-900 inline-block">
          <i data-lucide="info" class="w-4 h-4 inline mr-1 text-amber-700"></i>
          Resmi yemin tutanağı taraması mevcuttur; kurumsal doğrulama talepleri için iletişime geçebilirsiniz.
        </div>

      </div>

    </div>
  `;

  ModalManager.open('cert-detail-modal');
};

window.closeCertModal = function() {
  ModalManager.close('cert-detail-modal');
};

function setupModals() {
  ['book-detail-modal', 'cert-detail-modal', 'article-detail-modal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', (e) => {
        if (e.target === el) ModalManager.close(id);
      });
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ModalManager.closeCurrent();
    }
  });
}
