(() => {
  "use strict";

  /* ── Guard ─────────────────────────────────────────────────── */
  if (location.hostname !== "www.instagram.com") {
    alert("Open https://www.instagram.com first, then paste this script again.");
    return;
  }

  /* ── Constants ─────────────────────────────────────────────── */
  const APP_ID = "yasweep-app";
  const STYLE_ID = "yasweep-style";
  const STORAGE_KEY = "yasweep_state_v1";
  const IG_HEADERS = {
    "x-ig-app-id": "936619743392459",
    "x-requested-with": "XMLHttpRequest"
  };
  const DEFAULT_TIMINGS = {
    scanDelayMin: 700,
    scanDelayMax: 1500,
    scanPauseEveryPages: 5,
    scanPauseMs: 8000,
    removeDelayMin: 3000,
    removeDelayMax: 6000,
    removePauseEvery: 8,
    removePauseMs: 120000
  };
  const PANEL_WIDTH = 400;
  const PANEL_MARGIN = 18;
  const MAX_RETRIES = 3;

  /* ── Translations ──────────────────────────────────────────── */
  const I18N = {
    en: {
      title: "yasweep",
      subtitle: "Find and view your saved posts",
      welcomeTitle: "Ready when you are",
      welcomeBody: "We'll scan your saved posts using Instagram's API. Nothing is removed until you explicitly choose to unsave items.",
      scanBtn: "Scan saved posts",
      scanning: "Scanning",
      loadingSaved: "Loading your saved posts",
      paused: "Paused",
      pause: "Pause",
      resume: "Resume",
      cancel: "Cancel",
      ofTotal: "{current} of {total}",
      ofUnknown: "{current} so far",
      scanCompletedToast: "{count} saved posts found",
      scanFailed: "Scan failed",
      retry: "Try again",
      goBack: "Back to results",
      search: "Search by caption or username",
      filterPhoto: "Photos",
      filterVideo: "Videos",
      filterCarousel: "Carousels",
      foundCount: "{count} saved posts",
      foundOne: "1 saved post",
      foundNone: "You don't have any saved posts.",
      noMatches: "No posts match your filters.",
      openPost: "Open post",
      copy: "Copy",
      copyAll: "Copy all",
      copiedToast: "Copied {count} post links",
      selectAll: "Select all",
      selectNone: "Clear",
      selectedCount: "{count} selected",
      unsave: "Unsave",
      unsaveConfirmTitle: "Unsave {count} posts?",
      unsaveConfirmBody: "This will run slowly to protect your account from rate limiting.{eta} You can pause at any time, but already-completed removals cannot be reversed from this tool.",
      unsaveConfirmBtn: "Yes, unsave {count}",
      unsaving: "Removing",
      currently: "Currently",
      nextActionIn: "Next action in {seconds}s",
      cooldownIn: "Cooldown — {seconds}s",
      idle: "Ready",
      etaLabel: "Est. finish: {time}",
      etaSeconds: "~{seconds}s",
      etaMinutes: "~{minutes}m",
      etaMinSec: "~{minutes}m {seconds}s",
      unsaveDoneTitle: "Done",
      unsaveDoneBody: "{ok} removed, {fail} failed",
      settings: "Settings",
      settingsTitle: "Timing settings",
      settingsBody: "Lower delays make Instagram more likely to throttle or block your account. Keep these conservative.",
      minScanDelay: "Min scan delay (ms)",
      maxScanDelay: "Max scan delay (ms)",
      scanPauseEvery: "Long pause every N pages",
      scanPauseLength: "Long pause length (ms)",
      minRemoveDelay: "Min remove delay (ms)",
      maxRemoveDelay: "Max remove delay (ms)",
      removePauseEvery: "Cooldown every N removes",
      removePauseLength: "Cooldown length (ms)",
      restoreDefaults: "Restore defaults",
      save: "Save",
      saved: "Settings saved",
      cookieMissing: "Could not read your login cookie. Make sure you are signed in.",
      csrfMissing: "Could not read csrftoken cookie.",
      requestFailed: "Request failed: {status}",
      tooManyRequests: "Instagram is rate-limiting requests. Try again later or increase delays in settings.",
      close: "Close",
      minimize: "Minimize",
      expand: "Expand",
      langCode: "EN",
      pillScanning: "Scanning {current}/{total}",
      pillUnsaving: "Removing {current}/{total}",
      pillResults: "{count} saved",
      pillIdle: "Open",
      typePhoto: "Photo",
      typeVideo: "Video",
      typeCarousel: "Album",
      typeReel: "Reel"
    },
    tr: {
      title: "yasweep",
      subtitle: "Kaydedilen gönderileri bul ve gör.",
      welcomeTitle: "Hazır olduğunda başlat",
      welcomeBody: "Kaydedilen gönderilerinizi Instagram API'si üzerinden tarayacağız. Siz silinecekleri seçene kadar hiçbir şey kaldırılmaz.",
      scanBtn: "Kaydedilenleri tara",
      scanning: "Taranıyor",
      loadingSaved: "Kaydedilen gönderiler yükleniyor",
      paused: "Duraklatıldı",
      pause: "Duraklat",
      resume: "Devam et",
      cancel: "İptal",
      ofTotal: "{current} / {total}",
      ofUnknown: "Şu ana kadar {current}",
      scanCompletedToast: "{count} kayıtlı gönderi bulundu",
      scanFailed: "Tarama başarısız",
      retry: "Tekrar dene",
      goBack: "Sonuçlara dön",
      search: "Başlık veya kullanıcı adı ara",
      filterPhoto: "Fotoğraflar",
      filterVideo: "Videolar",
      filterCarousel: "Albümler",
      foundCount: "{count} kayıtlı gönderi",
      foundOne: "1 kayıtlı gönderi",
      foundNone: "Hiç kayıtlı gönderiniz yok.",
      noMatches: "Filtrelerinle eşleşen gönderi yok.",
      openPost: "Gönderiyi aç",
      copy: "Kopyala",
      copyAll: "Tümünü kopyala",
      copiedToast: "{count} gönderi linki kopyalandı",
      selectAll: "Tümünü seç",
      selectNone: "Temizle",
      selectedCount: "{count} seçili",
      unsave: "Kaldır",
      unsaveConfirmTitle: "{count} gönderi kaldırılsın mı?",
      unsaveConfirmBody: "Hesabını korumak için işlem yavaş çalışır.{eta} İstediğin zaman duraklatabilirsin, ama tamamlanan işlemler bu araçtan geri alınamaz.",
      unsaveConfirmBtn: "Evet, {count} gönderiyi kaldır",
      unsaving: "Kaldırılıyor",
      currently: "Şu an",
      nextActionIn: "Sonraki işlem {seconds} sn sonra",
      cooldownIn: "Mola — {seconds} sn",
      idle: "Hazır",
      etaLabel: "Tahmini bitiş: {time}",
      etaSeconds: "~{seconds} sn",
      etaMinutes: "~{minutes} dk",
      etaMinSec: "~{minutes} dk {seconds} sn",
      unsaveDoneTitle: "Tamamlandı",
      unsaveDoneBody: "{ok} başarılı, {fail} başarısız",
      settings: "Ayarlar",
      settingsTitle: "Hız ayarları",
      settingsBody: "Düşük gecikmeler Instagram'ın hesabını kısıtlamasına neden olabilir. Yavaş tut.",
      minScanDelay: "Min tarama gecikmesi (ms)",
      maxScanDelay: "Maks tarama gecikmesi (ms)",
      scanPauseEvery: "Her N sayfada uzun mola",
      scanPauseLength: "Uzun mola süresi (ms)",
      minRemoveDelay: "Min kaldırma gecikmesi (ms)",
      maxRemoveDelay: "Maks kaldırma gecikmesi (ms)",
      removePauseEvery: "Her N kaldırmada mola",
      removePauseLength: "Mola süresi (ms)",
      restoreDefaults: "Varsayılana dön",
      save: "Kaydet",
      saved: "Ayarlar kaydedildi",
      cookieMissing: "Giriş çerezi okunamadı. Giriş yaptığından emin ol.",
      csrfMissing: "csrftoken çerezi okunamadı.",
      requestFailed: "İstek başarısız: {status}",
      tooManyRequests: "Instagram istekleri kısıtlıyor. Sonra dene veya ayarlardan gecikmeleri artır.",
      close: "Kapat",
      minimize: "Küçült",
      expand: "Aç",
      langCode: "TR",
      pillScanning: "Taranıyor {current}/{total}",
      pillUnsaving: "Kaldırılıyor {current}/{total}",
      pillResults: "{count} kayıtlı",
      pillIdle: "Aç",
      typePhoto: "Fotoğraf",
      typeVideo: "Video",
      typeCarousel: "Albüm",
      typeReel: "Reel"
    }
  };

  /* ── SVG Icons ─────────────────────────────────────────────── */
  const SVG = {
    minimize: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><rect x="3" y="7.25" width="10" height="1.5" rx="0.75" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    gear: '<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zm6.7 2.5a6.7 6.7 0 0 0-.1-1.1l1.4-1.1-1.5-2.6-1.7.7a6.6 6.6 0 0 0-1.9-1.1L10.5 1h-3l-.4 1.8a6.6 6.6 0 0 0-1.9 1.1l-1.7-.7L1.9 5.8 3.3 6.9a6.7 6.7 0 0 0 0 2.2L1.9 10.2l1.5 2.6 1.7-.7a6.6 6.6 0 0 0 1.9 1.1L7.5 15h3l.4-1.8a6.6 6.6 0 0 0 1.9-1.1l1.7.7 1.5-2.6-1.4-1.1c.1-.4.1-.7.1-1.1z"/></svg>',
    open: '<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M6 3h7v7M13 3L6.5 9.5M9 13H3V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M6 2a2 2 0 0 0-2 2v18l8-5.5L20 22V4a2 2 0 0 0-2-2H6z"/></svg>',
    alert: '<svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M12 2 1 21h22L12 2zm0 6 7.5 13h-15L12 8zm-1 4v4h2v-4h-2zm0 5v2h2v-2h-2z"/></svg>',
    check: '<svg viewBox="0 0 16 16" width="36" height="36" aria-hidden="true"><path fill="currentColor" d="M14 4.5L6 12.5l-4-4L3 7.5l3 3 7-7z"/></svg>',
    photo: '<svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true"><rect x="1" y="2" width="14" height="12" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.3"/><circle cx="5" cy="6" r="1.3" fill="currentColor"/><path d="M1.5 12l3.5-4 2.5 3 3-4 4 5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    video: '<svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true"><path fill="currentColor" d="M6 4l7 4-7 4V4z"/></svg>',
    carousel: '<svg viewBox="0 0 16 16" width="10" height="10" aria-hidden="true"><rect x="1" y="3" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><rect x="5" y="1" width="10" height="10" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>'
  };

  /* ── State ──────────────────────────────────────────────────── */
  const persisted = loadStored();
  const state = {
    mode: "idle",
    scanPaused: false,
    scanCancelled: false,
    unsavePaused: false,
    unsaveCancelled: false,
    progress: { current: 0, total: 0, label: "scanning", note: "" },
    waitUntil: 0,
    waitReason: "",
    items: [],
    selected: new Set(),
    log: [],
    search: "",
    filters: persisted.filters || { photo: true, video: true, carousel: true },
    timings: { ...DEFAULT_TIMINGS, ...(persisted.timings || {}) },
    panelPos: persisted.panelPos || null,
    minimized: Boolean(persisted.minimized),
    language: persisted.language === "en" ? "en" : "tr",
    error: ""
  };

  let countdownTimer = null;
  let toastTimer = null;

  /* ── Persistence ───────────────────────────────────────────── */
  function loadStored() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timings: state.timings,
        filters: state.filters,
        panelPos: state.panelPos,
        minimized: state.minimized,
        language: state.language
      }));
    } catch { }
  }

  /* ── i18n ───────────────────────────────────────────────────── */
  function t(key, vars) {
    const dict = I18N[state.language] || I18N.tr;
    const template = dict[key] ?? I18N.tr[key] ?? key;
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (_, name) => vars[name] ?? "");
  }

  /* ── Cleanup & Mount ───────────────────────────────────────── */
  function cleanupExisting() {
    if (typeof window.__isrCleanup === "function") {
      try { window.__isrCleanup(); } catch { }
    }
    document.getElementById(APP_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();
  }

  function injectStyles() {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    document.head.appendChild(style);
  }

  function mount() {
    const root = document.createElement("div");
    root.id = APP_ID;
    document.body.appendChild(root);
    window.__isrCleanup = unmount;
    renderShell();
  }

  function unmount() {
    stopCountdown();
    if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
    document.getElementById(APP_ID)?.remove();
    document.getElementById(STYLE_ID)?.remove();
    if (window.__isrCleanup === unmount) window.__isrCleanup = null;
  }

  /* ── Shell Rendering ───────────────────────────────────────── */
  function renderShell() {
    const root = document.getElementById(APP_ID);
    if (!root) return;

    if (state.minimized) {
      root.innerHTML = `
        <button class="isr-pill" data-action="expand" type="button" aria-label="${escapeAttr(t("expand"))}">
          <span class="isr-pill-dot ${pillStateClass()}"></span>
          <span data-pill-label>${escapeHTML(pillLabel())}</span>
        </button>
      `;
      root.querySelector("[data-action='expand']")?.addEventListener("click", () => setMinimized(false));
      applyPanelPosition();
      return;
    }

    root.innerHTML = `
      <section class="isr-panel" role="dialog" aria-label="${escapeAttr(t("title"))}">
        <header class="isr-header" data-drag>
          <div class="isr-brand">
            <span class="isr-brand-dot"></span>
            <div class="isr-brand-text">
              <strong>${escapeHTML(t("title"))}</strong>
              <span data-subtitle>${escapeHTML(t("subtitle"))}</span>
            </div>
          </div>
          <div class="isr-header-actions">
            <button type="button" data-action="settings" aria-label="${escapeAttr(t("settings"))}" title="${escapeAttr(t("settings"))}">${SVG.gear}</button>
            <button type="button" data-action="language" aria-label="${escapeAttr(t("langCode"))}" title="${escapeAttr(t("langCode"))}"><span data-lang>${escapeHTML(t("langCode"))}</span></button>
            <button type="button" data-action="minimize" aria-label="${escapeAttr(t("minimize"))}" title="${escapeAttr(t("minimize"))}">${SVG.minimize}</button>
            <button type="button" data-action="close" aria-label="${escapeAttr(t("close"))}" title="${escapeAttr(t("close"))}">${SVG.close}</button>
          </div>
        </header>
        <div class="isr-body" data-body></div>
      </section>
    `;

    bindHeader(root);
    bindDrag(root.querySelector("[data-drag]"));
    applyPanelPosition();
    renderBody();
  }

  function bindHeader(root) {
    root.querySelector("[data-action='close']")?.addEventListener("click", () => unmount());
    root.querySelector("[data-action='minimize']")?.addEventListener("click", () => setMinimized(true));
    root.querySelector("[data-action='settings']")?.addEventListener("click", showSettings);
    root.querySelector("[data-action='language']")?.addEventListener("click", toggleLanguage);
  }

  /* ── Panel Position ────────────────────────────────────────── */
  function applyPanelPosition() {
    const root = document.getElementById(APP_ID);
    if (!root) return;
    const node = root.querySelector(".isr-panel") || root.querySelector(".isr-pill");
    if (!node) return;
    const pos = state.panelPos;
    if (pos && Number.isFinite(pos.x) && Number.isFinite(pos.y)) {
      const max = panelBounds(node);
      node.style.left = clamp(pos.x, 0, max.x) + "px";
      node.style.top = clamp(pos.y, 0, max.y) + "px";
      node.style.right = "auto";
      node.style.bottom = "auto";
    } else {
      node.style.left = "auto";
      node.style.top = "auto";
      node.style.right = PANEL_MARGIN + "px";
      node.style.bottom = PANEL_MARGIN + "px";
    }
  }

  function panelBounds(node) {
    const rect = node.getBoundingClientRect();
    return {
      x: Math.max(0, window.innerWidth - rect.width),
      y: Math.max(0, window.innerHeight - rect.height)
    };
  }

  /* ── Drag ───────────────────────────────────────────────────── */
  function bindDrag(handle) {
    if (!handle) return;
    const panel = handle.closest(".isr-panel");
    if (!panel) return;
    let startX = 0, startY = 0, originX = 0, originY = 0, dragging = false;

    handle.addEventListener("pointerdown", (e) => {
      if (e.target.closest("button")) return;
      dragging = true;
      const rect = panel.getBoundingClientRect();
      originX = rect.left; originY = rect.top;
      startX = e.clientX; startY = e.clientY;
      panel.style.left = originX + "px";
      panel.style.top = originY + "px";
      panel.style.right = "auto";
      panel.style.bottom = "auto";
      handle.setPointerCapture(e.pointerId);
      handle.classList.add("isr-dragging");
    });

    handle.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const max = panelBounds(panel);
      panel.style.left = clamp(originX + (e.clientX - startX), 0, max.x) + "px";
      panel.style.top = clamp(originY + (e.clientY - startY), 0, max.y) + "px";
    });

    const stop = (e) => {
      if (!dragging) return;
      dragging = false;
      handle.releasePointerCapture?.(e.pointerId);
      handle.classList.remove("isr-dragging");
      const rect = panel.getBoundingClientRect();
      state.panelPos = { x: rect.left, y: rect.top };
      persist();
    };
    handle.addEventListener("pointerup", stop);
    handle.addEventListener("pointercancel", stop);
  }

  function setMinimized(value) {
    state.minimized = Boolean(value);
    persist();
    renderShell();
  }

  /* ── Pill ───────────────────────────────────────────────────── */
  function pillLabel() {
    if (state.mode === "scanning") {
      return t("pillScanning", { current: state.progress.current, total: state.progress.total || "?" });
    }
    if (state.mode === "unsaving") {
      return t("pillUnsaving", { current: state.progress.current, total: state.progress.total });
    }
    if (state.mode === "results" && state.items.length) {
      return t("pillResults", { count: state.items.length });
    }
    return t("pillIdle");
  }

  function pillStateClass() {
    if (state.mode === "scanning" || state.mode === "unsaving") return "isr-pill-dot--active";
    if (state.error) return "isr-pill-dot--error";
    return "";
  }

  /* ── Body Rendering ────────────────────────────────────────── */
  function renderBody() {
    const body = document.querySelector(`#${APP_ID} [data-body]`);
    if (!body) return;

    if (state.mode === "scanning") {
      body.innerHTML = renderScanView();
      bindScan(body);
    } else if (state.mode === "results") {
      body.innerHTML = renderResultsView();
      bindResults(body);
    } else if (state.mode === "unsaving" || state.mode === "unsaveDone") {
      body.innerHTML = renderUnsaveView();
      bindUnsave(body);
    } else {
      body.innerHTML = renderIdleView();
      bindIdle(body);
    }

    if (state.mode === "scanning" || state.mode === "unsaving") startCountdown();
    else stopCountdown();
  }

  /* ── Idle View ─────────────────────────────────────────────── */
  function renderIdleView() {
    if (state.error) {
      return `
        <div class="isr-welcome">
          <div class="isr-welcome-icon isr-welcome-icon--error">${SVG.alert}</div>
          <h2>${escapeHTML(t("scanFailed"))}</h2>
          <p>${escapeHTML(state.error)}</p>
          <button type="button" class="isr-btn isr-btn--primary" data-action="scan">${escapeHTML(t("retry"))}</button>
        </div>
      `;
    }
    return `
      <div class="isr-welcome">
        <div class="isr-welcome-icon">${SVG.bookmark}</div>
        <h2>${escapeHTML(t("welcomeTitle"))}</h2>
        <p>${escapeHTML(t("welcomeBody"))}</p>
        <button type="button" class="isr-btn isr-btn--primary isr-btn--lg" data-action="scan">${escapeHTML(t("scanBtn"))}</button>
      </div>
    `;
  }

  function bindIdle(body) {
    body.querySelector("[data-action='scan']")?.addEventListener("click", startScan);
  }

  /* ── Scan View ─────────────────────────────────────────────── */
  function renderScanView() {
    const { current, total } = state.progress;
    const percent = total ? Math.min(100, Math.round((current / total) * 100)) : Math.min(90, current * 2);
    const counter = total ? t("ofTotal", { current, total }) : t("ofUnknown", { current });
    const etaText = getActiveETA();
    return `
      <div class="isr-progress">
        <div class="isr-progress-head">
          <h2 data-progress-label>${escapeHTML(state.scanPaused ? t("paused") : t("loadingSaved"))}</h2>
          <p data-progress-note>${escapeHTML(state.progress.note || "")}</p>
        </div>
        <div class="isr-bar"><span data-progress-bar style="width:${percent}%"></span></div>
        <div class="isr-progress-meta">
          <span data-progress-counter>${escapeHTML(counter)}</span>
          <span data-eta class="isr-eta">${escapeHTML(etaText)}</span>
        </div>
        <div class="isr-progress-actions">
          <button type="button" class="isr-btn" data-action="pause-scan">${escapeHTML(t(state.scanPaused ? "resume" : "pause"))}</button>
          <button type="button" class="isr-btn isr-btn--ghost" data-action="cancel-scan">${escapeHTML(t("cancel"))}</button>
        </div>
      </div>
    `;
  }

  function bindScan(body) {
    body.querySelector("[data-action='pause-scan']")?.addEventListener("click", () => {
      state.scanPaused = !state.scanPaused;
      const btn = body.querySelector("[data-action='pause-scan']");
      if (btn) btn.textContent = t(state.scanPaused ? "resume" : "pause");
      const label = body.querySelector("[data-progress-label]");
      if (label) label.textContent = state.scanPaused ? t("paused") : t("loadingSaved");
    });
    body.querySelector("[data-action='cancel-scan']")?.addEventListener("click", () => {
      state.scanCancelled = true;
      state.scanPaused = false;
    });
  }

  /* ── Results View ──────────────────────────────────────────── */
  function renderResultsView() {
    const display = getDisplayItems();
    const total = state.items.length;
    const visibleSelected = display.filter((item) => state.selected.has(item.id)).length;
    let summary;
    if (total === 0) summary = t("foundNone");
    else if (total === 1) summary = t("foundOne");
    else summary = t("foundCount", { count: total });

    return `
      <div class="isr-results">
        <div class="isr-results-summary">${escapeHTML(summary)}</div>
        <div class="isr-search-row">
          <input class="isr-search" type="search" data-search placeholder="${escapeAttr(t("search"))}" value="${escapeAttr(state.search)}" autocomplete="off" spellcheck="false">
        </div>
        <div class="isr-filters">
          ${filterChip("photo", t("filterPhoto"), SVG.photo)}
          ${filterChip("video", t("filterVideo"), SVG.video)}
          ${filterChip("carousel", t("filterCarousel"), SVG.carousel)}
        </div>
        <div class="isr-list" data-list>${renderItemList(display)}</div>
        <div class="isr-actionbar">
          <div class="isr-actionbar-left">
            <button type="button" class="isr-btn isr-btn--small" data-action="select-all" ${display.length ? "" : "disabled"}>
              ${escapeHTML(visibleSelected === display.length && display.length ? t("selectNone") : t("selectAll"))}
            </button>
            <span class="isr-muted" data-selected-label>${escapeHTML(t("selectedCount", { count: state.selected.size }))}</span>
          </div>
          <div class="isr-actionbar-right">
            <button type="button" class="isr-btn isr-btn--small" data-action="copy" ${display.length ? "" : "disabled"}>${escapeHTML(state.selected.size ? t("copy") : t("copyAll"))}</button>
            <button type="button" class="isr-btn isr-btn--danger isr-btn--small" data-action="unsave" ${state.selected.size ? "" : "disabled"}>${escapeHTML(t("unsave"))}${state.selected.size ? " (" + state.selected.size + ")" : ""}</button>
          </div>
        </div>
      </div>
    `;
  }

  function filterChip(key, label, icon) {
    const active = state.filters[key];
    return `
      <button type="button" class="isr-chip ${active ? "isr-chip--on" : ""}" data-filter="${escapeAttr(key)}" aria-pressed="${active ? "true" : "false"}">
        <span class="isr-chip-icon">${icon || ""}</span>
        ${escapeHTML(label)}
      </button>
    `;
  }

  function renderItemList(display) {
    if (!display.length) {
      return `<div class="isr-list-empty">${escapeHTML(t("noMatches"))}</div>`;
    }
    return display.map(renderItemRow).join("");
  }

  function renderItemRow(item) {
    const checked = state.selected.has(item.id);
    const typeLabel = getTypeLabel(item.media_type);
    const typeClass = getTypeClass(item.media_type);
    return `
      <div class="isr-row ${checked ? "isr-row--selected" : ""}" data-row="${escapeAttr(item.id)}" role="button" tabindex="0">
        <input type="checkbox" class="isr-row-check" data-select="${escapeAttr(item.id)}" ${checked ? "checked" : ""} aria-label="${escapeAttr(item.username || "")}">
        <div class="isr-thumb-wrap">
          <img class="isr-thumb" src="${escapeAttr(item.thumbnail_url || "")}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
          <span class="isr-thumb-type ${typeClass}">${typeLabel}</span>
        </div>
        <div class="isr-row-text">
          <div class="isr-row-name">
            <a href="/${encodeURIComponent(item.username || "")}/" target="_blank" rel="noopener noreferrer" data-stop>@${escapeHTML(item.username || "")}</a>
          </div>
          <div class="isr-row-sub">${escapeHTML(truncate(item.caption || "", 60))}</div>
        </div>
        <div class="isr-row-actions">
          <a class="isr-icon-btn" href="/p/${encodeURIComponent(item.shortcode || "")}/" target="_blank" rel="noopener noreferrer" data-stop title="${escapeAttr(t("openPost"))}" aria-label="${escapeAttr(t("openPost"))}">${SVG.open}</a>
        </div>
      </div>
    `;
  }

  function getTypeLabel(mediaType) {
    if (mediaType === 8) return t("typeCarousel");
    if (mediaType === 2) return t("typeVideo");
    return t("typePhoto");
  }

  function getTypeClass(mediaType) {
    if (mediaType === 8) return "isr-thumb-type--carousel";
    if (mediaType === 2) return "isr-thumb-type--video";
    return "";
  }

  function truncate(str, max) {
    if (str.length <= max) return str;
    return str.slice(0, max).trimEnd() + "\u2026";
  }

  function bindResults(body) {
    const search = body.querySelector("[data-search]");
    if (search) {
      search.addEventListener("input", (e) => {
        state.search = e.target.value;
        const list = body.querySelector("[data-list]");
        if (list) list.innerHTML = renderItemList(getDisplayItems());
      });
    }

    body.querySelectorAll("[data-filter]").forEach((el) => {
      el.addEventListener("click", () => {
        const key = el.getAttribute("data-filter");
        state.filters[key] = !state.filters[key];
        persist();
        renderBody();
      });
    });

    body.addEventListener("change", (e) => {
      const checkbox = e.target.closest("[data-select]");
      if (!checkbox) return;
      const id = checkbox.getAttribute("data-select");
      if (checkbox.checked) state.selected.add(id);
      else state.selected.delete(id);
      const row = checkbox.closest("[data-row]");
      if (row) row.classList.toggle("isr-row--selected", checkbox.checked);
      updateSelectedLabel(body);
    });

    body.addEventListener("click", (e) => {
      if (e.target.closest("[data-stop]")) { e.stopPropagation(); return; }
      const row = e.target.closest("[data-row]");
      if (!row || e.target.closest(".isr-row-check")) return;
      const id = row.getAttribute("data-row");
      const checkbox = row.querySelector("[data-select]");
      if (!checkbox) return;
      if (state.selected.has(id)) { state.selected.delete(id); checkbox.checked = false; }
      else { state.selected.add(id); checkbox.checked = true; }
      row.classList.toggle("isr-row--selected", checkbox.checked);
      updateSelectedLabel(body);
    });

    body.addEventListener("keydown", (e) => {
      if (e.key !== " " && e.key !== "Enter") return;
      const row = e.target.closest("[data-row]");
      if (!row || e.target.tagName === "INPUT" || e.target.tagName === "A" || e.target.tagName === "BUTTON") return;
      e.preventDefault();
      row.click();
    });

    body.querySelector("[data-action='select-all']")?.addEventListener("click", () => {
      const display = getDisplayItems();
      const allSelected = display.length && display.every((item) => state.selected.has(item.id));
      if (allSelected) display.forEach((item) => state.selected.delete(item.id));
      else display.forEach((item) => state.selected.add(item.id));
      renderBody();
    });

    body.querySelector("[data-action='copy']")?.addEventListener("click", copyLinks);
    body.querySelector("[data-action='unsave']")?.addEventListener("click", confirmUnsave);
  }

  function updateSelectedLabel(body) {
    const root = body || document.querySelector(`#${APP_ID} [data-body]`);
    if (!root) return;
    const label = root.querySelector("[data-selected-label]");
    if (label) label.textContent = t("selectedCount", { count: state.selected.size });
    const unsaveBtn = root.querySelector("[data-action='unsave']");
    if (unsaveBtn) {
      unsaveBtn.disabled = state.selected.size === 0;
      unsaveBtn.textContent = t("unsave") + (state.selected.size ? " (" + state.selected.size + ")" : "");
    }
    const copyBtn = root.querySelector("[data-action='copy']");
    if (copyBtn) copyBtn.textContent = state.selected.size ? t("copy") : t("copyAll");
  }

  /* ── Unsave View ───────────────────────────────────────────── */
  function renderUnsaveView() {
    const total = state.progress.total;
    const done = state.progress.current;
    const percent = total ? Math.round((done / total) * 100) : 0;
    const last = state.log[state.log.length - 1];
    const summary = state.mode === "unsaveDone"
      ? t("unsaveDoneBody", { ok: state.log.filter((e) => e.ok).length, fail: state.log.filter((e) => !e.ok).length })
      : t("ofTotal", { current: done, total });
    const etaText = state.mode === "unsaving" ? getActiveETA() : "";

    return `
      <div class="isr-progress">
        <div class="isr-progress-head">
          <h2>${escapeHTML(state.mode === "unsaveDone" ? t("unsaveDoneTitle") : (state.unsavePaused ? t("paused") : t("unsaving")))}</h2>
          <p data-progress-note>${escapeHTML(state.progress.note || "")}</p>
        </div>
        <div class="isr-bar"><span style="width:${percent}%"></span></div>
        <div class="isr-progress-meta">
          <span data-progress-counter>${escapeHTML(summary)}</span>
          <span data-eta class="isr-eta">${escapeHTML(etaText)}</span>
        </div>
        ${last ? `
          <div class="isr-current">
            <img class="isr-current-thumb" src="${escapeAttr(last.item.thumbnail_url || "")}" alt="" onerror="this.style.visibility='hidden'">
            <div class="isr-current-info">
              <span class="isr-muted">${escapeHTML(t("currently"))}</span>
              <strong>@${escapeHTML(last.item.username || "")}</strong>
            </div>
            <span class="isr-tag ${last.ok ? "isr-tag--green" : "isr-tag--red"}">${last.ok ? "\u2713" : "\u2715"}</span>
          </div>` : ""}
        <div class="isr-progress-actions">
          ${state.mode === "unsaving" ? `
            <button type="button" class="isr-btn" data-action="pause-unsave">${escapeHTML(t(state.unsavePaused ? "resume" : "pause"))}</button>
            <button type="button" class="isr-btn isr-btn--ghost" data-action="cancel-unsave">${escapeHTML(t("cancel"))}</button>
          ` : `
            <button type="button" class="isr-btn isr-btn--primary" data-action="back-results">${escapeHTML(t("goBack"))}</button>
          `}
        </div>
      </div>
    `;
  }

  function bindUnsave(body) {
    body.querySelector("[data-action='pause-unsave']")?.addEventListener("click", () => {
      state.unsavePaused = !state.unsavePaused;
      renderBody();
    });
    body.querySelector("[data-action='cancel-unsave']")?.addEventListener("click", () => {
      state.unsaveCancelled = true;
      state.unsavePaused = false;
    });
    body.querySelector("[data-action='back-results']")?.addEventListener("click", () => {
      state.mode = "results";
      state.log = [];
      state.unsaveCancelled = false;
      renderBody();
    });
  }

  /* ── Scan Logic ────────────────────────────────────────────── */
  async function startScan() {
    state.error = "";
    state.mode = "scanning";
    state.scanPaused = false;
    state.scanCancelled = false;
    state.items = [];
    state.selected.clear();
    state.log = [];
    state.progress = { current: 0, total: 0, label: "loadingSaved", note: "" };
    renderBody();

    try {
      const viewerId = getCookie("ds_user_id");
      if (!viewerId) throw new Error(t("cookieMissing"));

      const savedItems = await fetchSavedPosts();
      if (state.scanCancelled) return resetToIdle();

      state.items = savedItems;
      state.mode = "results";
      toast(t("scanCompletedToast", { count: savedItems.length }));
      renderBody();
    } catch (error) {
      console.error("[isr] scan failed:", error);
      state.error = error?.message || String(error) || t("scanFailed");
      state.mode = "idle";
      renderBody();
    }
  }

  function resetToIdle() {
    state.mode = "idle";
    state.items = [];
    state.scanCancelled = false;
    state.error = "";
    renderBody();
  }

  async function fetchSavedPosts() {
    const results = [];
    let maxId = "";
    let page = 0;

    while (true) {
      await waitWhile(() => state.scanPaused && !state.scanCancelled);
      if (state.scanCancelled) return results;

      let url = "/api/v1/feed/saved/posts/";
      const params = new URLSearchParams();
      if (maxId) params.set("max_id", maxId);
      params.set("include_igtv_preview", "false");
      const qs = params.toString();
      if (qs) url += "?" + qs;

      const json = await igFetch(url);
      const items = json?.items;
      if (!Array.isArray(items) || items.length === 0) break;

      for (const wrapper of items) {
        const media = wrapper.media || wrapper;
        const normalized = normalizeMedia(media);
        if (normalized.id) results.push(normalized);
      }

      state.progress = { current: results.length, total: 0, label: "loadingSaved", note: "" };
      updateProgressDOM();

      if (!json.more_available) break;
      maxId = json.next_max_id || "";
      if (!maxId) break;

      page += 1;
      await sleep(randomBetween(state.timings.scanDelayMin, state.timings.scanDelayMax));
      if (state.timings.scanPauseEveryPages > 0 && page % state.timings.scanPauseEveryPages === 0) {
        await sleepWithCountdown(state.timings.scanPauseMs, "cooldownIn");
      }
    }

    return results;
  }

  function normalizeMedia(media) {
    const id = String(media.id || media.pk || "");
    // media.pk is the pure numeric PK needed for API calls
    // media.id is often in format "mediaPk_userPk" which causes 404 on unsave
    const pk = String(media.pk || media.pk_id || id.split("_")[0] || "");
    const user = media.user || {};
    let thumbnail = "";
    if (media.image_versions2?.candidates?.length) {
      const candidates = media.image_versions2.candidates;
      const small = candidates.find((c) => c.width <= 320) || candidates[candidates.length - 1] || candidates[0];
      thumbnail = small.url || "";
    } else if (media.carousel_media?.[0]?.image_versions2?.candidates?.length) {
      const candidates = media.carousel_media[0].image_versions2.candidates;
      const small = candidates.find((c) => c.width <= 320) || candidates[candidates.length - 1] || candidates[0];
      thumbnail = small.url || "";
    }
    let caption = "";
    if (media.caption?.text) caption = media.caption.text;
    return {
      id,
      pk,
      shortcode: String(media.code || ""),
      username: String(user.username || ""),
      full_name: String(user.full_name || ""),
      thumbnail_url: thumbnail,
      caption,
      media_type: media.media_type || 1,
      taken_at: media.taken_at || 0
    };
  }

  /* ── Unsave Logic ──────────────────────────────────────────── */
  function confirmUnsave() {
    if (!state.selected.size) return;
    const count = state.selected.size;
    const avgDelay = (state.timings.removeDelayMin + state.timings.removeDelayMax) / 2;
    const cooldowns = state.timings.removePauseEvery > 0
      ? Math.floor(count / state.timings.removePauseEvery) * state.timings.removePauseMs
      : 0;
    const totalSec = Math.round(((count * avgDelay) + cooldowns) / 1000);
    const etaText = formatETA(totalSec);

    showDialog({
      title: t("unsaveConfirmTitle", { count }),
      body: t("unsaveConfirmBody", { eta: etaText ? ` (${etaText})` : "" }),
      confirmLabel: t("unsaveConfirmBtn", { count }),
      destructive: true,
      onConfirm: () => startUnsave()
    });
  }

  async function startUnsave() {
    const targets = state.items.filter((item) => state.selected.has(item.id));
    if (!targets.length) return;

    const csrf = getCookie("csrftoken");
    if (!csrf) { toast(t("csrfMissing")); return; }

    state.mode = "unsaving";
    state.unsavePaused = false;
    state.unsaveCancelled = false;
    state.log = [];
    state.progress = { current: 0, total: targets.length, label: "unsaving", note: "" };
    renderBody();

    let processed = 0;
    for (let i = 0; i < targets.length; i += 1) {
      await waitWhile(() => state.unsavePaused && !state.unsaveCancelled);
      if (state.unsaveCancelled) break;

      const item = targets[i];
      let ok = false;
      try { ok = await unsaveMedia(item.pk, csrf); }
      catch (error) { console.error("[isr] unsave failed for", item.pk, error); }

      state.log.push({ item, ok });
      if (ok) {
        state.selected.delete(item.id);
        item.removed = true;
      }
      processed += 1;
      state.progress = { current: processed, total: targets.length, label: "unsaving", note: "" };
      renderBody();

      const isLast = i === targets.length - 1;
      if (!isLast) {
        await sleepWithCountdown(randomBetween(state.timings.removeDelayMin, state.timings.removeDelayMax), "nextActionIn");
        if (state.timings.removePauseEvery > 0 && (i + 1) % state.timings.removePauseEvery === 0) {
          await sleepWithCountdown(state.timings.removePauseMs, "cooldownIn");
        }
      }
    }

    state.items = state.items.filter((item) => !item.removed);
    state.mode = "unsaveDone";
    state.waitUntil = 0;
    state.waitReason = "";
    renderBody();
  }

  async function unsaveMedia(mediaPk, csrf) {
    // Try the v1 API endpoint first (just the numeric pk, no user suffix)
    const headers = {
      ...IG_HEADERS,
      "content-type": "application/x-www-form-urlencoded",
      "x-csrftoken": csrf
    };

    let response = await fetch(`/api/v1/media/${mediaPk}/unsave/`, {
      method: "POST",
      credentials: "include",
      headers
    });
    if (response.ok) return true;

    // Fallback: try the web endpoint
    response = await fetch(`/web/save/${mediaPk}/unsave/`, {
      method: "POST",
      credentials: "include",
      headers
    });
    if (response.ok) return true;

    // Fallback: try GraphQL-based unsave
    response = await fetch("/api/v1/media/unsave/", {
      method: "POST",
      credentials: "include",
      headers: { ...headers, "content-type": "application/x-www-form-urlencoded" },
      body: `media_id=${mediaPk}`
    });
    return response.ok;
  }

  /* ── Copy ───────────────────────────────────────────────────── */
  async function copyLinks() {
    const display = getDisplayItems();
    const target = state.selected.size ? display.filter((item) => state.selected.has(item.id)) : display;
    if (!target.length) return;
    const text = target.map((item) => `https://www.instagram.com/p/${item.shortcode}/`).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      toast(t("copiedToast", { count: target.length }));
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); toast(t("copiedToast", { count: target.length })); } catch { }
      ta.remove();
    }
  }

  /* ── Settings ──────────────────────────────────────────────── */
  function showSettings() {
    const fields = [
      ["scanDelayMin", "minScanDelay", 100],
      ["scanDelayMax", "maxScanDelay", 100],
      ["scanPauseEveryPages", "scanPauseEvery", 1],
      ["scanPauseMs", "scanPauseLength", 1000],
      ["removeDelayMin", "minRemoveDelay", 1000],
      ["removeDelayMax", "maxRemoveDelay", 1000],
      ["removePauseEvery", "removePauseEvery", 1],
      ["removePauseMs", "removePauseLength", 1000]
    ];
    const formHTML = fields.map(([key, label, step]) => `
      <label class="isr-field">
        <span>${escapeHTML(t(label))}</span>
        <input type="number" min="0" step="${step}" data-setting="${escapeAttr(key)}" value="${Number(state.timings[key])}">
      </label>
    `).join("");
    showDialog({
      title: t("settingsTitle"),
      body: t("settingsBody"),
      contentHTML: `<div class="isr-form">${formHTML}</div>`,
      confirmLabel: t("save"),
      extraButton: { label: t("restoreDefaults"), action: "restore" },
      onConfirm: (dialog) => {
        dialog.querySelectorAll("[data-setting]").forEach((input) => {
          const key = input.getAttribute("data-setting");
          const val = Number(input.value);
          if (Number.isFinite(val) && val >= 0) state.timings[key] = val;
        });
        persist();
        toast(t("saved"));
      },
      onExtra: (dialog) => {
        Object.assign(state.timings, DEFAULT_TIMINGS);
        dialog.querySelectorAll("[data-setting]").forEach((input) => {
          const key = input.getAttribute("data-setting");
          input.value = state.timings[key];
        });
      }
    });
  }

  /* ── Dialog ────────────────────────────────────────────────── */
  function showDialog({ title, body, contentHTML, confirmLabel, destructive, extraButton, onConfirm, onExtra }) {
    const overlay = document.createElement("div");
    overlay.className = "isr-overlay";
    overlay.innerHTML = `
      <div class="isr-dialog" role="dialog" aria-modal="true">
        <h3>${escapeHTML(title)}</h3>
        ${body ? `<p>${escapeHTML(body)}</p>` : ""}
        ${contentHTML || ""}
        <div class="isr-dialog-actions">
          ${extraButton ? `<button type="button" class="isr-btn isr-btn--ghost isr-btn--small" data-extra>${escapeHTML(extraButton.label)}</button>` : ""}
          <button type="button" class="isr-btn isr-btn--small" data-cancel>${escapeHTML(t("cancel"))}</button>
          <button type="button" class="isr-btn isr-btn--small ${destructive ? "isr-btn--danger" : "isr-btn--primary"}" data-confirm>${escapeHTML(confirmLabel)}</button>
        </div>
      </div>
    `;
    document.getElementById(APP_ID).appendChild(overlay);
    const close = () => overlay.remove();
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    overlay.querySelector("[data-cancel]").addEventListener("click", close);
    overlay.querySelector("[data-confirm]").addEventListener("click", () => {
      try { onConfirm?.(overlay.querySelector(".isr-dialog")); } finally { close(); }
    });
    if (extraButton && onExtra) {
      overlay.querySelector("[data-extra]").addEventListener("click", () => onExtra(overlay.querySelector(".isr-dialog")));
    }
  }

  /* ── Language Toggle ───────────────────────────────────────── */
  function toggleLanguage() {
    state.language = state.language === "tr" ? "en" : "tr";
    persist();
    renderShell();
  }

  /* ── Display Filtering ─────────────────────────────────────── */
  function getDisplayItems() {
    const query = state.search.trim().toLowerCase();
    return state.items
      .filter((item) => {
        if (item.media_type === 8 && !state.filters.carousel) return false;
        if (item.media_type === 2 && !state.filters.video) return false;
        if (item.media_type === 1 && !state.filters.photo) return false;
        return true;
      })
      .filter((item) => {
        if (!query) return true;
        const searchable = ((item.username || "") + " " + (item.caption || "") + " " + (item.full_name || "")).toLowerCase();
        return searchable.includes(query);
      });
  }

  /* ── Network Helpers ───────────────────────────────────────── */
  async function igFetch(url, init = {}) {
    let attempt = 0;
    while (true) {
      const response = await fetch(url, {
        credentials: "include",
        headers: { ...IG_HEADERS, ...(init.headers || {}) },
        ...init
      });
      if (response.ok) return response.json();
      if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
        if (attempt >= MAX_RETRIES) {
          if (response.status === 429) throw new Error(t("tooManyRequests"));
          throw new Error(t("requestFailed", { status: response.status }));
        }
        const retryAfter = parseRetryAfter(response.headers.get("retry-after"));
        const wait = retryAfter || Math.min(60000, 5000 * Math.pow(2, attempt));
        await sleepWithCountdown(wait, "cooldownIn");
        attempt += 1;
        continue;
      }
      throw new Error(t("requestFailed", { status: response.status }));
    }
  }

  function parseRetryAfter(value) {
    if (!value) return 0;
    const seconds = Number(value);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    const date = Date.parse(value);
    if (!Number.isNaN(date)) return Math.max(0, date - Date.now());
    return 0;
  }

  function getCookie(name) {
    const match = document.cookie.match(new RegExp("(^|; )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]*)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  /* ── Timing Helpers ────────────────────────────────────────── */
  function sleep(ms) { return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms))); }

  function randomBetween(min, max) {
    const lo = Math.min(min, max);
    const hi = Math.max(min, max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
  }

  async function waitWhile(predicate, interval = 200) {
    while (predicate()) await sleep(interval);
  }

  async function sleepWithCountdown(ms, reasonKey) {
    state.waitUntil = Date.now() + ms;
    state.waitReason = reasonKey;
    updateCountdownDOM();
    const start = Date.now();
    while (Date.now() - start < ms) {
      if (state.scanCancelled || state.unsaveCancelled) break;
      await sleep(Math.min(250, ms - (Date.now() - start)));
      if (state.scanPaused || state.unsavePaused) {
        const pauseStart = Date.now();
        await waitWhile(() => state.scanPaused || state.unsavePaused);
        state.waitUntil += Date.now() - pauseStart;
        updateCountdownDOM();
      }
    }
    state.waitUntil = 0;
    state.waitReason = "";
    updateCountdownDOM();
  }

  function startCountdown() {
    if (countdownTimer) return;
    countdownTimer = setInterval(updateCountdownDOM, 500);
  }

  function stopCountdown() {
    if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; }
  }

  function updateCountdownDOM() {
    const node = document.querySelector(`#${APP_ID} [data-countdown]`);
    if (!node) return;
    if (!state.waitUntil) { node.textContent = ""; return; }
    const remaining = Math.max(0, Math.ceil((state.waitUntil - Date.now()) / 1000));
    node.textContent = t(state.waitReason || "nextActionIn", { seconds: remaining });
  }

  /* ── ETA Helper Functions ──────────────────────────────────── */
  function formatETA(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) return "";
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    let timeStr = "";
    if (m === 0) {
      timeStr = t("etaSeconds", { seconds: s });
    } else if (s === 0) {
      timeStr = t("etaMinutes", { minutes: m });
    } else {
      timeStr = t("etaMinSec", { minutes: m, seconds: s });
    }
    return t("etaLabel", { time: timeStr });
  }

  function getActiveETA() {
    if (state.mode === "scanning") {
      const { current, total } = state.progress;
      if (!total || total <= current) return "";
      const remaining = total - current;
      const pages = Math.ceil(remaining / 12);
      const avgDelay = (state.timings.scanDelayMin + state.timings.scanDelayMax) / 2;
      const cooldowns = state.timings.scanPauseEveryPages > 0 
        ? Math.floor(pages / state.timings.scanPauseEveryPages) * state.timings.scanPauseMs
        : 0;
      const totalSec = Math.round(((pages * avgDelay) + cooldowns) / 1000);
      return formatETA(totalSec);
    } else if (state.mode === "unsaving") {
      const { current, total } = state.progress;
      if (!total || total <= current) return "";
      const remaining = total - current;
      const avgDelay = (state.timings.removeDelayMin + state.timings.removeDelayMax) / 2;
      const cooldowns = state.timings.removePauseEvery > 0 
        ? Math.floor(remaining / state.timings.removePauseEvery) * state.timings.removePauseMs
        : 0;
      const totalSec = Math.round(((remaining * avgDelay) + cooldowns) / 1000);
      return formatETA(totalSec);
    }
    return "";
  }

  function updateProgressDOM() {
    const root = document.querySelector(`#${APP_ID} [data-body]`);
    if (!root) return;
    const { current, total } = state.progress;
    const percent = total ? Math.min(100, Math.round((current / total) * 100)) : Math.min(90, current * 2);
    const bar = root.querySelector("[data-progress-bar]");
    if (bar) bar.style.width = percent + "%";
    const counter = root.querySelector("[data-progress-counter]");
    if (counter) counter.textContent = total ? t("ofTotal", { current, total }) : t("ofUnknown", { current });
    const etaEl = root.querySelector("[data-eta]");
    if (etaEl) etaEl.textContent = getActiveETA();
    const labelEl = root.querySelector("[data-progress-label]");
    if (labelEl) labelEl.textContent = state.scanPaused ? t("paused") : t("loadingSaved");
    if (state.minimized) {
      const pillLabelEl = document.querySelector(`#${APP_ID} [data-pill-label]`);
      if (pillLabelEl) pillLabelEl.textContent = pillLabel();
    }
  }

  /* ── Toast ──────────────────────────────────────────────────── */
  function toast(message) {
    const root = document.getElementById(APP_ID);
    if (!root) return;
    root.querySelector(".isr-toast")?.remove();
    if (toastTimer) { clearTimeout(toastTimer); toastTimer = null; }
    const node = document.createElement("div");
    node.className = "isr-toast";
    node.textContent = message;
    root.appendChild(node);
    toastTimer = setTimeout(() => { node.remove(); toastTimer = null; }, 3500);
  }

  /* ── Utility ────────────────────────────────────────────────── */
  function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

  function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function escapeAttr(value) { return escapeHTML(value); }

  /* ── CSS ────────────────────────────────────────────────────── */
  const CSS = `
#${APP_ID}, #${APP_ID} * { box-sizing: border-box; }
#${APP_ID} {
  --isr-bg: #15171d;
  --isr-bg-2: #1c1f27;
  --isr-bg-3: #232733;
  --isr-line: rgba(255,255,255,0.08);
  --isr-line-strong: rgba(255,255,255,0.16);
  --isr-text: #f1f3f5;
  --isr-muted: #8b94a3;
  --isr-accent: #e1306c;
  --isr-accent-2: #fd1d1d;
  --isr-accent-gradient: linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%);
  --isr-danger: #ef4444;
  --isr-success: #22c55e;
  position: fixed; inset: 0; pointer-events: none; z-index: 2147483647;
  color: var(--isr-text);
  font: 14px/1.45 -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, system-ui, sans-serif;
}
#${APP_ID} > * { pointer-events: auto; }
#${APP_ID} button, #${APP_ID} input, #${APP_ID} a { font: inherit; color: inherit; }
#${APP_ID} a { text-decoration: none; }
#${APP_ID} button { cursor: pointer; }

#${APP_ID} .isr-panel {
  position: absolute; width: ${PANEL_WIDTH}px;
  max-width: calc(100vw - 24px); max-height: calc(100vh - 24px);
  display: flex; flex-direction: column;
  background: var(--isr-bg); border: 1px solid var(--isr-line);
  border-radius: 14px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.45), 0 2px 6px rgba(0,0,0,0.3);
  overflow: hidden;
  animation: isr-pop 0.18s ease-out;
}
@keyframes isr-pop {
  from { opacity: 0; transform: translateY(8px) scale(0.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

#${APP_ID} .isr-header {
  flex-shrink: 0; display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 12px 12px 12px 14px;
  border-bottom: 1px solid var(--isr-line);
  cursor: grab; user-select: none;
  background: linear-gradient(180deg, rgba(255,255,255,0.02), transparent);
}
#${APP_ID} .isr-header.isr-dragging { cursor: grabbing; }
#${APP_ID} .isr-brand { display: flex; align-items: center; gap: 10px; min-width: 0; }
#${APP_ID} .isr-brand-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%);
  flex-shrink: 0; box-shadow: 0 0 10px rgba(225, 48, 108, 0.5);
}
#${APP_ID} .isr-brand-text { min-width: 0; }
#${APP_ID} .isr-brand-text strong { display: block; font-size: 14px; font-weight: 600; }
#${APP_ID} .isr-brand-text span { display: block; font-size: 11px; color: var(--isr-muted); }
#${APP_ID} .isr-header-actions { display: flex; gap: 4px; flex-shrink: 0; }
#${APP_ID} .isr-header-actions button {
  width: 28px; height: 28px; display: grid; place-items: center;
  border: none; background: transparent; border-radius: 6px;
  color: var(--isr-muted); transition: background 0.15s, color 0.15s;
  font-size: 11px; font-weight: 600;
}
#${APP_ID} .isr-header-actions button:hover { background: var(--isr-bg-2); color: var(--isr-text); }
#${APP_ID} .isr-header-actions svg { display: block; }

#${APP_ID} .isr-body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; overflow: hidden; }

#${APP_ID} .isr-welcome {
  padding: 28px 22px; text-align: center;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
}
#${APP_ID} .isr-welcome-icon {
  width: 64px; height: 64px; display: grid; place-items: center;
  border-radius: 50%; background: rgba(224,90,141,0.15);
  color: var(--isr-accent); margin-bottom: 4px;
}
#${APP_ID} .isr-welcome-icon--error { background: rgba(239,68,68,0.15); color: var(--isr-danger); }
#${APP_ID} .isr-welcome h2 { margin: 0; font-size: 17px; font-weight: 600; }
#${APP_ID} .isr-welcome p { margin: 0; color: var(--isr-muted); font-size: 13px; max-width: 300px; }

#${APP_ID} .isr-btn {
  border: 1px solid var(--isr-line); background: var(--isr-bg-2); color: var(--isr-text);
  padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 500;
  transition: background 0.15s, border-color 0.15s, transform 0.05s;
}
#${APP_ID} .isr-btn:hover:not(:disabled) { background: var(--isr-bg-3); border-color: var(--isr-line-strong); }
#${APP_ID} .isr-btn:active:not(:disabled) { transform: scale(0.98); }
#${APP_ID} .isr-btn:disabled { opacity: 0.4; cursor: not-allowed; }
#${APP_ID} .isr-btn--primary { background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%); border: none; color: #fff; box-shadow: 0 4px 12px rgba(225, 48, 108, 0.3); }
#${APP_ID} .isr-btn--primary:hover:not(:disabled) { background: linear-gradient(135deg, #9b42c2 0%, #f32c2c 50%, #fca326 100%); box-shadow: 0 6px 16px rgba(225, 48, 108, 0.4); }
#${APP_ID} .isr-btn--danger { background: var(--isr-danger); border-color: var(--isr-danger); color: #fff; }
#${APP_ID} .isr-btn--danger:hover:not(:disabled) { background: #f25555; border-color: #f25555; }
#${APP_ID} .isr-btn--ghost { background: transparent; }
#${APP_ID} .isr-btn--lg { padding: 10px 20px; font-size: 14px; margin-top: 8px; }
#${APP_ID} .isr-btn--small { padding: 6px 10px; font-size: 12px; }

#${APP_ID} .isr-progress { padding: 22px 20px; display: flex; flex-direction: column; gap: 14px; }
#${APP_ID} .isr-progress-head h2 { margin: 0; font-size: 15px; font-weight: 600; }
#${APP_ID} .isr-progress-head p { margin: 4px 0 0; color: var(--isr-muted); font-size: 12px; min-height: 1em; }
#${APP_ID} .isr-bar { height: 6px; border-radius: 3px; background: rgba(255,255,255,0.06); overflow: hidden; }
#${APP_ID} .isr-bar > span {
  display: block; height: 100%;
  background: linear-gradient(90deg, #833ab4, #fd1d1d, #fcb045);
  transition: width 0.3s ease;
}
#${APP_ID} .isr-progress-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; }
#${APP_ID} .isr-eta { font-size: 11px; font-weight: 600; color: var(--isr-accent); background: rgba(224,90,141,0.12); padding: 3px 8px; border-radius: 6px; }
#${APP_ID} .isr-progress-actions { display: flex; gap: 8px; }

#${APP_ID} .isr-current {
  display: flex; align-items: center; gap: 10px; padding: 10px;
  background: var(--isr-bg-2); border-radius: 8px; font-size: 12px;
}
#${APP_ID} .isr-current-thumb {
  width: 36px; height: 36px; border-radius: 6px; object-fit: cover;
  background: var(--isr-bg-3); flex-shrink: 0;
}
#${APP_ID} .isr-current-info { flex: 1; min-width: 0; }
#${APP_ID} .isr-current-info span { display: block; }
#${APP_ID} .isr-current strong { font-weight: 600; }

#${APP_ID} .isr-results { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; }
#${APP_ID} .isr-results-summary { padding: 12px 16px 4px; font-size: 13px; color: var(--isr-muted); }
#${APP_ID} .isr-search-row { padding: 8px 16px; }
#${APP_ID} .isr-search {
  width: 100%; height: 36px; padding: 0 12px;
  border: 1px solid var(--isr-line); border-radius: 8px;
  background: var(--isr-bg-2); color: var(--isr-text);
  outline: none; transition: border-color 0.15s;
}
#${APP_ID} .isr-search:focus { border-color: var(--isr-accent); }
#${APP_ID} .isr-search::-webkit-search-cancel-button { filter: invert(1) opacity(0.5); }

#${APP_ID} .isr-filters { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 10px; }
#${APP_ID} .isr-chip {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 4px 10px; border: 1px solid var(--isr-line); border-radius: 999px;
  background: transparent; color: var(--isr-muted); font-size: 12px;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
#${APP_ID} .isr-chip:hover { border-color: var(--isr-line-strong); color: var(--isr-text); }
#${APP_ID} .isr-chip--on {
  background: rgba(224,90,141,0.12); border-color: rgba(224,90,141,0.5);
  color: var(--isr-accent-2);
}
#${APP_ID} .isr-chip-icon { display: inline-grid; place-items: center; width: 12px; height: 12px; }
#${APP_ID} .isr-chip-icon svg { width: 12px; height: 12px; }

#${APP_ID} .isr-list {
  flex: 1 1 auto; min-height: 100px; max-height: 50vh;
  overflow-y: auto; overscroll-behavior: contain;
  border-top: 1px solid var(--isr-line); border-bottom: 1px solid var(--isr-line);
}
#${APP_ID} .isr-list-empty { padding: 30px 20px; text-align: center; color: var(--isr-muted); font-size: 13px; }

#${APP_ID} .isr-row {
  display: grid; grid-template-columns: 18px 52px 1fr auto;
  gap: 10px; padding: 8px 16px; align-items: center;
  cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.04);
  transition: background 0.1s;
}
#${APP_ID} .isr-row:hover { background: rgba(255,255,255,0.02); }
#${APP_ID} .isr-row:focus-visible { outline: none; background: rgba(224,90,141,0.06); }
#${APP_ID} .isr-row--selected { background: rgba(224,90,141,0.08); }
#${APP_ID} .isr-row--selected:hover { background: rgba(224,90,141,0.12); }
#${APP_ID} .isr-row:last-child { border-bottom: none; }
#${APP_ID} .isr-row-check { width: 16px; height: 16px; accent-color: var(--isr-accent); cursor: pointer; margin: 0; }

#${APP_ID} .isr-thumb-wrap { position: relative; width: 52px; height: 52px; flex-shrink: 0; }
#${APP_ID} .isr-thumb {
  width: 52px; height: 52px; border-radius: 6px; object-fit: cover;
  background: var(--isr-bg-3);
}
#${APP_ID} .isr-thumb-type {
  position: absolute; bottom: 2px; right: 2px;
  font-size: 8px; font-weight: 700; text-transform: uppercase;
  padding: 1px 4px; border-radius: 3px; letter-spacing: 0.03em;
  background: rgba(0,0,0,0.7); color: rgba(255,255,255,0.85);
  backdrop-filter: blur(4px);
}
#${APP_ID} .isr-thumb-type--video { background: rgba(168,85,247,0.8); }
#${APP_ID} .isr-thumb-type--carousel { background: rgba(59,130,246,0.8); }

#${APP_ID} .isr-row-text { min-width: 0; }
#${APP_ID} .isr-row-name {
  display: flex; align-items: center; gap: 6px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  font-size: 13px; font-weight: 500;
}
#${APP_ID} .isr-row-name a { color: var(--isr-text); }
#${APP_ID} .isr-row-name a:hover { color: var(--isr-accent-2); }
#${APP_ID} .isr-row-sub {
  font-size: 11px; color: var(--isr-muted);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-width: 200px;
}
#${APP_ID} .isr-row-actions { display: flex; gap: 4px; align-items: center; }
#${APP_ID} .isr-icon-btn {
  display: inline-grid; place-items: center;
  width: 28px; height: 28px; border-radius: 6px;
  border: none; background: transparent; color: var(--isr-muted);
  transition: background 0.15s, color 0.15s;
}
#${APP_ID} .isr-icon-btn:hover { background: var(--isr-bg-2); color: var(--isr-text); }

#${APP_ID} .isr-tag {
  display: inline-flex; align-items: center;
  padding: 1px 6px; border-radius: 4px;
  font-size: 10px; font-weight: 600;
  background: rgba(255,255,255,0.06); color: var(--isr-muted);
  letter-spacing: 0.02em; text-transform: uppercase;
}
#${APP_ID} .isr-tag--green { background: rgba(34,197,94,0.15); color: var(--isr-success); }
#${APP_ID} .isr-tag--red { background: rgba(239,68,68,0.15); color: var(--isr-danger); }

#${APP_ID} .isr-actionbar {
  flex-shrink: 0; display: flex; justify-content: space-between; align-items: center;
  gap: 8px; padding: 10px 16px;
  background: var(--isr-bg); border-top: 1px solid var(--isr-line);
}
#${APP_ID} .isr-actionbar-left, #${APP_ID} .isr-actionbar-right {
  display: flex; align-items: center; gap: 8px; min-width: 0;
}
#${APP_ID} .isr-muted { color: var(--isr-muted); font-size: 12px; }

#${APP_ID} .isr-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,0.55);
  display: grid; place-items: center; padding: 20px; z-index: 1;
}
#${APP_ID} .isr-dialog {
  width: 100%; max-width: 380px; background: var(--isr-bg);
  border: 1px solid var(--isr-line); border-radius: 12px;
  padding: 18px; box-shadow: 0 30px 80px rgba(0,0,0,0.55);
}
#${APP_ID} .isr-dialog h3 { margin: 0 0 8px; font-size: 16px; }
#${APP_ID} .isr-dialog p { margin: 0 0 14px; color: var(--isr-muted); font-size: 13px; }
#${APP_ID} .isr-dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
#${APP_ID} .isr-dialog-actions [data-extra] { margin-right: auto; }

#${APP_ID} .isr-form { display: grid; gap: 8px; max-height: 50vh; overflow-y: auto; padding-right: 4px; }
#${APP_ID} .isr-field {
  display: grid; grid-template-columns: 1fr 110px; align-items: center;
  gap: 10px; font-size: 12px; color: var(--isr-muted);
}
#${APP_ID} .isr-field input {
  height: 32px; padding: 0 10px; border: 1px solid var(--isr-line);
  border-radius: 6px; background: var(--isr-bg-2); color: var(--isr-text); outline: none;
}
#${APP_ID} .isr-field input:focus { border-color: var(--isr-accent); }

#${APP_ID} .isr-toast {
  position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%);
  padding: 8px 14px; background: rgba(20,22,28,0.95);
  border: 1px solid var(--isr-line); border-radius: 999px;
  font-size: 12px; box-shadow: 0 6px 20px rgba(0,0,0,0.35);
  pointer-events: none; animation: isr-pop 0.18s ease-out;
}

#${APP_ID} .isr-pill {
  position: absolute; display: inline-flex; align-items: center;
  gap: 8px; padding: 8px 14px; background: var(--isr-bg);
  border: 1px solid var(--isr-line); color: var(--isr-text);
  border-radius: 999px; box-shadow: 0 12px 30px rgba(0,0,0,0.4);
  font-size: 12px; font-weight: 500; transition: background 0.15s; cursor: pointer;
}
#${APP_ID} .isr-pill:hover { background: var(--isr-bg-2); }
#${APP_ID} .isr-pill-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--isr-muted); }
#${APP_ID} .isr-pill-dot--active { background: var(--isr-accent); animation: isr-pulse 1.4s infinite; }
#${APP_ID} .isr-pill-dot--error { background: var(--isr-danger); }
@keyframes isr-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

@media (max-width: 480px) {
  #${APP_ID} .isr-panel {
    width: calc(100vw - 16px) !important; max-height: calc(100vh - 16px) !important;
    left: 8px !important; right: 8px !important; top: 8px !important; bottom: 8px !important;
  }
  #${APP_ID} .isr-list { max-height: none; flex: 1 1 auto; }
}
  `;

  /* ── Init ───────────────────────────────────────────────────── */
  cleanupExisting();
  injectStyles();
  mount();
})();
