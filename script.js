document.addEventListener("DOMContentLoaded", () => {

    const t = (key, vars) => {
        const dict = {
            "search.placeholder": "Search headlines...",
            "paywalled": "Paywalled",
            "viewAll": "view all",
            "coveredBy": "Covered by {n} sources",
            "action.save": "Save",
            "action.upvote": "Upvote",
            "action.downvote": "Downvote",
            "action.share": "Share",
            "loader": "Loading more stories..."
        };
        let s = dict[key] ?? key;
        if (vars) Object.keys(vars).forEach(k => s = s.replace(`{${k}}`, vars[k]));
        return s;
    };

    function applyTranslations() {
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            const k = el.getAttribute("data-i18n-placeholder");
            el.placeholder = t(k);
        });

        const sentinel = document.getElementById("sentinel");
        if (sentinel) sentinel.textContent = t("loader");

        document.querySelectorAll(".paywall").forEach(el => el.textContent = t("paywalled"));

        document.querySelectorAll(".cover-info").forEach(el => {
            const n = el._count || 1;
            el._count = n;
            el.innerHTML = t("coveredBy", { n });

            const btn = document.createElement("button");
            btn.className = "tiny";
            btn.textContent = t("viewAll");
            btn.style.background = "none";
            btn.style.border = "none";
            btn.style.textDecoration = "underline";
            btn.style.cursor = "pointer";
            btn.style.padding = "0";
            el.appendChild(btn);
        });

        document.querySelectorAll(".action").forEach(b => {
            const label = b.querySelector("span:last-child");
            if (!label) return;
            const key = b.dataset.actionKey;
            if (key === "save") label.textContent = t("action.save");
            if (key === "upvote") label.textContent = t("action.upvote");
            if (key === "downvote") label.textContent = t("action.downvote");
            if (key === "share") label.textContent = t("action.share");
        });
    }

    const sample = [
        { title: "AI startup raises $20M to expand multilingual models", summary: "A concise summary of the company's funding and plans to expand regional language support for generative models.", source: "Reuters", time: "1h", readTime: "2 min read", sentiment: "Positive", confidence: "high", paywalled: false, category: "Tech" },
        { title: "Local team wins regional robotics cup", summary: "Students celebrated after a weekend of tough matches and a creative autonomous robot design took the crown.", source: "BBC", time: "3h", readTime: "2 min read", sentiment: "Neutral", confidence: "medium", paywalled: false, category: "Sports" },
        { title: "Major outage affects cloud provider services", summary: "Multiple regions experienced interruptions; engineers are working on restoring service and investigating root cause.", source: "Bloomberg", time: "2h", readTime: "3 min read", sentiment: "Negative", confidence: "high", paywalled: true, category: "Tech" },
        { title: "Film festival premieres a bold new documentary", summary: "The documentary explores new perspectives and received a standing ovation at the premiere.", source: "The Verge", time: "5h", readTime: "3 min read", sentiment: "Positive", confidence: "medium", paywalled: false, category: "Entertainment" }
    ];

    const imgUrl = (seed, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
    const logoUrl = (seed) => `https://picsum.photos/seed/logo${seed}/64/64`;

    function createCard(data, idSeed = Math.floor(Math.random() * 1000)) {
        const container = document.createElement("article");
        container.className = "card";

        container.dataset.title = data.title;
        container.dataset.summary = data.summary;
        container.dataset.image = data.image || imgUrl(idSeed);
        container.dataset.source = data.source;
        container.dataset.time = data.time;
        container.dataset.readTime = data.readTime;
        container.dataset.sentiment = data.sentiment;
        container.dataset.confidence = data.confidence;
        container.dataset.coveredBy = data.coveredBy || 1;
        container.dataset.paywalled = data.paywalled ? "true" : "false";
        container.dataset.category = data.category || "All";

        const img = document.createElement("img");
        img.className = "thumb";
        img.src = data.image || imgUrl(idSeed);
        img.alt = data.title;
        container.appendChild(img);

        const content = document.createElement("div");
        content.className = "content";

        const top = document.createElement("div");
        const titleRow = document.createElement("div");
        titleRow.className = "title-row";

        const h = document.createElement("h3");
        h.className = "headline";
        h.textContent = data.title;
        titleRow.appendChild(h);

        if (data.paywalled) {
            const p = document.createElement("div");
            p.className = "paywall";
            p.textContent = t("paywalled");
            titleRow.appendChild(p);
        }
        top.appendChild(titleRow);

        const summary = document.createElement("p");
        summary.className = "summary";
        summary.textContent = data.summary;
        top.appendChild(summary);

        content.appendChild(top);

        const meta = document.createElement("div");
        meta.className = "meta-row";

        const leftMeta = document.createElement("div");
        leftMeta.style.display = "flex";
        leftMeta.style.alignItems = "center";
        leftMeta.style.gap = "8px";

        const logo = document.createElement("img");
        logo.className = "source-logo";
        logo.src = logoUrl(idSeed);
        logo.alt = data.source;

        const srcWrap = document.createElement("div");
        srcWrap.innerHTML = `<div class="source-name">${data.source}</div>
                             <div class="tiny">${data.time} • ${data.readTime}</div>`;

        leftMeta.appendChild(logo);
        leftMeta.appendChild(srcWrap);

        const badges = document.createElement("div");
        badges.className = "badges";

        const sentiment = document.createElement("span");
        sentiment.className = "badge " + (data.sentiment === "Positive" ? "sent-positive" : data.sentiment === "Negative" ? "sent-negative" : "sent-neutral");
        sentiment.textContent = data.sentiment;

        const confidence = document.createElement("span");
        confidence.className = "badge confidence";
        confidence.textContent = `${data.confidence} confidence`;

        badges.appendChild(sentiment);
        badges.appendChild(confidence);
        leftMeta.appendChild(badges);
        meta.appendChild(leftMeta);

        const cover = document.createElement("div");
        cover.className = "cover-info";
        const n = data.coveredBy || Math.floor(Math.random() * 4) + 1;
        cover._count = n;
        cover.textContent = t("coveredBy", { n });
        const viewAll = document.createElement("button");
        viewAll.className = "tiny";
        viewAll.textContent = t("viewAll");
        viewAll.style.background = "none";
        viewAll.style.border = "none";
        viewAll.style.textDecoration = "underline";
        viewAll.style.cursor = "pointer";
        viewAll.style.padding = "0";
        cover.appendChild(viewAll);
        meta.appendChild(cover);

        content.appendChild(meta);

        const actions = document.createElement("div");
        actions.className = "action-bar";

        const actNames = [
            { label: t("action.save"), icon: "🔖", key: "save" },
            { label: t("action.upvote"), icon: "👍", key: "upvote" },
            { label: t("action.downvote"), icon: "👎", key: "downvote" },
            { label: t("action.share"), icon: "🔗", key: "share" }
        ];
        actNames.forEach(a => {
            const b = document.createElement("button");
            b.className = "action";
            b.dataset.actionKey = a.key;
            b.innerHTML = `<span aria-hidden>${a.icon}</span><span>${a.label}</span>`;
            if (a.key === "save") {
                // store example behavior (visual only) — could be extended to LocalStorage
                b.addEventListener("click", (ev) => {
                    ev.stopPropagation();
                    alert("Saved (demo). Implement persistence to keep items.");
                });
            }
            actions.appendChild(b);
        });

        content.appendChild(actions);
        container.appendChild(content);

        container.addEventListener("click", ev => {
            if (ev.target.closest(".action")) return;
            openModalFromDataset(container.dataset);
        });

        return container;
    }

    const modalOverlay = document.getElementById("modalOverlay");
    const modalClose = document.getElementById("modalClose");
    const modalThumb = document.getElementById("modalThumb");
    const modalHeadline = document.getElementById("modalHeadline");
    const modalSummary = document.getElementById("modalSummary");
    const modalSource = document.getElementById("modalSource");
    const modalMeta = document.getElementById("modalMeta");
    const modalBadges = document.getElementById("modalBadges");
    const modalActions = document.getElementById("modalActions");

    function openModalFromDataset(ds) {
        modalThumb.src = ds.image;
        modalHeadline.textContent = ds.title;
        modalSummary.textContent = ds.summary + "\n\n(This is demo text — integrate full article later)";
        modalSource.textContent = ds.source;
        modalMeta.textContent = `${ds.time} • ${ds.readTime}`;

        modalBadges.innerHTML = "";
        const sBadge = document.createElement("span");
        sBadge.className = "badge " + (ds.sentiment === "Positive" ? "sent-positive" : ds.sentiment === "Negative" ? "sent-negative" : "sent-neutral");
        sBadge.textContent = ds.sentiment;

        const cBadge = document.createElement("span");
        cBadge.className = "badge confidence";
        cBadge.textContent = `${ds.confidence} confidence`;

        modalBadges.appendChild(sBadge);
        modalBadges.appendChild(cBadge);

        modalActions.innerHTML = "";
        ["save", "upvote", "downvote", "share"].forEach(k => {
            const btn = document.createElement("button");
            btn.className = "action";
            btn.dataset.actionKey = k;
            const icon = { save: "🔖", upvote: "👍", downvote: "👎", share: "🔗" }[k];
            btn.innerHTML = `<span aria-hidden>${icon}</span><span>${t(`action.${k}`)}</span>`;
            if (k === "share") btn.addEventListener("click", () => window.open(ds.image, "_blank"));
            modalActions.appendChild(btn);
        });

        modalOverlay.style.display = "flex";
        document.body.style.overflow = "hidden";
        modalClose.focus();
        document.addEventListener("keydown", escHandler);
    }

    function closeModal() {
        modalOverlay.style.display = "none";
        document.body.style.overflow = "";
        document.removeEventListener("keydown", escHandler);
    }

    function escHandler(e) { if (e.key === "Escape") closeModal(); }

    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) closeModal(); });

    const feed = document.getElementById("feed");
    let currentCategory = "All";
    let currentSearch = "";

    function applyFilters() {
        const cards = document.querySelectorAll(".card");
        cards.forEach(card => {
            const cat = card.dataset.category || "All";
            const txt = (card.dataset.title + " " + card.dataset.summary).toLowerCase();
            const matchesCategory = currentCategory === "All" || cat === currentCategory;
            const matchesSearch = !currentSearch || txt.includes(currentSearch);
            card.style.display = matchesCategory && matchesSearch ? "" : "none";
        });
    }

    function setCategory(cat) {
        currentCategory = cat;
        const chips = document.querySelectorAll("#categoryStrip .chip");
        chips.forEach(chip => {
            chip.classList.toggle("active", chip.dataset.cat === cat);
        });
        applyFilters();
    }

    const categoryStrip = document.getElementById("categoryStrip");
    if (categoryStrip) {
        const chips = categoryStrip.querySelectorAll(".chip");
        chips.forEach(chip => {
            chip.addEventListener("click", () => {
                const cat = chip.dataset.cat || "All";
                setCategory(cat);
            });
        });
    }

    function addBatch(n = 4) {
        for (let i = 0; i < n; i++) {
            const d = sample[(i + Math.floor(Math.random() * sample.length)) % sample.length];
            const copy = { ...d };
            copy.title += Math.random() > 0.85 ? " — updated" : "";
            copy.image = imgUrl(Math.floor(Math.random() * 1000));
            copy.coveredBy = Math.floor(Math.random() * 5) + 1;
            copy.paywalled = Math.random() > 0.8;
            copy.sentiment = ["Positive", "Neutral", "Negative"][Math.floor(Math.random() * 3)];
            copy.confidence = ["low", "medium", "high"][Math.floor(Math.random() * 3)];
            copy.category = d.category || "All";

            feed.appendChild(createCard(copy, Math.floor(Math.random() * 10000)));
        }
        applyTranslations();
        applyFilters();
    }

    addBatch(6);
    setCategory("All");

    const sentinel = document.getElementById("sentinel");
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                sentinel.textContent = t("loader");
                setTimeout(() => {
                    addBatch(4);
                    sentinel.textContent = t("loader");
                }, 700);
            }
        });
    }, { rootMargin: "500px" });
    observer.observe(sentinel);

    document.getElementById("search").addEventListener("input", e => {
        currentSearch = e.target.value.toLowerCase();
        applyFilters();
    });

    const toTop = document.getElementById("toTop");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) toTop.classList.add("show");
        else toTop.classList.remove("show");
    });

    toTop.addEventListener("click", () => {
        const firstCard = document.querySelector(".feed .card");
        firstCard ? firstCard.scrollIntoView({ behavior: "smooth", block: "start" }) : window.scrollTo({ top: 0, behavior: "smooth" });
    });

    applyTranslations();
});
