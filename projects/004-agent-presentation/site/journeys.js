/* Offline visual lessons. All service replies and documents are local teaching examples. */
(function (root) {
  "use strict";
  const E = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const F = (s) => String(s).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const B = (a, t, cls = "") =>
    `<button data-story="${a}" class="${cls}">${t}</button>`;
  const paths = {
    model:
      "M20 20h40v40H20z M30 30h20v20H30z M10 30h10m40 0h10M10 50h10m40 0h10M30 10v10m20-10v10M30 60v10m20-10v10",
    person:
      "M40 12a12 12 0 1 0 0 24 12 12 0 0 0 0-24M18 70V58c0-23 44-23 44 0v12",
    tool: "M25 12v22h30V12M40 34v36",
    file: "M20 8h27l15 15v49H20z M47 8v16h15M29 38h24M29 49h24M29 60h16",
    search: "M55 55l16 16M60 34a26 26 0 1 1-52 0 26 26 0 0 1 52 0",
    book: "M12 18c12-7 20-7 28 0 8-7 16-7 28 0v48c-12-7-20-7-28 0-8-7-16-7-28 0z M40 18v48",
    web: "M10 15h60v51H10z M10 29h60M20 22h1m8 0h1M22 40h16v16H22M47 42h14m-14 11h14",
    lock: "M20 34h40v36H20z M28 34V22a12 12 0 1 1 24 0v12M40 48v10",
    check: "M14 40l17 18L67 20",
    cloud: "M19 60h44a13 13 0 0 0 0-26 23 23 0 0 0-44-5 16 16 0 0 0 0 31",
    phone: "M22 6h36v68H22z M32 13h16M37 66h6",
    key: "M28 45a16 16 0 1 1 8 8L18 71H8V60z",
    stamp: "M25 38h30V20a15 15 0 0 0-30 0z M15 47h50v17H15zM20 72h40",
    vote: "M12 36h56v36H12z M27 43h26M26 10l28 7-8 28-28-7z",
    heart: "M40 66L12 38c-17-24 17-41 28-17 11-24 45-7 28 17z",
    chart: "M12 10v60h58M25 58V42m15 16V30m15 28V16",
    folder: "M8 24h25l7-10h32v52H8z",
  };
  const I = (k, cls = "") =>
    `<svg viewBox="0 0 80 80" class="j-icon ${cls}" aria-hidden="true"><path d="${paths[k] || paths.file}"/></svg>`;
  const badge = (t, tone = "") =>
    `<span class="j-badge ${tone}">${E(t)}</span>`;
  const card = (title, body, icon = "file", cls = "") =>
    `<div class="j-card ${cls}">${I(icon)}<h3>${E(title)}</h3><div class="j-copy">${body}</div></div>`;
  const steps = (items, active = 0) =>
    `<div class="j-steps">${items.map((t, i) => `<div class="${i === active ? "current" : i < active ? "done" : ""}"><b>${F(i + 1)}</b><span>${E(t)}</span></div>`).join("")}</div>`;
  const actions = (html) => `<div class="j-actions">${html}</div>`;
  const result = (text, tone = "") =>
    `<div class="j-result ${tone}" role="status">${I(tone === "blocked" ? "lock" : "check")}<span>${E(text)}</span></div>`;
  const surface = (label, html, cls = "") =>
    `<div class="j-surface ${cls}"><small>${E(label)}</small>${html}</div>`;
  const kinds = new Set([
    "benchmark-score",
    "benchmark-tour",
    "contributor",
    "local-weights",
    "peak-pricing",
    "harness-map",
    "cutoff-timeline",
    "relay",
    "search-services",
    "tool-dispatch",
    "tool-form",
    "tool-shelf",
    "document-question",
    "history-tools",
    "context-packet",
    "context-stores",
    "history-lookup",
    "agent-cycle",
    "stop-states",
    "action-policies",
    "amount-binding",
    "private-route",
    "user-response",
    "outage-message",
    "product-factory",
    "producer-product",
    "production-method",
    "quality-lab",
    "translation-workflow",
    "research-workflow",
    "production-choices",
    "general-agent",
    "coding-workbench",
    "specialized-producer",
    "builder-runtime",
    "build-analogy",
    "codo-workflows",
    "assistant-roles",
    "assistant-chain",
    "assistant-network",
    "mcp-integrations",
    "os-vision",
    "magic-ingredients",
    "jobs-question",
    "career-timeline",
    "expert-deliverable",
    "professional-gate",
    "stamp-market",
    "political-change",
    "relational-work",
  ]);

  const packetParts = [
    {
      id: "instructions",
      title: "دستورهای برنامه",
      text: "برای سفر کمک کن؛ اقدامِ حساس، تأیید لازم دارد.",
    },
    {
      id: "messages",
      title: "پیام‌های اخیر",
      text: "سارا: سفرِ مشهد. دستیار: رزرو ۱۲۴؛ برگشت جمعه.",
    },
    {
      id: "tools",
      title: "ابزارهای مجاز",
      text: "جستجوی قطار · رزروهای من · دریافت بلیت",
    },
    {
      id: "results",
      title: "نتیجهٔ ابزار",
      text: "آیین‌نامه: سقفِ هتل شبی ۳ میلیون است.",
    },
  ];
  function packet(selected = ["instructions", "messages", "tools"]) {
    return [
      { id: "request", title: "پیامِ تازهٔ سارا", text: "برگشت را عوض کن." },
      ...packetParts.filter((p) => selected.includes(p.id)),
    ];
  }
  const records = [
    { id: "124", owner: "U-17", city: "مشهد" },
    { id: "125", owner: "U-17", city: "تبریز" },
    { id: "999", owner: "U-42", city: "شیراز" },
  ];
  function history(mode = "recent", looked = false, caller = "U-17") {
    const own = records.filter((r) => r.owner === caller);
    if (mode === "recent" && caller === "U-17")
      return { status: "context", matches: own.filter((r) => r.id === "124") };
    if (!looked) return { status: "lookup", matches: [] };
    const matches = own.filter((r) =>
      mode === "missing" ? r.city === "مشهد" : true,
    );
    return {
      status:
        matches.length === 1
          ? "resolved"
          : matches.length
            ? "clarify"
            : "not_found",
      matches,
    };
  }
  const weightGB = (bits) => (27e9 * bits) / 8 / 1e9;
  function isPeak(day, hour, holiday = false) {
    return (
      !holiday &&
      day >= 1 &&
      day <= 5 &&
      ((hour >= 1 && hour < 4) || (hour >= 6 && hour < 10))
    );
  }
  const prices = (contributor = false) =>
    contributor
      ? { input: 0.1, output: 0.2, cached: 0.002 }
      : { input: 1.25, output: 4.25, cached: 0.15 };
  const integrationCount = (m, n, standard) => (standard ? m + n : m * n);
  const loopFrames = [
    {
      at: "user",
      title: "خواستهٔ سارا",
      text: "پنجشنبه مشهد باشم؛ بلیت و هتل را هماهنگ کن.",
      tag: "یک سفر",
    },
    {
      at: "model",
      title: "نوبتِ اولِ مدل",
      text: "جستجوی قطارِ تهران به مشهد، پنجشنبه.",
      tag: "درخواستِ ابزار ۱",
    },
    {
      at: "tools",
      title: "هارنس ابزار را اجرا کرد",
      text: "دو قطار: رسیدن ۱۵ یا ۱۷؛ هر دو پیش از جلسه.",
      tag: "نتیجهٔ جستجوی قطار",
    },
    {
      at: "model",
      title: "نتیجه، دوباره به همان مدل رسید",
      text: "قطارِ ساعت ۱۵ مناسب است. حالا هتلِ همان شب را بررسی کن.",
      tag: "نوبتِ دومِ مدل",
    },
    {
      at: "model",
      title: "یک ابزارِ دیگر لازم است",
      text: "جستجوی هتل برای یک نفر، یک شب، در بودجهٔ سفر.",
      tag: "درخواستِ ابزار ۲",
    },
    {
      at: "tools",
      title: "اجرای جستجوی هتل",
      text: "هتلِ نمونه موجود است؛ بلیت و هتل در مجموع ۶٫۲ میلیون.",
      tag: "نتیجهٔ جستجوی هتل",
    },
    {
      at: "model",
      title: "مدل، نتیجهٔ دوم را هم می‌گیرد",
      text: "قطار و هتل سازگارند؛ کلِ مبلغ ۶٫۲ میلیون است.",
      tag: "نوبتِ سومِ مدل",
    },
    {
      at: "model",
      title: "پیشنهادِ رزرو",
      text: "همین بلیت و هتل را با مبلغِ ۶٫۲ میلیون رزرو کن.",
      tag: "هنوز خرید نشده",
    },
    {
      at: "harness",
      title: "توقف برای تأییدِ مستقل",
      text: "سارا باید همین برنامه و همین مبلغ را در برنامه تأیید کند.",
      tag: "منتظر اجازه",
    },
    {
      at: "tools",
      title: "اجرای مجازِ رزرو",
      text: "مجوز بررسی و مصرف شد. رزرو ۱۲۴، یک‌بار ثبت شد.",
      tag: "خریدِ نمونه",
    },
    {
      at: "model",
      title: "نتیجهٔ رزرو، دوباره به مدل می‌رسد",
      text: "رزرو ۱۲۴ صادر شده؛ فایلِ بلیت و واچر آماده است.",
      tag: "نوبتِ چهارمِ مدل",
    },
    {
      at: "user",
      title: "پایانِ این کار",
      text: "سارا نتیجه و مدارک را می‌گیرد؛ ابزارِ دیگری لازم نیست.",
      tag: "پاسخِ نهایی",
    },
  ];
  function hasTravelGrant(state) {
    return (
      state.grant?.amount === 6200000 &&
      state.grant?.plan === "trip-a" &&
      (state.plan ?? "trip-a") === "trip-a" &&
      (state.amount ?? 6200000) === 6200000 &&
      !state.booked
    );
  }
  function canAdvance(s, step, state = {}) {
    return s.kind !== "agent-cycle" || step !== 8 || hasTravelGrant(state);
  }
  function enter(s, step, state = {}) {
    const n = { ...state };
    if (s.kind !== "agent-cycle") return n;
    if (step === 2) n.trainSearched = true;
    if (step === 5) n.hotelSearched = true;
    if (step === 9) {
      if (!hasTravelGrant(n)) throw new Error("No matching travel approval");
      n.booked = true;
      n.bookingCount = 1;
      n.grant = null;
    }
    return n;
  }
  function frameCount(s) {
    if (s.kind === "relay") return s.frames.length;
    if (s.kind === "agent-cycle") return loopFrames.length;
    return (
      {
        "production-method": 6,
        "translation-workflow": 4,
        "research-workflow": 4,
        "assistant-chain": 5,
        "political-change": 3,
        "professional-gate": 3,
        "magic-ingredients": 4,
        "build-analogy": 3,
        "career-timeline": 3,
        "general-agent": 4,
        "specialized-producer": 3,
        "private-route": 3,
      }[s.kind] || 0
    );
  }
  function relay(s, step) {
    const a = s.frames[Math.min(step, s.frames.length - 1)];
    return `<div class="j-relay"><div class="j-relay-rail"><svg viewBox="0 0 1200 100" aria-hidden="true"><defs><marker id="jr-arrow-${s.id}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#2159dd"/></marker></defs><path d="M1030 50H170" class="j-wire" marker-end="url(#jr-arrow-${s.id})"/><path d="M170 76H1030" class="j-return"/></svg>${s.actors.map((t, i) => `<div class="j-actor ${a.at === i ? "active" : ""}">${I(["model", "tool", "cloud"][i])}<strong>${E(t)}</strong></div>`).join("")}</div><div class="j-relay-event ${E(a.tone)}"><div>${badge(a.tag, a.tone)}<h3>${E(a.label)}</h3></div><p>${E(a.text)}</p></div>${steps(
      s.frames.map((f) => f.label),
      step,
    )}</div>`;
  }
  const productTypes = [
    ["website", "سایت", "web", "یک صفحهٔ رزروِ قابل استفاده"],
    ["book", "ترجمهٔ کتاب", "book", "فصل‌های ترجمه و بازبینی‌شده"],
    ["research", "گزارشِ پژوهش", "chart", "استدلال و شواهدِ قابل پیگیری"],
    ["agent", "ایجنت", "model", "خدمتِ سفرِ قابل اجرا"],
  ];
  const environments = [
    [
      "Claude Code",
      "terminal",
      "پروژه را می‌خواند، فایل ویرایش می‌کند و دستور اجرا می‌کند.",
    ],
    ["Cursor", "editor", "دستیار کنارِ فایل‌ها و ویرایشگرِ پروژه کار می‌کند."],
    [
      "Codex",
      "terminal",
      "فایل‌ها را بررسی و تغییر می‌دهد و ابزارهای توسعه را اجرا می‌کند.",
    ],
    ["OpenCode", "terminal", "محیطِ کار با مدل، فایل‌ها و ابزارهای پروژه."],
    [
      "Antigravity",
      "editor",
      "محیطِ کارِ ایجنت با فایل‌ها، ابزارها و نتیجه‌های قابل بررسی.",
    ],
  ];
  const quality = {
    website: {
      name: "سایت",
      icon: "web",
      input: "شرط: کاربر بتواند بلیتِ خودش را بگیرد.",
      bad: "دکمهٔ «دریافت بلیت» به صفحهٔ خالی می‌رود.",
      check: "مسیر را در مرورگر باز و دریافتِ فایل را امتحان کن.",
      good: "فایلِ بلیتِ همان کاربر از همان مسیر دریافت می‌شود.",
    },
    book: {
      name: "ترجمه",
      icon: "book",
      input: "The meeting was moved to Friday.",
      bad: "جلسه به پنجشنبه منتقل شد.",
      check: "روزِ هفته را با اصل مقایسه کن: Friday = جمعه.",
      good: "جلسه به جمعه منتقل شد.",
    },
    research: {
      name: "پژوهش",
      icon: "chart",
      input: "دادهٔ نمونه: ۲۰ مورد از ۵۰ مورد موفق بودند.",
      bad: "نتیجه: ۶۰ درصد موفقیت.",
      check: "محاسبه را دوباره انجام بده: ۲۰ ÷ ۵۰ = ۰٫۴.",
      good: "نتیجه: ۴۰ درصد موفقیت؛ فقط برای همین نمونه.",
    },
    agent: {
      name: "ایجنت",
      icon: "model",
      input: "شرط: تکرارِ همان درخواست، خریدِ دوم نسازد.",
      bad: "دو بار ارسالِ R-124، دو رزرو ساخته است.",
      check: "آزمون را روی رکوردهای واقعاً ساخته‌شده اجرا کن.",
      good: "تکرارِ R-124 همان رزروِ قبلی را برمی‌گرداند.",
    },
  };
  function layout(s, content, step, state) {
    const n = frameCount(s),
      gate = !canAdvance(s, step, state);
    return `<div class="story-root j-root" data-story-kind="${E(s.kind)}"><div class="story-visual j-visual">${content}</div>${n ? `<div class="story-sequence j-sequence"><span dir="ltr">${F(step + 1)} / ${F(n)}</span><button data-story="next" ${gate ? "disabled" : ""}>${gate ? "منتظر تأییدِ سارا" : "گام بعد ←"}</button>${B("reset", "از ابتدا")}</div>` : ""}<div class="story-point">${E(s.point)}</div></div>`;
  }
  function render(s, step = 0, state = {}) {
    let h = "";
    switch (s.kind) {
      case "relay":
        h = relay(s, step);
        break;
      case "benchmark-score": {
        const answers = state.bench ?? [true, false, true],
          total = answers.filter(Boolean).length;
        h = `<div class="j-score-lab"><div>${["گزینه در بودجه است؟", "قبل از جلسه می‌رسد؟", "موجودی با شاهد گفته شده؟"].map((t, i) => `<button data-story="bench-${i}" class="j-test-row ${answers[i] ? "pass" : "fail"}"><b>${answers[i] ? "✓" : "×"}</b><span>${t}</span><small>نتیجه را عوض کن</small></button>`).join("")}</div><div class="j-score-dial" style="--score:${(total / 3) * 360}deg"><div><strong>${F(total)} / ۳</strong><span>${F(((total / 3) * 100).toFixed(1))}٪</span></div></div></div><p class="j-caption">سه بررسیِ آموزشی، با نتیجه‌های قابل تغییر؛ این امتیاز مربوط به هیچ مدل یا بنچمارکِ واقعی نیست.</p>`;
        break;
      }
      case "benchmark-tour": {
        let n = state.benchmark ?? 0;
        const data = [
          [
            "SWE-bench Verified",
            "در یک پروژهٔ واقعی، مسئلهٔ گزارش‌شده را برطرف کن.",
            "بررسی: کدام مسئله‌ها حل شده‌اند؟",
            "folder",
          ],
          [
            "Terminal-Bench",
            "یک کارِ عملی را با ابزارهای ترمینال به پایان برسان.",
            "بررسی: نتیجهٔ نهاییِ کار درست است؟",
            "tool",
          ],
          [
            "Artificial Analysis",
            "چند ارزیابی در حوزه‌های مختلف را کنار هم بخوان.",
            "خروجی: شاخصِ ترکیبی، همراه با روش و نسخهٔ آن",
            "chart",
          ],
        ][n];
        h = `${actions(["SWE-bench", "Terminal-Bench", "Artificial Analysis"].map((t, i) => B("benchmark-" + i, t, i === n ? "selected" : "secondary")).join(""))}<div class="j-benchmark">${I(data[3])}<div><h3 dir="ltr">${data[0]}</h3><p>${data[1]}</p>${badge(data[2])}</div><div class="j-mini-chart">${[38, 67, 52, 82].map((v, i) => `<i style="height:${v}%"><span>${"ABCD"[i]}</span></i>`).join("")}<small>شمای مقایسه؛ بدون نمرهٔ واقعی</small></div></div>`;
        break;
      }
      case "contributor": {
        const yes = !!state.contributor,
          p = prices(yes);
        h = `<div class="j-two"><div class="j-policy-switch ${yes ? "sharing" : ""}">${I(yes ? "book" : "lock")}<h3 dir="ltr">${yes ? "Contributor" : "Standard"}</h3><p>${yes ? "اجازهٔ استفاده از محتوا و پاسخ‌ها برای آموزشِ مدل‌های بعدی" : "محتوای ارسالی برای آموزشِ مدل‌های Meta استفاده نمی‌شود."}</p>${B("contributor", yes ? "نمایشِ Standard" : "نمایشِ Contributor")}</div><div class="j-price-readout"><small>Muse Spark 1.3 · USD / 1M tokens</small>${[
          ["ورودی", p.input],
          ["خروجی", p.output],
          ["ورودیِ کش‌شده", p.cached],
        ]
          .map(
            ([t, v]) =>
              `<div><span>${t}</span><strong dir="ltr">$${v.toFixed(v < 0.01 ? 3 : 2)}</strong></div>`,
          )
          .join("")}</div></div>`;
        break;
      }
      case "local-weights": {
        const bits = state.bits ?? 4;
        h = `<div class="j-local-weights"><div class="j-weight-block">${I("model")}<strong dir="ltr">Qwen3.8-27B</strong><span>وزن‌های قابل دریافت</span><div class="j-weight-cells">${"<i></i>".repeat(30)}</div></div><span class="j-transfer-arrow">←</span><div class="j-laptop"><div>${I("folder")}<strong dir="ltr">${weightGB(bits).toFixed(1)} GB</strong><span>فقط بیت‌های وزن‌ها</span></div><i></i></div></div>${actions([4, 8, 16].map((b) => B("bits-" + b, F(b) + " بیت برای هر وزن", b === bits ? "selected" : "secondary")).join(""))}<p class="j-caption" dir="ltr">27 × 10⁹ × ${bits} ÷ 8 = ${weightGB(bits).toFixed(1)} × 10⁹ bytes</p>`;
        break;
      }
      case "peak-pricing": {
        const sample = state.time ?? 0,
          slots = [
            ["دوشنبه، ساعت ۰۲ UTC", 1, 2],
            ["دوشنبه، ساعت ۱۲ UTC", 1, 12],
            ["شنبه، ساعت ۰۲ UTC", 6, 2],
          ],
          a = slots[sample],
          peak = isPeak(a[1], a[2]);
        h = `<div class="j-two"><div class="j-clock ${peak ? "peak" : ""}"><svg viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="103"/><path d="M120 120V50M120 120L${120 + 64 * Math.sin((a[2] / 12) * Math.PI * 2)} ${120 - 64 * Math.cos((a[2] / 12) * Math.PI * 2)}"/><circle cx="120" cy="120" r="7"/></svg><strong>${a[0]}</strong>${badge(peak ? "زمانِ اوج" : "خارج از اوج", peak ? "warm" : "ok")}</div><div class="j-price-readout"><small>DeepSeek V4.1 Flash · USD / 1M tokens</small><div><span>ورودیِ بی‌کش</span><strong dir="ltr">$${peak ? "0.30" : "0.15"}</strong></div><div><span>خروجی</span><strong dir="ltr">$${peak ? "1.20" : "0.60"}</strong></div><p>خارج از اوج، نصفِ نرخِ اوج</p></div></div>${actions(slots.map((x, i) => B("time-" + i, x[0], i === sample ? "selected" : "secondary")).join(""))}`;
        break;
      }
      case "harness-map":
        h = `<div class="j-harness-shell"><span class="j-shell-label">هارنس: برنامهٔ اطرافِ مدل</span><div class="j-harness-route">${card("پیامِ سارا", "«بلیت و هتل را هماهنگ کن.»", "person")}<span>←</span>${card("مدل", "پاسخ یا درخواستِ ابزار", "model")}<span>↔</span>${card("ابزارها", "جستجو، رزرو و دریافتِ فایل", "tool")}</div><div class="j-shell-tasks"><span>آماده‌کردنِ ورودی</span><span>اجرای کارِ مجاز</span><span>برگرداندنِ نتیجه</span></div></div>`;
        break;
      case "cutoff-timeline":
        h = `<div class="j-cutoff"><div class="j-trained">${I("book")}<h3>داده‌های آموزش</h3><span>اطلاعاتِ گذشته</span></div><div class="j-cutoff-line"><i></i><b>تاریخِ قطعِ دانش</b></div><div class="j-today">${I("search")}<h3>پرسشِ امروز</h3><span>قطارِ پنجشنبه چقدر جا دارد؟</span>${state.fresh ? badge("نتیجهٔ جستجوی تازه به ورودی اضافه شد", "ok") : badge("این موجودی، داخلِ وزن‌ها نیست")}</div></div>${actions(B("fresh", state.fresh ? "حذفِ اطلاعاتِ تازه" : "اطلاعاتِ تازه را کنارِ سؤال بگذار"))}`;
        break;
      case "search-services": {
        const n = state.provider ?? 0,
          data = [
            ["Tavily", "جستجوی وب و استخراجِ محتوا برای برنامه‌های ایجنت"],
            ["Parallel", "ابزارهای جستجو و استخراج؛ همراه با APIهای پژوهشِ وب"],
            ["Exa", "جستجوی وب و دریافتِ محتوای نتیجه‌ها"],
          ];
        h = `<div class="j-provider-tabs">${data.map(([t, v], i) => `<button data-story="provider-${i}" class="${i === n ? "selected" : ""}">${I("search")}<strong dir="ltr">${t}</strong><span>${v}</span></button>`).join("")}</div><div class="j-search-return"><code dir="ltr">search("مقررات بازپرداخت بلیت قطار")</code><span>← ${E(data[n][0])} ←</span><div>${I("file")}<b>نشانیِ منبع + متنِ مرتبط</b><small>شمای نتیجه؛ درخواستِ واقعی ارسال نمی‌شود.</small></div></div>`;
        break;
      }
      case "tool-dispatch": {
        const tool = state.dispatch ?? true;
        h = `<div class="j-dispatch"><div class="j-model-core">${I("model")}<strong>خروجیِ مدل</strong></div><div class="j-branches"><div class="${!tool ? "active" : ""}">${I("person")}<h3>پاسخ به کاربر</h3><p>برای این سؤال، پاسخ آماده است.</p></div><div class="${tool ? "active" : ""}">${I("tool")}<h3>درخواستِ ابزار</h3><code dir="ltr">search_trips(origin, destination, day)</code><p>هارنس باید آن را بررسی و اجرا کند.</p></div></div></div>${actions(B("dispatch", tool ? "این بار، پاسخِ نهایی" : "این بار، درخواستِ ابزار"))}`;
        break;
      }
      case "tool-form": {
        const valid = state.valid ?? true;
        h = `<div class="j-two"><div class="j-form"><strong dir="ltr">search_trips</strong><small>جستجوی قطار در مسیر و روزِ مشخص</small>${[
          ["مبدأ", "تهران"],
          ["مقصد", "مشهد"],
          ["روز", valid ? "پنجشنبه" : "خالی"],
        ]
          .map(
            ([k, v]) =>
              `<div class="${v === "خالی" ? "missing" : ""}"><label>${k}</label><b>${v}</b></div>`,
          )
          .join(
            "",
          )}</div><div class="j-form-check">${I(valid ? "check" : "lock")}<h3>${valid ? "ورودی کامل است" : "روزِ سفر مشخص نیست"}</h3><p>${valid ? "بعد از بررسیِ دسترسی، برنامه می‌تواند جستجو را اجرا کند." : "ابزار اجرا نمی‌شود؛ روز را از کاربر می‌پرسیم."}</p>${B("valid", valid ? "حذفِ روز از درخواست" : "روز را کامل کن")}</div></div>`;
        break;
      }
      case "tool-shelf":
      case "history-tools": {
        const index = state.tool ?? 0;
        const data =
          s.kind === "history-tools"
            ? [
                [
                  "جستجوی پیام‌های قبلی",
                  "book",
                  "پیامِ مرتبط با سفرِ مشهد را برگردان.",
                  "بخشی از گفتگو؛ فقط پیام‌های مجاز",
                ],
                [
                  "رزروهای من",
                  "file",
                  "رزروِ صادرشدهٔ خودِ کاربر را برگردان.",
                  "رکوردِ سامانه؛ بلیت و وضعیتِ قطعی",
                ],
              ]
            : [
                [
                  "جستجوی وب",
                  "search",
                  "پیداکردنِ اطلاعاتِ عمومیِ تازه",
                  "خواندن",
                ],
                ["جستجوی سند", "book", "پیداکردنِ بندِ آیین‌نامه", "خواندن"],
                ["رزروهای من", "file", "خواندنِ رزروهای همین حساب", "خواندن"],
                [
                  "ثبتِ رزرو",
                  "stamp",
                  "تغییرِ وضعیتِ سامانه پس از مجوز",
                  "اقدام",
                ],
              ];
        h = `<div class="j-tool-shelf">${data.map(([t, i], n) => `<button data-story="tool-${n}" class="${n === index ? "selected" : ""}">${I(i)}<strong>${t}</strong></button>`).join("")}</div>${surface("ابزارِ انتخاب‌شده", `<h3>${data[index][0]}</h3><p>${data[index][2]}</p>${badge(data[index][3], data[index][3] === "اقدام" ? "warm" : "")}`)}`;
        break;
      }
      case "document-question":
        h = `<div class="j-doc-question">${surface("سؤالِ سارا", `<p>هتلِ شبی <b>۳٫۴ میلیون</b> بازپرداخت می‌شود؟</p>`, "j-chat-sheet")}<span class="j-transfer-arrow">←</span><div class="j-doc-stack"><div></div><div></div><article>${I("book")}<h3>آیین‌نامهٔ سفرِ شرکت</h3><p>هزینهٔ هتل<br>سقفِ بازپرداخت<br>تأییدِ مبلغِ بیشتر</p></article></div></div>`;
        break;
      case "context-packet": {
        const selected = state.selected ?? [
            "instructions",
            "messages",
            "tools",
          ],
          parts = packet(selected);
        h = `<div class="j-packet-lab"><div class="j-packet-source">${packetParts.map((p) => `<button data-story="packet-${p.id}" class="${selected.includes(p.id) ? "selected" : ""}"><span>${selected.includes(p.id) ? "✓" : "+"}</span><strong>${p.title}</strong></button>`).join("")}</div><div class="j-packet"><div class="j-packet-heading">${I("folder")}<strong>ورودیِ این نوبتِ مدل</strong>${badge(F(parts.length) + " بخش")}</div>${parts.map((p) => `<div class="j-packet-part" data-packet-part="${p.id}"><b>${E(p.title)}</b><span>${E(p.text)}</span></div>`).join("")}</div></div>`;
        break;
      }
      case "context-stores": {
        const n = state.store ?? 0;
        h = `<div class="j-three-stores">${[
          [
            "سابقهٔ گفتگو",
            "book",
            "پیام‌های قبلیِ مجاز",
            "ذخیره‌شده در برنامه",
          ],
          [
            "زمینهٔ این نوبت",
            "folder",
            "پیامِ تازه + اطلاعاتِ انتخاب‌شده",
            "ارسال به مدل",
          ],
          ["رزروِ ثبت‌شده", "file", "بلیتِ صادرشدهٔ ۱۲۴", "مرجعِ وضعیتِ سفر"],
        ]
          .map(
            ([t, i, a, b], k) =>
              `<button data-story="store-${k}" class="${n === k ? "selected" : ""}">${I(i)}<h3>${t}</h3><strong>${a}</strong><span>${b}</span><div class="j-drawer"></div></button>`,
          )
          .join(
            "",
          )}</div><div class="j-store-caption">${["هر پیامِ ذخیره‌شده، لزوماً در ورودیِ فعلی نیست.", "هارنس، اطلاعاتِ لازم و مجاز را برای این نوبت انتخاب می‌کند.", "وضعیتِ خرید از سامانه خوانده می‌شود؛ بستنِ چت آن را پاک نمی‌کند."][n]}</div>`;
        break;
      }
      case "history-lookup": {
        const mode = state.history ?? "recent",
          r = history(mode, !!state.looked),
          texts = {
            recent: "برگشت را عوض کن. — پیامِ قبلی: رزروِ ۱۲۴، مشهد",
            missing:
              "برگشتِ سفرِ مشهدِ ماهِ قبل را عوض کن. — سابقه در زمینه نیست",
            ambiguous: "سفرِ قبلی را عوض کن. — چند سفرِ قبلی داریم",
          };
        h = `${actions(
          [
            ["recent", "سابقه در زمینه است"],
            ["missing", "سابقه را باید پیدا کنیم"],
            ["ambiguous", "چند سفر پیدا می‌شود"],
          ]
            .map(([k, t]) =>
              B("history-" + k, t, k === mode ? "selected" : "secondary"),
            )
            .join(""),
        )}<div class="j-history-lab">${surface("پیام و زمینه", `<p>${texts[mode]}</p>${r.status === "lookup" ? B("history-lookup", "ابزارِ جستجوی رزروهای من را اجرا کن") : badge(r.status === "context" ? "از زمینه مشخص شد" : "نتیجهٔ ابزار")}`)}${surface("نتیجهٔ تصمیم", `<div class="j-records">${r.matches.map((x) => `<div data-history-record="${x.id}">${I("file")}<b>${F(x.id)} · ${x.city}</b></div>`).join("")}</div><p>${{ context: "بدون جستجوی دوباره، منظور رزروِ ۱۲۴ است.", lookup: "اطلاعات کافی نیست؛ ابزارِ مجاز را صدا می‌زنیم.", resolved: "یک رزروِ مرتبط پیدا شد؛ ادامهٔ کار برای همان رزرو.", clarify: "چند رزرو داریم؛ از سارا می‌پرسیم کدام سفر؟", not_found: "رزروِ مرتبطی پیدا نشد؛ از سارا اطلاعاتِ روشن‌تری می‌خواهیم." }[r.status]}</p>`, "j-history-result")}</div>`;
        break;
      }
      case "agent-cycle": {
        const a = loopFrames[step],
          active = a.at;
        h = `<div class="j-cycle" data-cycle-step="${step}"><div class="j-cycle-map"><svg viewBox="0 0 760 340" aria-label="حلقهٔ بازگشت نتیجهٔ ابزار به همان مدل"><defs><marker id="cycle-arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="#2159dd"/></marker></defs><path d="M647 90H445" class="j-cycle-user" marker-end="url(#cycle-arrow)"/><path d="M335 157V235H80V157" class="j-cycle-go" marker-end="url(#cycle-arrow)"/><path d="M135 157V285H415V157" class="j-cycle-back" marker-end="url(#cycle-arrow)"/><text x="285" y="220">اجرای ابزار</text><text x="285" y="317">نتیجه → ورودیِ بعدیِ همان مدل</text></svg><div class="j-cycle-user-node ${active === "user" ? "active" : ""}">${I("person")}<strong>سارا</strong></div><div class="j-cycle-model ${active === "model" ? "active" : ""}">${I("model")}<strong>همان مدل</strong><span>نوبت ${F(step >= 10 ? 4 : step >= 6 ? 3 : step >= 3 ? 2 : 1)}</span></div><div class="j-cycle-tool ${active === "tools" ? "active" : ""}">${I("tool")}<strong>ابزارها</strong><span>قطار · هتل · رزرو</span></div><div class="j-cycle-harness ${active === "harness" ? "active" : ""}">هارنس، ارسال و اجرا را اداره می‌کند.</div></div><div class="j-cycle-event">${badge(a.tag, step === 8 ? "warm" : step === 11 ? "ok" : "")}<h3>${a.title}</h3><p>${a.text}</p>${step === 8 ? (state.grant ? result("سارا همین پیشنهادِ ۶٫۲ میلیونی را تأیید کرد.", "ok") : B("cycle-approve", "تأییدِ سارا: همین سفر، ۶٫۲ میلیون")) : ""}<div class="j-cycle-ledger"><span class="${state.trainSearched ? "done" : ""}">قطار ${state.trainSearched ? "✓" : "○"}</span><span class="${state.hotelSearched ? "done" : ""}">هتل ${state.hotelSearched ? "✓" : "○"}</span><span class="${state.booked ? "done" : ""}" data-cycle-bookings="${state.bookingCount ?? 0}">رزرو ${state.booked ? "✓" : "○"}</span></div></div></div>`;
        break;
      }
      case "stop-states": {
        const n = state.stop ?? 0;
        h = `<div class="j-stop-source">${I("model")}<b>قدمِ بعد چیست؟</b></div><div class="j-stop-options">${[
          ["پاسخِ آماده", "بلیت و مدارک را تحویل بده.", "check"],
          ["اطلاعاتِ ناکافی", "از سارا بپرس: کدام سفر؟", "person"],
          ["توقفِ برنامه", "مجوز یا بودجهٔ اجرا کافی نیست.", "lock"],
        ]
          .map(
            ([t, v, i], k) =>
              `<button data-story="stop-${k}" class="${k === n ? "selected" : ""}">${I(i)}<h3>${t}</h3><span>${v}</span></button>`,
          )
          .join("")}</div>`;
        break;
      }
      case "action-policies":
        h = `<div class="j-policy-paths">${[
          ["پیش‌نویس", "مستقیم بساز؛ قابل ویرایش است.", "file"],
          [
            "تغییرِ کوچک",
            "در گفتگو بپرس؛ این به رفتارِ مدل وابسته است.",
            "person",
          ],
          ["خرید", "تأییدِ مستقل را برنامه بررسی کند.", "lock"],
        ]
          .map(
            ([t, v, i], k) =>
              `<div>${I(i)}<b>${F(k + 1)}</b><h3>${t}</h3><p>${v}</p><div class="j-policy-route">${k === 2 ? "مدل ← دروازهٔ مجوز ← ابزار" : "مدل ← ابزار"}</div></div>`,
          )
          .join("")}</div>`;
        break;
      case "amount-binding": {
        const amount = state.amount ?? 6200000,
          allowed = amount === 6200000;
        h = `<div class="j-two"><div class="j-money-paper">${I("stamp")}<small>تأییدِ ثبت‌شدهٔ سارا</small><strong>۶٫۲ میلیون</strong><span>بلیت و هتلِ همان پیشنهاد</span></div><div class="j-money-paper ${!allowed ? "changed" : ""}">${I("file")}<small>درخواستِ اجرای فعلی</small><strong>${amount === 6200000 ? "۶٫۲" : "۷٫۴"} میلیون</strong>${B("change-amount", "مبلغِ درخواست را عوض کن")}</div></div>${result(allowed ? "مبلغ منطبق است؛ سایر شرط‌ها هم باید برقرار باشند." : "مبلغ تغییر کرده است؛ این تأیید برای خریدِ جدید معتبر نیست.", allowed ? "ok" : "blocked")}`;
        break;
      }
      case "private-route": {
        const texts = [
          "سارا شماره را در فرمِ خصوصی وارد می‌کند؛ برنامه آن را نگه می‌دارد.",
          "مدل فقط ارجاعِ h_phone_7f2a را می‌بیند؛ خودِ شماره در زمینه نیست.",
          "برنامه مالک و مقصد را بررسی می‌کند؛ شماره فقط به سامانهٔ صدور می‌رود.",
        ];
        h = `<div class="j-private-route"><div class="${step === 0 ? "active" : ""}">${I("phone")}<h3>ورودیِ خصوصی</h3><span>سارا → برنامه</span></div><div class="j-private-vault ${step === 1 ? "active" : ""}">${I("lock")}<h3>خزانهٔ داده</h3><code dir="ltr">h_phone_7f2a</code><small>مدل: فقط همین ارجاع</small></div><div class="${step === 2 ? "active" : ""}">${I("cloud")}<h3>سامانهٔ صدور</h3><span>فقط پس از بررسیِ مجوز</span></div></div>${surface("در این گام", `<p>${texts[step]}</p>`)}`;
        break;
      }
      case "user-response": {
        const good = !!state.clean;
        h = `<div class="j-two"><div class="j-receipt-image"><span>رسیدِ پرداخت</span><div class="j-blurred">مبلغ: ؟؟؟</div><small>تصویرِ نمونه؛ مبلغ خوانا نیست.</small></div>${surface("پاسخ به کاربر", `<p>${good ? "مبلغِ رسید خوانا نیست؛ لطفاً تصویرِ واضح‌تری بفرستید." : "طبق قاعدهٔ داخلی شمارهٔ ۷ و محدودیتِ OCR، این ورودی رد شد."}</p>${B("clean", good ? "نمایشِ پاسخِ نامناسب" : "پاسخ را برای کاربر روشن کن")}`, "j-chat-sheet")}</div>`;
        break;
      }
      case "outage-message":
        h = `<div class="j-outage-phone"><div>${I("phone")}<div class="j-mobile-bubble">گفت‌وگوی هوشمند موقتاً در دسترس نیست.</div><div class="j-mobile-bubble good">بلیتِ صادرشده را از «بلیت‌های من» بگیرید.</div>${B("ticket-view", state.ticket ? "پنهان‌کردنِ بلیتِ نمونه" : "بلیت‌های من")}${state.ticket ? '<div class="j-mini-ticket">رزرو ۱۲۴ · صادرشده ✓</div>' : ""}</div><aside>${I("check")}<h3>چه چیزی در دسترس است؟</h3><p>بلیتِ صادرشده از همان حساب و همان سامانه.</p></aside></div>`;
        break;
      case "product-factory": {
        const n = state.product ?? 0,
          t = productTypes[n];
        h = `${actions(productTypes.map(([k, title], i) => B("product-" + i, title, n === i ? "selected" : "secondary")).join(""))}<div class="j-factory-route">${card("خواستهٔ ما", E(t[3]), t[2])}<span>←</span><div class="j-producer-machine">${I("model")}<b>ایجنتِ تولیدکننده</b><div>فایل + ابزار + روشِ کار</div><div class="j-machine-dots">•••</div></div><span>←</span><div class="j-produced ${t[0]}">${I(t[2])}<strong>${t[1]}</strong><span>خروجیِ قابل بررسی</span></div></div>`;
        break;
      }
      case "producer-product":
        h = `<div class="j-three">${card("سازنده", "ایجنتی که متن، فایل و ابزارها را به کار می‌گیرد.", "model")}${card("روشِ کار", "تقسیمِ کار، بررسیِ هر بخش، اصلاح و یکپارچه‌سازی", "check")}${card("محصول", "کتاب، سایت، گزارش یا برنامهٔ ایجنتِ دیگر", "book")}</div><div class="j-product-equation">ایجنتِ مترجم + روشِ ترجمه و بازبینی ← کتابِ ترجمه‌شده</div>`;
        break;
      case "production-method": {
        const labels = [
          "تعریفِ نتیجه",
          "طرحِ کار",
          "یک بخش",
          "بررسی و اصلاح",
          "گسترش",
          "بررسیِ کل",
        ];
        const texts = [
          "چه چیزی باید تحویل بگیریم و از کجا بفهمیم درست است؟",
          "کارِ بزرگ را به خروجی‌های مرتبط و قابل بررسی تقسیم کن.",
          "یک بخشِ کامل بساز؛ مثلاً یک فصل یا یک مسیرِ سایت.",
          "همان بخش را بخوان، ببین یا بیازما؛ خطا را اصلاح کن.",
          "پس از روشن‌شدنِ روش، بخش‌های بعد را با همان معیار بساز.",
          "بخش‌ها را یکپارچه کن و خودِ محصولِ نهایی را بررسی کن.",
        ];
        h = `<div class="j-method">${labels.map((t, i) => `<div class="${i === step ? "active" : i < step ? "done" : ""}"><b>${F(i + 1)}</b>${I(["file", "folder", "web", "check", "book", "check"][i])}<strong>${t}</strong></div>`).join("")}</div>${surface(labels[step], `<p>${texts[step]}</p>`)}`;
        break;
      }
      case "quality-lab": {
        const k = state.quality ?? "book",
          phase = state.phase ?? 0,
          q = quality[k];
        h = `${actions(
          Object.entries(quality)
            .map(([id, v]) =>
              B("quality-" + id, v.name, k === id ? "selected" : "secondary"),
            )
            .join(""),
        )}<div class="j-quality"><div class="j-quality-original">${I(q.icon)}<small>ورودی یا شرطِ کار</small><p dir="auto">${q.input}</p></div><div class="j-quality-output ${phase === 2 ? "correct" : ""}"><small>${["خروجیِ اولیه", "بررسیِ خروجی", "خروجیِ اصلاح‌شده"][phase]}</small><p>${phase === 2 ? q.good : q.bad}</p>${phase === 1 ? `<div class="j-review-note">${q.check}</div>` : ""}</div></div>${actions(B("quality-phase", phase === 2 ? "دوباره از خروجیِ اولیه" : "گام بعد: " + (phase === 0 ? "بررسی" : "اصلاح")))}${steps(["تولید", "بررسی", "اصلاح"], phase)}`;
        break;
      }
      case "translation-workflow": {
        const items = [
          "واژه‌نامه و لحن",
          "یک فصلِ نمونه",
          "مقایسه با اصل",
          "گسترش و یکدستی",
        ];
        h = `<div class="j-book-work"><div class="j-open-book"><article><small>متنِ اصلی</small><p dir="ltr">The meeting was moved to Friday.</p><span dir="ltr">meeting → جلسه<br>Friday → جمعه</span></article><article class="${step >= 2 ? "reviewed" : ""}"><small>ترجمهٔ بررسی‌شده</small><p>جلسه به جمعه منتقل شد.</p>${step >= 2 ? badge("مقایسهٔ معنا و روزِ هفته", "ok") : badge("نمونه را با اصل بخوانیم")}</article></div><div class="j-chapters">${Array.from({ length: 6 }, (_, i) => `<div class="${step >= 3 || i === 0 ? "ready" : ""}">فصل ${F(i + 1)}</div>`).join("")}</div></div>${steps(items, step)}`;
        break;
      }
      case "research-workflow": {
        const items = [
          ["سؤال", "در این نمونه، چند درصد موفق بودند؟"],
          ["شواهد", "دادهٔ داده‌شده: ۲۰ مورد از ۵۰ مورد"],
          ["بررسی", "۲۰ ÷ ۵۰ = ۰٫۴؛ خطای محاسبه را پیدا کن."],
          ["نتیجه", "۴۰٪ در همین نمونه؛ تعمیمِ بیشتر، شاهدِ بیشتر لازم دارد."],
        ];
        h = `<div class="j-evidence-chain">${items.map(([t, v], i) => `<div class="${i === step ? "active" : i < step ? "done" : ""}">${I(["search", "file", "check", "chart"][i])}<strong>${t}</strong><p>${i <= step ? v : "…"}</p></div>`).join("")}</div><p class="j-caption">اعداد و موضوع، نمونهٔ آموزشیِ ساخته‌شده‌اند؛ این صفحه گزارشِ یک پژوهشِ واقعی نیست.</p>`;
        break;
      }
      case "production-choices":
        h = `<div class="j-three">${s.choices.map((c) => card(c.title, c.text, c.icon)).join("")}</div><div class="j-choice-example">یک محصول، سه روشِ ساخت؛ مثلاً ترجمهٔ کتاب با ابزارهای عمومی، دستیار کدنویسی یا هارنس اختصاصی ترجمه</div>`;
        break;
      case "general-agent": {
        h = `<div class="j-general-agent"><div class="j-agent-console"><small>ایجنت عمومی · مثال آموزشی</small><strong dir="ltr">Hermes</strong><p>${["هدف: برای خرید یک وسیله، گزینه‌ها را با بودجه‌ام مقایسه کن.", "با جستجو و مرور وب، اطلاعات را پیدا و برای همین درخواست مقایسه می‌کند.", "اگر کار تکرار شود، می‌تواند روشِ مفید را به مهارت و اسکریپت تبدیل کند.", "بار بعد، روش و کدِ ذخیره‌شده را به کار می‌گیرد و در صورت نیاز اصلاح می‌کند."][step]}</p></div><div class="j-agent-kit">${[
          ["هدف و ابزارهای عمومی", "model"],
          ["انجامِ کار و بررسیِ نتیجه", "check"],
          ["ساخت مهارت و کد", "tool"],
          ["استفادهٔ دوباره و اصلاح", "book"],
        ]
          .map(
            ([t, i], n) =>
              `<div class="${n <= step ? "active" : ""}">${I(i)}<span>${t}</span></div>`,
          )
          .join("")}</div></div>`;
        break;
      }
      case "coding-workbench": {
        const n = state.environment ?? 0,
          a = environments[n],
          selected = state.workbenchProduct ?? 0,
          t = s.products[selected];
        h = `${actions(environments.map(([title], i) => B("environment-" + i, title, n === i ? "selected" : "secondary")).join(""))}${actions(s.products.map((p, i) => B("workbench-" + i, p.label, selected === i ? "selected" : "secondary")).join(""))}<div class="j-workbench ${a[1]}"><div class="j-workbench-top"><strong dir="ltr">${E(a[0])}</strong><span>نمای آموزشی · ${E(t.label)}</span></div><div class="j-workbench-body"><div class="j-file-tree" dir="ltr">${E(t.files)}</div><div class="j-code-editor"><small>خواستهٔ ما</small><p>${E(t.request)}</p><div class="j-code-lines"><code dir="ltr">${E(t.result)}</code><code dir="auto">${E(t.review)}</code></div></div></div></div><p class="j-caption">${E(a[2])}</p>`;
        break;
      }
      case "specialized-producer": {
        h = `<div class="j-translator-machine"><aside>${I("book")}<strong>محصولِ تکراری:<br>ترجمهٔ کتاب</strong></aside><div class="j-translator-modules">${[
          ["واژه‌نامه", "واژه و ترجمهٔ تأییدشده"],
          ["وضعیتِ فصل‌ها", "پیش‌نویس، بازبینی، نهایی"],
          ["ابزارِ بررسی", "مقایسه با اصل و یافتنِ ناهماهنگی"],
        ]
          .map(
            ([t, v], i) =>
              `<div class="${i <= step ? "active" : ""}">${I(["book", "folder", "check"][i])}<strong>${t}</strong><span>${i <= step ? v : "…"}</span></div>`,
          )
          .join("")}</div></div>`;
        break;
      }
      case "builder-runtime": {
        const build = s.side === "build";
        h = `<div class="j-build-runtime"><div class="${build ? "active" : ""}">${I("tool")}<small>زمانِ ساخت</small><h3>دستیارِ سازنده</h3><div class="j-build-files" dir="ltr">tools.py · tests/ · docs/</div><span>خواندن ← ویرایش ← آزمون</span></div><div class="j-release-arrow">نسخهٔ بررسی‌شده<span>←</span></div><div class="${!build ? "active" : ""}">${I("person")}<small>زمانِ اجرا</small><h3>ایجنتِ سفر</h3><div class="j-runtime-tools">جستجو · رزروِ مجاز · پیگیری</div><span>کاربر: بلیتِ من را بده.</span></div></div>`;
        break;
      }
      case "build-analogy": {
        h = `<div class="j-build-compare"><div class="j-lang-row"><div class="j-lang-source"><strong dir="ltr">C++</strong><code dir="ltr">int seats = "one";</code></div><span>←</span><div class="${step >= 1 ? "compile-error" : ""}"><b>کامپایل</b><p>${step >= 1 ? "نوعِ مقدار با عددِ صحیح سازگار نیست." : "بررسیِ کد پیش از اجرای برنامه"}</p></div><span>←</span><div class="muted"><b>اجرا</b><p>${step >= 1 ? "این نسخه هنوز ساخته نشده؛ اجرا نمی‌شود." : "پس از ساختِ موفق"}</p></div></div><div class="j-lang-row"><div class="j-lang-source"><strong dir="ltr">CPython</strong><code dir="ltr">seats = "one"<br>total = seats + 1</code></div><span>←</span><div class="${step >= 1 ? "prepared" : ""}"><b>آماده‌سازی</b><p>${step >= 1 ? "این کد می‌تواند به bytecode تبدیل شود." : "تبدیلِ کد برای اجرا"}</p></div><span>←</span><div class="${step >= 2 ? "compile-error" : ""}"><b>اجرا</b><p>${step >= 2 ? "در جمعِ رشته و عدد، TypeError رخ می‌دهد." : "این خطا هنگامِ اجرای عبارت آشکار می‌شود."}</p></div></div></div><div class="j-analogy-note">در ساختِ محصول هم باید بدانیم کدام بررسی پیش از عرضه و کدام کنترل هنگامِ اجرا لازم است.</div>`;
        break;
      }
      case "codo-workflows": {
        const agent = state.codo ?? true;
        h = `${actions(B("codo", agent ? "نمایشِ محصول: سایت" : "نمایشِ محصول: ایجنت"))}<div class="j-codo-flow">${card("دستیارِ سازنده", "با مدل، فایل و ابزارِ اجرا", "model")}<div class="j-codo-book">${I("book")}<strong>کدو</strong><span>دستورها + سندها + ترتیبِ کار</span><div>${agent ? "سناریو → ابزار و داده → مرزها → آزمون" : "نیاز → صفحات و مسیرها → ساخت → بررسیِ مرورگر"}</div></div>${card(agent ? "محصول: ایجنت" : "محصول: سایت", agent ? "سرویسِ قابل اجرا برای سفر" : "صفحات و رفتارِ قابل استفاده", agent ? "model" : "web")}</div>`;
        break;
      }
      case "assistant-roles":
        h = `<div class="j-two"><div class="j-role-person">${I("person")}<h3>دستیارِ سارا</h3><p>هدفِ سفرِ سارا را میانِ چند خدمت پیگیری می‌کند.</p><span>از طرفِ مسافر</span></div><div class="j-role-agency">${I("tool")}<h3>ایجنتِ آژانسِ سفر</h3><p>جستجو، رزرو و پیگیری را طبق قواعدِ آژانس انجام می‌دهد.</p><span>از طرفِ ارائه‌دهندهٔ خدمت</span></div></div>`;
        break;
      case "assistant-chain": {
        const actors = [
            ["سارا", "person"],
            ["دستیارِ سارا", "model"],
            ["ایجنتِ آژانس", "model"],
            ["سامانهٔ آژانس", "cloud"],
          ],
          texts = [
            "سارا: بلیتِ سفرم را بگیر.",
            "دستیارِ سارا درخواستِ مجاز را به ایجنتِ آژانس می‌سپارد.",
            "ایجنتِ آژانس، ابزارِ سامانهٔ خودش را به کار می‌گیرد.",
            "سامانه، همان رزروِ ثبت‌شده را برمی‌گرداند.",
            "نتیجه از ایجنتِ آژانس به دستیار و سپس به سارا می‌رسد.",
          ];
        h = `<div class="j-chain-four">${actors.map(([t, i], n) => `<div class="${step === n || step === 4 ? "active" : ""}">${I(i)}<strong>${t}</strong>${n < 3 ? '<span class="j-chain-link">↔</span>' : ""}</div>`).join("")}</div>${surface(step === 4 ? "مسیرِ برگشت" : "مسیرِ درخواست", `<p>${texts[step]}</p>`)}`;
        break;
      }
      case "assistant-network":
        h = `<div class="j-assistant-net"><div class="j-net-user">${I("person")}<b>سارا: سفر را هماهنگ کن.</b></div><div class="j-net-hub">${I("model")}<strong>دستیارِ سارا</strong><span>بودجه و زمانِ کلیِ سفر</span></div><div class="j-net-services">${[
          ["ایجنتِ آژانس", "سامانهٔ بلیت"],
          ["ایجنتِ هتل", "سامانهٔ اتاق‌ها"],
          ["ایجنتِ رفت‌وآمد", "سامانهٔ خودرو"],
        ]
          .map(
            ([a, b]) =>
              `<div>${I("model")}<strong>${a}</strong><span>↕</span><small>${b}</small></div>`,
          )
          .join("")}</div></div>`;
        break;
      case "mcp-integrations": {
        const standard = state.mcp ?? false,
          n = state.services ?? 4,
          m = 3,
          ys = Array.from({ length: n }, (_, i) => 45 + (i * 250) / (n - 1)),
          cy = [55, 170, 285];
        h = `<div class="j-mcp"><svg viewBox="0 0 1160 340" role="img" aria-label="مقایسهٔ اتصال‌های اختصاصی با پیاده‌سازیِ قراردادِ مشترک">${standard ? [...cy.map((y) => `<path d="M220 ${y}L580 170"/>`), ...ys.map((y) => `<path d="M580 170L930 ${y}"/>`)].join("") : cy.flatMap((y) => ys.map((z) => `<path d="M220 ${y}L930 ${z}"/>`)).join("")}${cy.map((y, i) => `<rect x="30" y="${y - 24}" width="190" height="48" rx="8"/><text x="125" y="${y + 7}">دستیار ${F(i + 1)}</text>`).join("")}${ys.map((y, i) => `<rect x="930" y="${y - 21}" width="195" height="42" rx="8"/><text x="1027" y="${y + 7}">سرویس ${F(i + 1)}</text>`).join("")}${standard ? '<rect class="j-mcp-hub" x="465" y="128" width="230" height="84" rx="12"/><text class="j-mcp-hub-label" x="580" y="177">قراردادِ مشترک MCP</text>' : ""}</svg><div class="j-mcp-count"><strong>${F(integrationCount(m, n, standard))}</strong><span>پیاده‌سازی در مدلِ ساده</span><code dir="ltr">${m} ${standard ? "+" : "×"} ${n}</code></div></div>${actions(B("mcp", standard ? "نمایشِ اتصال‌های اختصاصی" : "نمایشِ قراردادِ مشترک") + B("services", n === 4 ? "یک سرویس اضافه کن" : "برگشت به چهار سرویس", "secondary"))}<p class="j-caption">قراردادِ مشترک، کارِ اتصالِ تکراری را کم می‌کند؛ سرویس‌ها همچنان به پیاده‌سازی، ورود و مجوز نیاز دارند.</p>`;
        break;
      }
      case "os-vision": {
        const after = !!state.os;
        h = `<div class="j-os-vision"><div class="j-phone-frame"><small>${after ? "یک خواسته" : "چند جابه‌جایی"}</small>${
          after
            ? '<div class="j-os-chat">برای سفرم زنگ بگذار، مسیر را پیدا کن و به همراهم خبر بده.</div><div class="j-os-reply">زنگ تنظیم شد؛ مسیر آماده است؛ پیام طبق اجازهٔ تو ارسال می‌شود.</div>'
            : '<div class="j-app-grid">' +
              [
                ["زنگ", "phone"],
                ["نقشه", "search"],
                ["پیام", "person"],
                ["تقویم", "file"],
              ]
                .map(([t, i]) => `<div>${I(i)}<span>${t}</span></div>`)
                .join("") +
              "</div>"
        }</div><aside><h3>${after ? "دستیار، راهِ شروعِ کارها می‌شود." : "امروز کار را میان برنامه‌ها جابه‌جا می‌کنیم."}</h3><p>${after ? "یک هدف؛ چند ابزار و خدمت، با هماهنگیِ دستیار" : "کاربر، خودش ارتباطِ میان زنگ، نقشه، پیام و تقویم را برقرار می‌کند."}</p>${B("os", after ? "قبل از این تغییر" : "تصویرِ آینده را ببین")}</aside></div>`;
        break;
      }
      case "magic-ingredients": {
        const x = [
          ["گفت‌وگو", "model", "پاسخ بر اساسِ متن و موادِ شخصیت"],
          ["صدا", "tool", "گفتنِ پاسخ با صدای ساخته‌شده"],
          ["تصویر", "web", "چهره یا صحنهٔ متحرک"],
          ["تجربه", "person", "کنار هم گذاشتنِ اجزا برای یک حضور یا صحنه"],
        ];
        h = `<div class="j-magic">${x.map(([t, i, v], n) => `<div class="${n <= step ? "revealed" : ""}">${I(i)}<strong>${t}</strong><span>${n <= step ? v : "…"}</span></div>`).join("")}</div><div class="j-magic-caption">از یک تجربهٔ داستانی، به اجزایی که می‌توان دربارهٔ ساختنشان حرف زد.</div>`;
        break;
      }
      case "jobs-question":
        h = `<div class="j-jobs-question"><div class="j-work-icons">${["book", "tool", "file", "model"].map((i) => I(i)).join("")}</div><strong>وقتی روشِ انجامِ کار عوض شود،<br>نقشِ آدم‌ها چه می‌شود؟</strong><span>برای دیدنِ تغییرِ یک زنجیرهٔ کار، به نساجی برگردیم.</span></div>`;
        break;
      case "career-timeline":
        h = `<div class="j-career"><div class="j-career-line"></div>${[
          ["شروعِ کار", 20],
          ["تغییرِ فناوری", 50],
          ["ادامهٔ مسیر", 80],
        ]
          .map(
            ([t, x], i) =>
              `<div style="--pos:${x}%" class="${i <= step ? "active" : ""}">${I(i === 1 ? "model" : "person")}<b>${t}</b><span>${i === 1 ? "یادگیری، تغییرِ نقش یا تغییرِ حرفه" : i === 0 ? "مهارت و تجربهٔ قبلی" : "مسیرِ بعدی"}</span></div>`,
          )
          .join(
            "",
          )}</div><p class="j-caption">خطِ زمان، سناریوی مفهومی است؛ عدد یا آمارِ شغلی را نمایش نمی‌دهد.</p>`;
        break;
      case "expert-deliverable":
        h = `<div class="j-expert-work"><div>${I("model")}<strong>ایجنتِ تخصصی</strong><span>در سناریوی آینده</span></div><span class="j-transfer-arrow">←</span><div class="j-expert-papers"><article><b>گزارشِ پزشکی</b><div class="j-paper-lines"></div></article><article><b>نقشه و محاسبه</b><div class="j-blueprint">${"<i></i>".repeat(9)}</div></article></div></div>`;
        break;
      case "professional-gate": {
        h = `<div class="j-gate-route"><div class="j-finished-work">${I("file")}<strong>کارِ تخصصی آماده است.</strong><span>تهیه‌شده توسط ایجنت</span></div><div class="j-professional-gate ${step >= 1 ? "closed" : ""}">${I("lock")}<strong>شرطِ پذیرش</strong><span>مُهرِ متخصصِ انسانی</span><i></i></div><div class="j-institution ${step >= 2 ? "waiting" : ""}">${I("stamp")}<strong>نهادِ پذیرنده</strong><span>${step >= 2 ? "بدون مُهر، نمی‌پذیرد." : "بیمه یا پذیرشِ ساختمان در سناریو"}</span></div></div>${steps(["انجامِ کار", "مانعِ مُهر", "پذیرش متوقف است"], step)}`;
        break;
      }
      case "stamp-market": {
        const n = state.offers ?? 1;
        h = `<div class="j-stamp-market"><div class="j-finished-work">${I("file")}<h3>کار را از ایجنت گرفته‌اند.</h3><span>اکنون فقط تأییدِ رسمی لازم است.</span></div><div class="j-stamp-offers">${Array.from({ length: n }, (_, i) => `<div>${I("stamp")}<span>پیشنهادِ مُهر ${F(i + 1)}</span><b>${["قیمتِ بیشتر", "کمتر", "باز هم کمتر"][i]}</b></div>`).join("")}</div></div>${actions(B("offers", n === 3 ? "بازگشت به یک عرضه‌کننده" : "یک عرضه‌کنندهٔ مُهر اضافه کن"))}<div class="j-market-price"><span>فشارِ رقابت بر قیمت</span><i style="width:${110 - n * 25}%"></i></div>`;
        break;
      }
      case "political-change": {
        const text = [
          "وعده: برای پذیرشِ کارِ ایجنت، الزامِ مُهر را برداریم.",
          "در این سناریو، این وعده حمایت و رأی می‌آورد.",
          "قاعده عوض می‌شود؛ آن مانعِ پذیرش کنار می‌رود.",
        ][step];
        h = `<div class="j-political">${card("وعدهٔ تغییر", step === 0 ? "حذفِ الزامِ مُهر" : "وعده در برابر مانعِ پرهزینه", "person", step === 0 ? "active" : "")}${card("رأی و حمایت", step >= 1 ? "حمایت از تغییرِ قاعده" : "…", "vote", step === 1 ? "active" : "")}${card("قاعدهٔ تازه", step >= 2 ? "پذیرش، بدون همان مُهرِ اجباری" : "…", "check", step === 2 ? "active" : "")}</div>${surface("ادامهٔ سناریو", `<p>${text}</p>`)}`;
        break;
      }
      case "relational-work":
        h = `<div class="j-relational"><div class="j-human-network"><svg viewBox="0 0 600 320" aria-hidden="true">${[
          [100, 90],
          [280, 40],
          [490, 90],
          [100, 250],
          [310, 280],
          [500, 240],
        ]
          .flatMap(([x, y], i, arr) =>
            arr
              .slice(i + 1)
              .map(([a, b]) => `<path d="M${x} ${y}L${a} ${b}"/>`),
          )
          .join("")}${[
          [100, 90],
          [280, 40],
          [490, 90],
          [100, 250],
          [310, 280],
          [500, 240],
        ]
          .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="24"/>`)
          .join(
            "",
          )}</svg>${I("heart")}</div><div><h3>اعتماد و رابطه میان آدم‌ها</h3><p>انگیزه، همدلی، هماهنگیِ جمع و رهبریِ عاطفی</p><span>چرا این نقش با «دادنِ پاسخِ تخصصی» فرق دارد؟</span></div></div>`;
        break;
      default:
        throw new Error("Unknown journey: " + s.kind);
    }
    return layout(s, h, step, state);
  }
  function act(s, action, state = {}) {
    let n = { ...state };
    if (action === "reset") return {};
    if (action.startsWith("bench-")) {
      n.bench = [...(n.bench ?? [true, false, true])];
      const i = Number(action.slice(6));
      n.bench[i] = !n.bench[i];
    }
    if (action.startsWith("benchmark-")) n.benchmark = Number(action.slice(10));
    if (action === "contributor") n.contributor = !n.contributor;
    if (action.startsWith("bits-")) n.bits = Number(action.slice(5));
    if (action.startsWith("time-")) n.time = Number(action.slice(5));
    if (action === "fresh") n.fresh = !n.fresh;
    if (action.startsWith("provider-")) n.provider = Number(action.slice(9));
    if (action === "dispatch") n.dispatch = !(n.dispatch ?? true);
    if (action === "valid") n.valid = !(n.valid ?? true);
    if (action.startsWith("tool-")) n.tool = Number(action.slice(5));
    if (action.startsWith("packet-")) {
      const key = action.slice(7),
        a = n.selected ?? ["instructions", "messages", "tools"];
      n.selected = a.includes(key) ? a.filter((x) => x !== key) : [...a, key];
    }
    if (action.startsWith("store-")) n.store = Number(action.slice(6));
    if (action === "history-lookup") n.looked = true;
    else if (action.startsWith("history-")) {
      n.history = action.slice(8);
      n.looked = false;
    }
    if (action === "cycle-approve")
      n.grant = { amount: 6200000, plan: "trip-a" };
    if (action.startsWith("stop-")) n.stop = Number(action.slice(5));
    if (action === "change-amount")
      n.amount = (n.amount ?? 6200000) === 6200000 ? 7400000 : 6200000;
    if (action === "clean") n.clean = !n.clean;
    if (action === "ticket-view") n.ticket = !n.ticket;
    if (action.startsWith("product-")) n.product = Number(action.slice(8));
    if (action.startsWith("quality-") && action !== "quality-phase") {
      n.quality = action.slice(8);
      n.phase = 0;
    }
    if (action === "quality-phase") n.phase = ((n.phase ?? 0) + 1) % 3;
    if (action.startsWith("environment-"))
      n.environment = Number(action.slice(12));
    if (action.startsWith("workbench-"))
      n.workbenchProduct = Number(action.slice(10));
    if (action === "codo") n.codo = !(n.codo ?? true);
    if (action === "mcp") n.mcp = !(n.mcp ?? false);
    if (action === "services") n.services = (n.services ?? 4) === 4 ? 5 : 4;
    if (action === "os") n.os = !n.os;
    if (action === "offers") n.offers = ((n.offers ?? 1) % 3) + 1;
    return n;
  }
  const api = {
    handles: (k) => kinds.has(k),
    render,
    act,
    frames: frameCount,
    canAdvance,
    enter,
    packet,
    history,
    weightGB,
    isPeak,
    prices,
    integrationCount,
    loopFrames,
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.Journeys = api;
})(typeof window === "undefined" ? null : window);
