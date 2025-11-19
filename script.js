document.addEventListener('DOMContentLoaded', () => {

    /***********************
     * Small i18n for UI strings
     * (translates only static UI labels, not article content)
     ***********************/
    const I18N = {
        en: {
            "nav.home": "Home",
            "nav.trending": "Trending",
            "nav.bookmarks": "Bookmarks",
            "nav.profile": "Profile",
            "subscribe": "Subscribe",
            "search.placeholder": "Search headlines...",
            "cat.all": "All", "cat.sports": "Sports", "cat.politics": "Politics", "cat.tech": "Tech", "cat.accidents": "Accidents", "cat.business": "Business", "cat.entertainment": "Entertainment", "cat.world": "World", "cat.health": "Health",
            "paywalled": "Paywalled",
            "viewAll": "view all",
            "coveredBy": "Covered by {n} sources",
            "action.save": "Save", "action.upvote": "Upvote", "action.downvote": "Downvote", "action.share": "Share",
            "loader": "Loading more stories..."
        },
        hi: {
            "nav.home": "होम",
            "nav.trending": "ट्रेंडिंग",
            "nav.bookmarks": "बुकमार्क",
            "nav.profile": "प्रोफाइल",
            "subscribe": "सब्सक्राइब",
            "search.placeholder": "हेडलाइन्स खोजें...",
            "cat.all": "सभी", "cat.sports": "खेल", "cat.politics": "राजनीति", "cat.tech": "टेक", "cat.accidents": "हादसे", "cat.business": "बिजनेस", "cat.entertainment": "मनोरंजन", "cat.world": "दुनिया", "cat.health": "स्वास्थ्य",
            "paywalled": "पेवॉल्ड",
            "viewAll": "सभी देखें",
            "coveredBy": "{n} स्रोतों द्वारा कवर किया गया",
            "action.save": "सेव", "action.upvote": "पसंद", "action.downvote": "नापसंद", "action.share": "शेयर",
            "loader": "और खबरें लोड हो रही हैं..."
        },
        es: {
            "nav.home": "Inicio",
            "nav.trending": "Tendencias",
            "nav.bookmarks": "Guardados",
            "nav.profile": "Perfil",
            "subscribe": "Suscribirse",
            "search.placeholder": "Buscar titulares...",
            "cat.all": "Todo", "cat.sports": "Deportes", "cat.politics": "Política", "cat.tech": "Tecnología", "cat.accidents": "Accidentes", "cat.business": "Negocios", "cat.entertainment": "Entretenimiento", "cat.world": "Mundo", "cat.health": "Salud",
            "paywalled": "De pago",
            "viewAll": "ver todo",
            "coveredBy": "Cubierto por {n} fuentes",
            "action.save": "Guardar", "action.upvote": "Me gusta", "action.downvote": "No me gusta", "action.share": "Compartir",
            "loader": "Cargando más historias..."
        },
        bn: {
            "nav.home": "হোম",
            "nav.trending": "ট্রেন্ডিং",
            "nav.bookmarks": "বুকমার্ক",
            "nav.profile": "প্রোফাইল",
            "subscribe": "সাবস্ক্রাইব",
            "search.placeholder": "শিরোনাম খুঁজুন...",
            "cat.all": "সব", "cat.sports": "ক্রীড়া", "cat.politics": "রাজনীতি", "cat.tech": "টেক", "cat.accidents": "দুর্ঘটনা", "cat.business": "ব্যবসা", "cat.entertainment": "বিনোদন", "cat.world": "বিশ্ব", "cat.health": "স্বাস্থ্য",
            "paywalled": "পে-ওয়াল্ড",
            "viewAll": "সব দেখুন",
            "coveredBy": "{n} সূত্র দ্বারা কভার করা হয়েছে",
            "action.save": "সংরক্ষণ", "action.upvote": "পছন্দ", "action.downvote": "অপছন্দ", "action.share": "শেয়ার",
            "loader": "আরও গল্প লোড হচ্ছে..."
        }
    };

    // set default language
    let currentLang = 'en';

    function t(key, vars) {
        const dict = I18N[currentLang] || I18N.en;
        let s = dict[key] ?? key;
        if (vars) {
            Object.keys(vars).forEach(k => {
                s = s.replace(`{${k}}`, vars[k]);
            });
        }
        return s;
    }

    function languageLabel(code) {
        switch (code) {
            case 'en': return 'English';
            case 'hi': return 'हिन्दी';
            case 'es': return 'Español';
            case 'bn': return 'বাংলা';
            default: return code;
        }
    }

    function applyTranslations() {
        // document.lang
        document.documentElement.lang = currentLang;

        // simple data-i18n attributes
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n');
            el.textContent = t(k);
        });
        // placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const k = el.getAttribute('data-i18n-placeholder');
            el.placeholder = t(k);
        });

        document.getElementById('langLabel').textContent = languageLabel(currentLang);
        // Update loader text
        const sentinel = document.getElementById('sentinel');
        if (sentinel) sentinel.textContent = t('loader');

        // Update existing cards UI elements (paywall, view all, action labels, covered by)
        document.querySelectorAll('.paywall').forEach(el => el.textContent = t('paywalled'));

        document.querySelectorAll('.cover-info').forEach(el => {
            const n = el._count || (el.textContent.match(/\d+/) ? el.textContent.match(/\d+/)[0] : 1);
            // Ensure n is set on the element for future re-translation
            el._count = n; 
            
            el.innerHTML = t('coveredBy', { n });
            
            // reattach view all button
            const btn = document.createElement('button');
            btn.className = 'tiny';
            btn.textContent = t('viewAll');
            btn.style.background = 'none';
            btn.style.border = 'none';
            btn.style.textDecoration = 'underline';
            btn.style.cursor = 'pointer';
            btn.style.padding = '0';
            el.appendChild(btn);
        });

        // action labels
        document.querySelectorAll('.action').forEach(b => {
            const label = b.querySelector('span:last-child');
            if (!label) return;
            // Use dataset if available, otherwise fallback to existing content
            const key = b.dataset.actionKey || label.textContent.trim().toLowerCase(); 
            
            if (key.includes('save') || key.includes('सेव') || key.includes('guardar') || key === t('action.save').toLowerCase()) {
                label.textContent = t('action.save');
                b.dataset.actionKey = 'save';
            } else if (key.includes('up') || key.includes('पसंद') || key.includes('me gusta') || key === t('action.upvote').toLowerCase()) {
                label.textContent = t('action.upvote');
                b.dataset.actionKey = 'upvote';
            } else if (key.includes('down') || key.includes('नापसंद') || key.includes('no me gusta') || key === t('action.downvote').toLowerCase()) {
                label.textContent = t('action.downvote');
                b.dataset.actionKey = 'downvote';
            } else if (key.includes('share') || key.includes('शेयर') || key.includes('compartir') || key === t('action.share').toLowerCase()) {
                label.textContent = t('action.share');
                b.dataset.actionKey = 'share';
            }
        });
    }

    // language dropdown UI behavior
    const langButton = document.getElementById('langButton');
    const langMenu = document.getElementById('langMenu');

    langButton.addEventListener('click', () => {
        const expanded = langButton.getAttribute('aria-expanded') === 'true';
        langButton.setAttribute('aria-expanded', String(!expanded));
        langMenu.style.display = expanded ? 'none' : 'block';
    });
    
    // close on outside click
    document.addEventListener('click', (e) => {
        if (!document.getElementById('langSelect').contains(e.target)) {
            langMenu.style.display = 'none';
            langButton.setAttribute('aria-expanded', 'false');
        }
    });
    
    // handle language choice
    langMenu.querySelectorAll('button[data-lang]').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            currentLang = lang;
            applyTranslations();
            langMenu.style.display = 'none';
            langButton.setAttribute('aria-expanded', 'false');
        });
    });

    /***********************
     * Mock data + helpers
     ***********************/
    const sample = [
        {
            title: "AI startup raises $20M to expand multilingual models",
            summary: "A concise summary of the company's funding and plans to expand regional language support for generative models.",
            source: "Reuters",
            time: "1h",
            readTime: "2 min read",
            sentiment: "Positive",
            confidence: "high",
            paywalled: false
        },
        {
            title: "Local team wins regional robotics cup",
            summary: "Students celebrated after a weekend of tough matches and a creative autonomous robot design took the crown.",
            source: "BBC",
            time: "3h",
            readTime: "2 min read",
            sentiment: "Neutral",
            confidence: "medium",
            paywalled: false
        },
        {
            title: "Major outage affects cloud provider services",
            summary: "Multiple regions experienced interruptions; engineers are working on restoring service and investigating root cause.",
            source: "Bloomberg",
            time: "2h",
            readTime: "3 min read",
            sentiment: "Negative",
            confidence: "high",
            paywalled: true
        },
        {
            title: "Film festival premieres a bold new documentary",
            summary: "The documentary explores new perspectives and received a standing ovation at the premiere.",
            source: "The Verge",
            time: "5h",
            readTime: "3 min read",
            sentiment: "Positive",
            confidence: "medium",
            paywalled: false
        }
    ];

    // create image URL generator (picsum)
    function imgUrl(seed, w = 800, h = 600) { return `https://picsum.photos/seed/${seed}/${w}/${h}`; }
    function logoUrl(seed) { return `https://picsum.photos/seed/logo${seed}/64/64`; }

    /***********************
     * Render a single card
     ***********************/
    function createCard(data, idSeed = Math.random() * 1000) {
        const container = document.createElement('article');
        container.className = 'card';
        container.setAttribute('role', 'article');

        // store dataset for modal use
        container.dataset.title = data.title;
        container.dataset.summary = data.summary;
        container.dataset.image = data.image || imgUrl(idSeed);
        container.dataset.source = data.source;
        container.dataset.time = data.time;
        container.dataset.readTime = data.readTime;
        container.dataset.sentiment = data.sentiment;
        container.dataset.confidence = data.confidence;
        container.dataset.coveredBy = data.coveredBy || 1;
        container.dataset.paywalled = data.paywalled ? 'true' : 'false';

        // left image
        const img = document.createElement('img');
        img.className = 'thumb';
        img.src = data.image || imgUrl(idSeed);
        img.alt = data.title;
        container.appendChild(img);

        // content wrapper
        const content = document.createElement('div');
        content.className = 'content';

        // top: headline and paywall
        const top = document.createElement('div');
        const titleRow = document.createElement('div');
        titleRow.className = 'title-row';

        const h = document.createElement('h3');
        h.className = 'headline';
        h.textContent = data.title;

        titleRow.appendChild(h);

        if (data.paywalled) {
            const p = document.createElement('div');
            p.className = 'paywall';
            p.textContent = t('paywalled');
            titleRow.appendChild(p);
        }
        top.appendChild(titleRow);

        // summary
        const summary = document.createElement('p');
        summary.className = 'summary';
        summary.textContent = data.summary;
        top.appendChild(summary);

        content.appendChild(top);

        // meta row
        const meta = document.createElement('div');
        meta.className = 'meta-row';
        const leftMeta = document.createElement('div');
        leftMeta.style.display = 'flex';
        leftMeta.style.alignItems = 'center';
        leftMeta.style.gap = '8px';

        const logo = document.createElement('img');
        logo.className = 'source-logo';
        logo.src = logoUrl(idSeed);
        logo.alt = data.source;

        const srcWrap = document.createElement('div');
        const srcName = document.createElement('div');
        srcName.className = 'source-name';
        srcName.textContent = data.source;

        const tiny = document.createElement('div');
        tiny.className = 'tiny';
        tiny.textContent = `${data.time} • ${data.readTime}`;

        srcWrap.appendChild(srcName);
        srcWrap.appendChild(tiny);

        leftMeta.appendChild(logo);
        leftMeta.appendChild(srcWrap);

        // sentiment & confidence
        const badges = document.createElement('div');
        badges.className = 'badges';
        const sentiment = document.createElement('span');
        sentiment.className = 'badge';
        if (data.sentiment === 'Positive') sentiment.classList.add('sent-positive');
        else if (data.sentiment === 'Negative') sentiment.classList.add('sent-negative');
        else sentiment.classList.add('sent-neutral');
        sentiment.textContent = data.sentiment;

        const confidence = document.createElement('span');
        confidence.className = 'badge confidence';
        confidence.textContent = `${data.confidence} confidence`;

        badges.appendChild(sentiment);
        badges.appendChild(confidence);

        leftMeta.appendChild(badges);

        meta.appendChild(leftMeta);

        // covered by / view all
        const cover = document.createElement('div');
        cover.className = 'cover-info';
        // store count on element for retranslation
        const n = data.coveredBy || Math.floor(Math.random() * 4) + 1;
        cover._count = n;
        cover.textContent = t('coveredBy', { n });
        const viewAll = document.createElement('button');
        viewAll.className = 'tiny';
        viewAll.textContent = t('viewAll');
        viewAll.style.background = 'none';
        viewAll.style.border = 'none';
        viewAll.style.textDecoration = 'underline';
        viewAll.style.cursor = 'pointer';
        viewAll.style.padding = '0';
        cover.appendChild(viewAll);

        meta.appendChild(cover);
        content.appendChild(meta);

        // action bar
        const actions = document.createElement('div');
        actions.className = 'action-bar';

        const actNames = [
            { label: t('action.save'), icon: '🔖', key: 'save' },
            { label: t('action.upvote'), icon: '👍', key: 'upvote' },
            { label: t('action.downvote'), icon: '👎', key: 'downvote' },
            { label: t('action.share'), icon: '🔗', key: 'share' }
        ];
        actNames.forEach(a => {
            const b = document.createElement('button');
            b.className = 'action';
            b.dataset.actionKey = a.key;
            b.innerHTML = `<span aria-hidden>${a.icon}</span><span>${a.label}</span>`;
            actions.appendChild(b);
        });

        content.appendChild(actions);

        container.appendChild(content);

        // When user clicks the card -> open modal with that data
        container.addEventListener('click', (ev) => {
            // avoid opening modal if user clicked action buttons (delegate)
            const isAction = ev.target.closest('.action');
            if (isAction) return;
            openModalFromDataset(container.dataset);
        });

        return container;
    }

    /***********************
     * Modal logic
     ***********************/
    const modalOverlay = document.getElementById('modalOverlay');
    const modal = document.getElementById('modal');
    const modalClose = document.getElementById('modalClose');
    const modalThumb = document.getElementById('modalThumb');
    const modalHeadline = document.getElementById('modalHeadline');
    const modalSummary = document.getElementById('modalSummary');
    const modalSource = document.getElementById('modalSource');
    const modalMeta = document.getElementById('modalMeta');
    const modalBadges = document.getElementById('modalBadges');
    const modalActions = document.getElementById('modalActions');

    // populate and open modal
    function openModalFromDataset(ds) {
        modalThumb.src = ds.image;
        modalHeadline.textContent = ds.title;
        modalSummary.textContent = ds.summary + "\n\n" + "(This is demo text — integrate your full article body from backend.)";
        modalSource.textContent = ds.source;
        modalMeta.textContent = `${ds.time} • ${ds.readTime}`;
        
        // badges
        modalBadges.innerHTML = '';
        const sBadge = document.createElement('span');
        sBadge.className = 'badge ' + (ds.sentiment === 'Positive' ? 'sent-positive' : ds.sentiment === 'Negative' ? 'sent-negative' : 'sent-neutral');
        sBadge.textContent = ds.sentiment;
        const cBadge = document.createElement('span');
        cBadge.className = 'badge confidence';
        cBadge.textContent = `${ds.confidence} confidence`;
        modalBadges.appendChild(sBadge);
        modalBadges.appendChild(cBadge);

        // actions 
        modalActions.innerHTML = '';
        const actNames = [
            { label: t('action.save'), icon: '🔖', key: 'save' },
            { label: t('action.upvote'), icon: '👍', key: 'upvote' },
            { label: t('action.downvote'), icon: '👎', key: 'downvote' },
            { label: t('action.share'), icon: '🔗', key: 'share' }
        ];
        actNames.forEach(a => {
            const b = document.createElement('button');
            b.className = 'action';
            b.dataset.actionKey = a.key;
            b.innerHTML = `<span aria-hidden>${a.icon}</span><span>${a.label}</span>`;
            
            // a demo handler: share opens new tab to image
            if (a.key === 'share') {
                b.addEventListener('click', () => { window.open(ds.image, '_blank'); });
            }
            modalActions.appendChild(b);
        });

        // show modal
        modalOverlay.style.display = 'flex';
        modalOverlay.setAttribute('aria-hidden', 'false');
        // lock scroll
        document.body.style.overflow = 'hidden';
        // focus management
        modalClose.focus();
        // add escape handler
        document.addEventListener('keydown', escHandler);
    }

    function closeModal() {
        modalOverlay.style.display = 'none';
        modalOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', escHandler);
    }

    function escHandler(e) {
        if (e.key === 'Escape') closeModal();
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        // clicking the overlay (but not the modal itself) should close
        if (e.target === modalOverlay) closeModal();
    });

    /***********************
     * Boot: fill initial feed
     ***********************/
    const feed = document.getElementById('feed');

    function addBatch(n = 4) {
        for (let i = 0; i < n; i++) {
            const d = sample[(i + Math.floor(Math.random() * sample.length)) % sample.length];
            const copy = Object.assign({}, d);
            copy.title = copy.title + (Math.random() > 0.85 ? ' — updated' : '');
            copy.image = imgUrl(Math.floor(Math.random() * 1000));
            copy.coveredBy = Math.floor(Math.random() * 5) + 1;
            copy.paywalled = (Math.random() > 0.8);
            copy.sentiment = ['Positive', 'Neutral', 'Negative'][Math.floor(Math.random() * 3)];
            copy.confidence = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
            const card = createCard(copy, Math.floor(Math.random() * 10000));
            feed.appendChild(card);
        }
        // re-apply translations for new DOM nodes (paywall / actions / cover-info)
        applyTranslations();
    }

    // initial load
    addBatch(6);

    /***********************
     * Infinite scroll sentinel
     ***********************/
    const sentinel = document.getElementById('sentinel');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sentinel.textContent = t('loader');
                setTimeout(() => {
                    addBatch(4);
                    sentinel.textContent = t('loader');
                }, 700);
            }
        });
    }, { rootMargin: '500px' });
    observer.observe(sentinel);

    /***********************
     * Category chips (client-side filter)
     ***********************/
    document.getElementById('categoryStrip').addEventListener('click', (e) => {
        if (!e.target.matches('.chip')) return;
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        // Demo only: no filter logic, but if implemented, it would be here
    });

    /***********************
     * Simple search (client-side)
     ***********************/
    document.getElementById('search').addEventListener('input', (e) => {
        const q = e.target.value.trim().toLowerCase();
        document.querySelectorAll('.card').forEach(card => {
            const headline = card.dataset.title || '';
            const summary = card.dataset.summary || '';
            const txt = (headline + ' ' + summary).toLowerCase();
            card.style.display = txt.includes(q) ? '' : 'none';
        });
    });

    /***********************
     * Scroll-to-top button
     ***********************/
    const toTop = document.getElementById('toTop');
    // show button when scrolled down a bit
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            toTop.classList.add('show');
            toTop.setAttribute('aria-hidden', 'false');
        } else {
            toTop.classList.remove('show');
            toTop.setAttribute('aria-hidden', 'true');
        }
    });

    // on click, scroll to the top-most card start
    toTop.addEventListener('click', () => {
        // if first card exists, scroll to it; otherwise scroll to top container
        const firstCard = document.querySelector('.feed .card');
        if (firstCard) {
            // align to top of viewport with some offset for navbar (if any)
            firstCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // reduce small offset if needed:
            window.scrollBy(0, -12);
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // apply translations at start
    applyTranslations();
});