/* Local teaching scenes. No live model, booking or external service calls. */
(function () {
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
  function icon(name) {
    const paths = {
      model:
        "M18 20h44v40H18z M28 30h24v20H28z M8 30h10m-10 20h10m44-20h10M62 50h10M30 10v10m20-10v10M30 60v10m20-10v10",
      store:
        "M16 20c0-12 48-12 48 0s-48 12-48 0v40c0 12 48 12 48 0V20M16 40c0 12 48 12 48 0",
      cloud: "M18 58h43a13 13 0 0 0 1-26A22 22 0 0 0 19 30a14 14 0 0 0-1 28",
      chat: "M12 15h56v40H35L20 67V55h-8z M25 29h30M25 41h20",
      lock: "M20 34h40v32H20z M28 34V23a12 12 0 0 1 24 0v11M40 45v12",
      check: "M15 40l17 17 34-36",
      search: "M51 50l19 20M57 33a24 24 0 1 1-48 0 24 24 0 0 1 48 0",
      file: "M20 10h28l14 15v45H20z M48 10v16h14M30 40h22M30 51h22",
      receipt:
        "M20 10l8 5 8-5 8 5 8-5 8 5v55l-8-5-8 5-8-5-8 5-8-5z M29 30h22M29 42h22M29 54h12",
      build:
        "M12 24h56v44H12z M12 36h56M25 24v-9h30v9M32 48l-7 6 7 6m16-12 7 6-7 6",
      wave: "M10 38h6l4-15 7 36 8-48 9 58 8-46 7 27 5-12h7",
      image: "M12 14h56v52H12z M12 56l20-22 16 17 9-11 11 16M56 27h1",
      key: "M20 45a15 15 0 1 1 11 9l-13 13h-9v-9z",
      filter: "M10 15h60L47 40v24l-14 7V40z",
      stop: "M26 10h28l16 16v28L54 70H26L10 54V26z M28 28l24 24m0-24L28 52",
      plan: "M15 10h50v60H15z M25 25h30M25 40h30M25 55h15",
      edit: "M18 53l36-36 12 12-36 36-17 4z",
      tool: "M25 15v20h30V15M40 35v35",
      reply: "M32 20L12 40l20 20M12 40h35c15 0 20 10 20 20",
      alert: "M40 8L75 70H5z M40 28v20m0 10v3",
    };
    return `<svg viewBox="0 0 80 80" class="story-icon" aria-hidden="true"><path d="${paths[name] || paths.file}" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function panel(a) {
    let body = "";
    if (a.kind === "chat")
      body = `<div class="story-messages">${a.rows.map(([who, text]) => `<div class="story-message ${who === "کاربر" || who === "سارا" || who === "مسافر" ? "from-user" : ""}"><span>${E(who)}</span><p>${E(text)}</p></div>`).join("")}</div>`;
    if (a.kind === "receipt")
      body = `<div class="story-fields">${a.rows.map(([k, v]) => `<div><span>${E(k)}</span><strong dir="auto">${E(v)}</strong></div>`).join("")}</div>`;
    if (a.kind === "document")
      body = `<div class="story-document">${icon("file")}<blockquote>${E(a.quote)}</blockquote><small>${E(a.foot)}</small></div>`;
    if (a.kind === "code") body = `<pre class="story-code">${E(a.text)}</pre>`;
    return `<section class="story-panel ${E(a.kind)}"><div class="story-panel-label">${icon(a.kind === "chat" ? "chat" : a.kind === "receipt" ? "receipt" : "file")}<span>${E(a.label)}</span></div>${body}</section>`;
  }
  const button = (action, label, extra = "") =>
    `<button data-story="${action}" ${extra}>${label}</button>`;
  const result = (ok, text) =>
    `<div class="story-result ${ok ? "ok" : "blocked"}" role="status">${icon(ok ? "check" : "stop")}<p>${E(text)}</p></div>`;
  const phoneHandles = {
    h_phone_7f2a: { owner: "U-17", value: "09120000000" },
    h_phone_b991: { owner: "U-42", value: "09120000001" },
  };
  function secretCheck({
    caller = "U-17",
    handle = "h_phone_7f2a",
    sink = "booking",
  } = {}) {
    const record = Object.hasOwn(phoneHandles, handle)
      ? phoneHandles[handle]
      : null;
    if (!record)
      return {
        allowed: false,
        reason: "ارجاع شناخته‌شده نیست.",
        payload: null,
      };
    if (caller !== record.owner)
      return {
        allowed: false,
        reason: "مالکِ شماره، کاربرِ فعلی نیست.",
        payload: null,
      };
    if (sink !== "booking")
      return {
        allowed: false,
        reason: "این گیرنده اجازهٔ دریافتِ شماره ندارد.",
        payload: null,
      };
    return {
      allowed: true,
      reason: "مالک و گیرنده مجازند؛ شماره فقط به فیلدِ صدور فرستاده شد.",
      payload: { phone: record.value },
      modelResult: { booking: "124", status: "issued" },
      log: { handle, sink, status: "sent" },
    };
  }
  const sampleBookings = [
    { id: "124", owner: "U-17", city: "مشهد" },
    { id: "999", owner: "U-42", city: "شیراز" },
  ];
  function scopeBookings(caller) {
    return sampleBookings
      .filter((b) => b.owner === caller)
      .map((b) => ({ id: b.id, city: b.city }));
  }
  function permission(mode, state, op) {
    const n = { ...state };
    n.success = false;
    if (op === "model-execute" && mode === "hard") {
      n.message = "مدل ابزارِ خرید ندارد؛ اجرا از مسیرِ مستقلِ هارنس است.";
      return n;
    }
    if (op === "change") {
      n.amount = 7400000;
      n.approved = false;
      n.done = false;
      n.message = "مبلغ عوض شد؛ تأییدِ قبلی دیگر معتبر نیست.";
      return n;
    }
    if (op === "approve") {
      n.success = true;
      n.approved = true;
      n.approvedAmount = n.amount || 6200000;
      n.message = "تأییدِ همان کاربر برای همین مبلغ ثبت شد.";
      return n;
    }
    if (op === "consent") {
      n.success = true;
      n.consent = true;
      n.message = "کاربر در گفت‌وگو پاسخِ مثبت داد.";
      return n;
    }
    if (op === "execute") {
      if (
        mode === "hard" &&
        (!n.approved || n.approvedAmount !== (n.amount || 6200000))
      )
        n.message = "اجرا رد شد: مجوزِ معتبر برای همین پیشنهاد وجود ندارد.";
      else if (n.done)
        n.message = "این کار قبلاً انجام شده؛ اجرای دوباره رد شد.";
      else {
        n.success = true;
        n.done = true;
        n.approved = false;
        n.message =
          mode === "hard"
            ? "خریدِ نمونه یک‌بار انجام شد؛ مجوز مصرف شد."
            : mode === "soft" && !n.consent
              ? "اجرا شد، با اینکه در چت تأیید نگرفتیم؛ ابزارِ مستقیم در دسترس بود."
              : "عملیاتِ نمونه انجام شد.";
      }
      return n;
    }
    return n;
  }
  function frames(s) {
    if (window.Journeys?.handles(s.kind)) return Journeys.frames(s);
    if (window.Lessons?.handles(s.kind)) return Lessons.frames(s);
    return s.kind === "generation"
      ? 3
      : s.kind === "agent-loop"
        ? 6
        : s.kind === "phone-orchestration"
          ? 4
          : s.kind === "embodiment"
            ? 4
            : s.kind === "diary-story"
              ? 3
              : 0;
  }
  function render(s, step = 0, state = {}, neural) {
    if (window.Journeys?.handles(s.kind))
      return Journeys.render(s, step, state);
    if (window.Lessons?.handles(s.kind))
      return Lessons.render(s, step, state, neural);
    let content = "";
    const note = s.point || "";
    switch (s.kind) {
      case "scene":
        content = `<div class="story-scene"><div class="story-observations">${s.notes.map(([a, b], i) => `<div><span class="story-index">${F(i + 1)}</span><h3>${E(a)}</h3><p>${E(b)}</p></div>`).join("")}</div>${panel(s.artifact)}</div>`;
        break;
      case "contrast":
        content = `<div class="story-contrast">${s.panels.map(panel).join("")}</div>`;
        break;
      case "path":
        content = `<div class="story-path">${s.nodes.map(([title, text, symbol], i) => `<section class="story-node">${icon(symbol)}<span class="story-index">${F(i + 1)}</span><h3>${E(title)}</h3><p>${E(text)}</p></section>`).join("")}</div>`;
        break;
      case "table":
        content = `<table class="story-table"><thead><tr>${s.head.map((h) => `<th>${E(h)}</th>`).join("")}</tr></thead><tbody>${s.rows.map((r) => `<tr>${r.map((v, i) => `<td>${i === 0 ? icon(["model", "cloud", "tool", "file"][s.rows.indexOf(r) % 4]) : ""}<span>${E(v)}</span></td>`).join("")}</tr>`).join("")}</tbody></table>`;
        break;
      case "generation": {
        const f = s.frames[Math.min(step, 2)];
        content = `<div class="generation-scene"><div class="generation-prefix"><small>متنی که این نوبت به مدل می‌رسد</small><p>${E(f.prefix)} <b>…</b></p><div class="generated-choice">انتخابِ این گام: <strong>${E(f.chosen)}</strong></div></div><div class="generation-options">${f.options.map(([word, p]) => `<div><span>${E(word)}</span><i style="--p:${p}%"></i><b>${F(p)}٪</b></div>`).join("")}<small>احتمال‌های نمایشی؛ فراخوانیِ مدلِ زنده نیست.</small></div></div>`;
        break;
      }
      case "context-lab":
        content = `<div class="story-scene">${panel({
          label: "آنچه این نوبت به مدل می‌رسد",
          kind: "chat",
          rows: state.context
            ? [
                ["سابقه", "رزرو ۱۲۴، مشهد؛ برگشت جمعه ساعت ۱۰"],
                ["کاربر", "برگشت را عوض کن."],
                ["دستیار", "برای برگشتِ رزروِ مشهد، چه ساعتی مناسب است؟"],
              ]
            : [
                ["کاربر", "برگشت را عوض کن."],
                ["دستیار", "برگشتِ کدام سفر را می‌گویی؟"],
              ],
        })}<div class="context-assembly"><div class="context-piece selected">پیامِ جدید</div><div class="context-piece ${state.context ? "selected" : ""}">رزروِ فعلی + سابقهٔ مرتبط</div><div class="context-piece">هارنس، زمینه را می‌سازد.</div><div class="story-actions">${button("context", state.context ? "حذفِ سابقه از زمینه" : "افزودنِ سابقه به زمینه")}</div></div></div>`;
        break;
      case "retrieval":
        content = `<div class="retrieval-scene"><div class="document-shelf">${["راهنمای مرخصی", "آیین‌نامهٔ سفر", "راهنمای تجهیزات"].map((t, i) => `<div class="shelf-doc ${state.retrieved && i === 1 ? "selected" : ""}">${icon("file")}<span>${t}</span></div>`).join("")}</div><div class="story-actions">${button("retrieve", "بندِ مربوط به هزینهٔ هتل را بازیابی کن")}</div>${state.retrieved ? panel({ label: "زمینهٔ آماده برای پاسخ", kind: "document", quote: "پرسش: اتاقِ شبی ۳٫۴ میلیون بازپرداخت می‌شود؟\nبندِ بازیابی‌شده: سقفِ هر شب ۳ میلیون؛ مبلغِ بیشتر با تأییدِ مدیر.\nپاسخ: این اتاق به تأییدِ مدیر نیاز دارد.", foot: "منبع: آیین‌نامهٔ سفر، بخشِ اقامت" }) : `<div class="retrieval-pending">پرسش: «اتاقِ شبی ۳٫۴ میلیون بازپرداخت می‌شود؟»</div>`}</div>`;
        break;
      case "cost-lab": {
        let calls = state.calls || 1;
        let amount = (calls * (2000 * 2 + 500 * 8)) / 1e6;
        content = `<div class="cost-scene"><div class="cost-gauge"><b>${F(calls)}</b><span>فراخوانیِ مدل برای یک کار</span><div class="call-dots">${Array.from({ length: calls }, () => "<i></i>").join("")}</div></div>${panel(
          {
            label: "محاسبهٔ آموزشی؛ نرخِ فرضی",
            kind: "receipt",
            rows: [
              ["هر فراخوانی", "۲٬۰۰۰ توکن ورودی + ۵۰۰ خروجی"],
              ["نرخِ فرضیِ هر میلیون", "ورودی $2 / خروجی $8"],
              ["هزینهٔ این کار", `$${amount.toFixed(3)}`],
              ["اشتراک", "سهمیه و شرایطِ طرح را جدا می‌سنجیم."],
            ],
          },
        )}<div class="story-actions">${button("cost-more", "یک فراخوانیِ دیگر")}${button("reset", "از ابتدا")}</div></div>`;
        break;
      }
      case "harness":
        content = `<div class="harness-scene"><div class="harness-shell"><span class="shell-label">هارنس: برنامهٔ اداره‌کنندهٔ اجرا</span><div class="harness-row">${[
          ["chat", "پیامِ سارا"],
          ["filter", "زمینهٔ سفر"],
          ["model", "مدل"],
          ["lock", "کنترلِ ابزار"],
        ]
          .map(([i, t]) => `<div>${icon(i)}<b>${t}</b></div>`)
          .join(
            "",
          )}</div><div class="harness-return">نتیجهٔ ابزار ← ادامهٔ تصمیمِ مدل ← پاسخ به سارا</div></div><div class="external-service">${icon("cloud")}<b>سامانهٔ سفر</b><span>جستجو و رزروِ مجاز</span></div></div>`;
        break;
      case "agent-loop": {
        const stages = [
          ["پیامِ کاربر", "«برای پنجشنبه قطارِ مشهد پیدا کن.»"],
          ["زمینهٔ آماده", "یک نفر؛ بودجهٔ ۸ میلیون؛ شرطِ ساعتِ رسیدن"],
          ["درخواستِ مدل", "search_trips(Tehran, Mashhad, Thursday)"],
          ["اجرای هارنس", "کنترلِ ورودی؛ جستجو در سامانهٔ سفر"],
          ["نتیجهٔ ابزار", "A: رسیدن ۱۹ · B: رسیدن ۲۰"],
          [
            "پاسخِ مدل",
            "«برای جلسهٔ ۱۸، این دو قطار دیر می‌رسند. سفرِ زودتر را بررسی کنم؟»",
          ],
        ];
        content = `<div class="loop-story"><div class="loop-ring">${stages.map(([t], i) => `<div class="${i === step ? "current" : ""}"><span>${F(i + 1)}</span>${E(t)}</div>`).join("")}</div><div class="loop-payload">${icon(["chat", "filter", "model", "cloud", "receipt", "reply"][step])}<small>${E(stages[step][0])}</small><p>${E(stages[step][1])}</p></div></div>`;
        break;
      }
      case "memory":
        content = `<div class="memory-cabinets">${[
          ["سابقهٔ ذخیره‌شده", "پیام‌های مجازِ قبلی", "store"],
          ["زمینهٔ این نوبت", "درخواستِ تازه + رزروِ مرتبط", "filter"],
          [
            "اطلاعاتِ ماندگارِ منتخب",
            "ترجیحِ مجاز: قطار را بیشتر می‌پسندد.",
            "file",
          ],
        ]
          .map(
            ([a, b, i]) =>
              `<div class="cabinet">${icon(i)}<h3>${a}</h3><div class="cabinet-drawer">${b}</div><div class="cabinet-drawer blank"></div></div>`,
          )
          .join("")}</div>`;
        break;
      case "timeout":
        content = `<div class="story-contrast">${panel({
          label: "درخواستِ R-124 به سامانهٔ رزرو",
          kind: "receipt",
          rows: [
            ["ارسال", "خریدِ گزینهٔ A"],
            [
              "وضعیتِ سامانه",
              state.timeout === "created"
                ? "رزرو ۱۲۴ ساخته شد."
                : state.timeout === "lost"
                  ? "درخواست نرسید."
                  : "یک حالت را انتخاب کنید.",
            ],
            ["پاسخِ دریافتی", "هیچ پاسخ؛ زمانِ انتظار تمام شد."],
          ],
        })}<div class="timeout-result"><div class="story-actions">${button("timeout-created", "رزرو شد؛ پاسخ گم شد")}${button("timeout-lost", "درخواست نرسید")}</div>${state.timeout ? result(true, state.timeout === "created" ? "بررسیِ R-124: رزرو موجود است؛ همان نتیجه را برگردان." : "بررسیِ R-124: رزروی ثبت نشده؛ تکرارِ امن با همان شناسه.") : result(false, "از نرسیدنِ جواب نمی‌توان نتیجه گرفت که خرید انجام نشده است.")}</div></div>`;
        break;
      case "budget-lab": {
        let n = state.steps || 0;
        content = `<div class="budget-scene"><div class="budget-track">${Array.from({ length: 5 }, (_, i) => `<div class="${i < n ? "used" : ""}">${F(i + 1)}</div>`).join("")}</div><div class="budget-readout"><b>${F(n)} / ۵</b><span>گامِ مجازِ این کار</span></div><div class="story-actions">${button("budget-step", "درخواستِ گامِ بعد")}${button("reset", "از ابتدا")}</div>${state.limit ? result(false, "گامِ ششم اجرا نشد؛ هارنس حدِ این کار را اعمال کرد.") : result(true, "گامِ بعد فقط تا سقفِ تعریف‌شده مجاز است.")}</div>`;
        break;
      }
      case "permission-lab": {
        const hard = s.mode === "hard",
          soft = s.mode === "soft";
        content = `<div class="permission-scene">${panel({
          label: hard
            ? "پیشنهادِ خریدِ نمونه"
            : soft
              ? "تغییرِ نامِ سفر"
              : "ساختِ پیش‌نویسِ سفر",
          kind: "receipt",
          rows: hard
            ? [
                ["صاحب", "U-17"],
                [
                  "مبلغ",
                  (state.amount || 6200000).toLocaleString("fa-IR") + " تومان",
                ],
                [
                  "مجوز",
                  state.approved ? "برای همین مبلغ ثبت شده" : "وجود ندارد",
                ],
              ]
            : [
                [
                  "کارِ کاربر",
                  soft
                    ? "نامِ سفر را «آخرِ هفته» کن."
                    : "یک پیش‌نویسِ سفر بساز.",
                ],
                ["ابزارِ مدل", "اجرای مستقیمِ همین کار"],
                [
                  "تأییدِ گفت‌وگویی",
                  state.consent ? "دریافت شده" : "دریافت نشده",
                ],
              ],
        })}<div class="permission-controls"><div class="authority-lane"><small>مسیرِ درخواستِ مدل</small>${button(hard ? "model-execute" : "execute", hard ? "تلاشِ اجرای مدل" : "اجرای ابزارِ مدل")}${soft ? button("consent", "پاسخِ «بله» در چت") : ""}</div>${hard ? `<div class="authority-lane trusted"><small>مسیرِ مستقلِ کاربرِ معتبر و هارنس</small>${button("approve", "تأییدِ همین پیشنهاد")}${button("execute", "اجرای هارنس با مجوز")}${button("change", "تغییرِ مبلغ به ۷٫۴ میلیون")}</div>` : ""}<div class="story-actions">${button("reset", "از ابتدا")}</div>${state.message ? result(!!state.success, state.message) : '<div class="story-placeholder">عملیات هنوز اجرا نشده است.</div>'}</div></div>`;
        break;
      }
      case "identity-lab": {
        let foreign = state.foreign ?? s.attack;
        const records = scopeBookings("U-17");
        content = `<div class="identity-scene"><div class="identity-person">${icon("lock")}<b>ورودِ معتبر: سارا / U-17</b><span>متنِ پیام: ${foreign ? "«رزروِ علی / U-42 را بده.»" : "«رزروِ من را بده.»"}</span><div class="story-actions">${button("identity-own", "درخواستِ حسابِ خودم")}${button("identity-foreign", "درخواستِ حسابِ دیگر")}</div></div><div class="identity-wire">←</div>${panel(
          {
            label: "درخواستِ واقعیِ هارنس به داده",
            kind: "receipt",
            rows: [
              ["ابزارِ مدل", "get_my_history()"],
              ["مالکِ تزریق‌شده", "U-17؛ از ورودِ معتبر"],
              ["پرس‌وجوی داده", "فقط رکوردهای owner = U-17"],
              [
                "نتیجهٔ محلی",
                records
                  .map((b) => "رزرو " + F(b.id) + "؛ " + b.city)
                  .join("، "),
              ],
              ["دادهٔ U-42", "هرگز برنمی‌گردد."],
            ],
          },
        )}</div>`;
        break;
      }
      case "private-input":
        content = `<div class="private-scene">${panel({
          label: "فرمِ خصوصیِ شمارهٔ همراه",
          kind: "receipt",
          rows: [
            ["شمارهٔ نمونه", "09120000000"],
            ["دریافت‌کننده", "هارنس؛ پیش از ساختِ پیام"],
            ["محلِ نگهداری", "خزانهٔ مرتبط با U-17"],
          ],
        })}<div class="private-barrier">${icon("lock")}<b>مرزِ زمینهٔ مدل</b><span>شمارهٔ خام عبور نمی‌کند.</span></div>${panel({ label: "متنِ آماده برای مدل", kind: "chat", rows: [["برنامه", "شمارهٔ مسافر ثبت شد. ارجاعِ قابل استفاده: h_phone_7f2a"]] })}</div>`;
        break;
      case "secret-lab": {
        let sink = state.sink || "booking",
          owner = state.owner || "U-17";
        const handle = owner === "U-17" ? "h_phone_7f2a" : "h_phone_b991";
        let r = state.checked ? secretCheck({ sink, handle }) : null;
        content = `<div class="secret-lab"><div class="secret-lab-settings">${panel(
          {
            label: "ارجاعِ شماره در خزانه",
            kind: "receipt",
            rows: [
              ["ارجاع", handle],
              ["کاربرِ معتبر", "U-17"],
              ["مالکِ ثبت‌شده در خزانه", owner],
              ["گیرنده", sink === "booking" ? "رزروِ مجاز" : "تبلیغاتِ نامجاز"],
            ],
          },
        )}<div class="story-actions">${button("secret-booking", "گیرنده: رزرو")}${button("secret-ads", "گیرنده: تبلیغات")}${button("secret-owner", owner === "U-17" ? "ارجاعِ کاربرِ دیگر" : "ارجاعِ خودم")}${button("secret-check", "کنترل و ارسالِ نمونه")}</div></div><div class="secret-delivery">${r ? result(r.allowed, r.reason) : '<div class="story-placeholder">هنوز داده‌ای باز یا ارسال نشده است.</div>'}${r?.allowed ? panel({ label: "فقط در درخواستِ سرویسِ مجاز", kind: "code", text: JSON.stringify(r.payload, null, 2) }) : ""}<div class="secret-model-result">${r?.allowed ? "بازگشت به مدل: رزرو ۱۲۴ صادر شد؛ بدون شمارهٔ خام." : "مقدارِ خام به مدل داده نمی‌شود."}</div></div></div>`;
        break;
      }
      case "outage-lab":
        content = `<div class="outage-scene"><div class="service-lights"><div class="${state.online ? "on" : "off"}">${icon("model")}مدل: ${state.online ? "وصل" : "قطع"}</div><div class="on">${icon("store")}سامانهٔ رزرو: وصل</div></div>${panel(
          {
            label: "حسابِ سارا؛ مستقل از اتصالِ مدل",
            kind: "receipt",
            rows: [
              ["رزرو", "۱۲۴"],
              ["وضعیت", "صادرشده"],
              ["بلیت", "در سامانه موجود است."],
            ],
          },
        )}<div class="story-actions">${button("connection", state.online ? "قطعِ مدل" : "وصلِ دوبارهٔ مدل")}</div></div>`;
        break;
      case "phone-orchestration": {
        let tasks = s.tasks || [
          ["زنگ", "برای حرکت ساعت ۷، زنگِ بیداری ساعت ۵ تنظیم شد."],
          ["مسیر", "مسیرِ خانه تا ایستگاه پیدا شد."],
          ["پیام", "متنِ خبر به همراه آماده شد؛ ارسال طبق مجوزِ پیام."],
          [
            "برنامهٔ یکپارچه",
            "زمانِ حرکت، مسیر و هماهنگی کنارِ برنامهٔ سفر قرار گرفت.",
          ],
        ];
        content = `<div class="phone-story"><div class="story-handset"><div class="handset-orb"></div><p>${E(s.request || "«سفرِ فردا را هماهنگ کن.»")}</p><div class="handset-tasks">${tasks
          .slice(step, step + 1)
          .map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`)
          .join("")}</div></div><div class="phone-connections">${tasks
          .slice(0, 3)
          .map(
            ([t], i) =>
              `<div class="${step >= i ? "connected" : ""}">${icon(["tool", "search", "chat"][i])}<b>${t}</b><span>${step >= i ? "گامِ نمونه آماده شد." : "در انتظار"}</span></div>`,
          )
          .join("")}</div></div>`;
        break;
      }
      case "product-visual":
        content = `<div class="product-story"><img src="assets/${E(s.image)}" alt="نمونهٔ رابطِ معرفی‌شدهٔ Cyclon">${panel({ label: "دو مرحلهٔ محصولِ معرفی‌شده", kind: "receipt", rows: s.panels })}</div>`;
        break;
      case "capability-visual":
        content = `<div class="capability-route"><div class="compute-large">${icon("cloud")}${icon("model")}<b>اجرایِ سنگین‌ترِ دیروز</b></div><div class="capability-arrow">←<span>بهینه‌سازیِ مدل و اجرا</span></div><div class="compute-small">${icon("model")}<b>مدلِ کوچک‌تر برای همان کار</b></div></div><div class="fixed-task">کارِ ثابت: فهمِ «برگشتِ سفرم را عوض کن»</div>`;
        break;
      case "local-lab": {
        let offline = state.offline ?? !!s.offline;
        content = `<div class="local-scene"><div class="local-device">${icon("model")}<b>مدل روی دستگاه</b><p>فهمِ دستور و دادهٔ محلی</p><span class="local-check">${icon("check")}در هر دو حالت قابل اجرا</span></div><div class="connection-toggle"><div class="${offline ? "broken-wire" : "live-wire"}"></div>${button("internet", offline ? "وصلِ اینترنت" : "قطعِ اینترنت")}<strong>${offline ? "اتصال قطع است" : "اتصال برقرار است"}</strong></div><div class="remote-device">${icon("cloud")}<b>سامانهٔ رزرو</b><p>موجودیِ تازه و صدورِ بلیت</p>${result(!offline, offline ? "در دسترس نیست؛ رزروِ تازه انجام نمی‌شود." : "در دسترس است؛ عملیاتِ مجاز ممکن است.")}</div></div>`;
        break;
      }
      case "embodiment":
        content = `<div class="embodiment-stages">${[
          ["chat", "متن", "پاسخ را می‌خوانیم."],
          ["wave", "صدا", "با لحن می‌شنویم."],
          ["image", "چهره", "بیان و حرکت را می‌بینیم."],
          ["model", "بدن", "تعاملِ فیزیکی و کنترلِ حرکت اضافه می‌شود."],
        ]
          .map(
            ([i, a, b], n) =>
              `<div class="${n <= step ? "revealed" : ""}">${icon(i)}<h3>${a}</h3><p>${n <= step ? b : "…"}</p></div>`,
          )
          .join("")}</div>`;
        break;
      case "diary-story":
        content = `<div class="diary-story"><div class="story-book"><div class="book-spine"></div><p class="book-user">«آن روز در مدرسه چه شد؟»</p>${step > 0 ? '<p class="book-response">«بگذار نشانت بدهم…»</p>' : ""}${step > 1 ? '<div class="book-portal"><div class="portal-door"></div><span>از نوشته به صحنه</span></div>' : ""}</div><div class="diary-caption">${icon(step > 1 ? "image" : "chat")}<h3>${["یک پرسش می‌نویسیم.", "پاسخ در همان صفحه ظاهر می‌شود.", "گفت‌وگو، ورودیِ یک صحنه می‌شود."][step]}</h3></div></div>`;
        break;
      case "textile":
        content = `<div class="textile-line ${s.factory ? "in-factory" : ""}">${s.factory ? '<div class="factory-roof"><i></i><span>ماشین + سازمان‌دهیِ تازه</span></div>' : ""}${["نخ‌ریسی", "بافندگی", "رنگرزی", "خیاطی"].map((t, i) => `<div class="textile-station">${icon(["wave", "tool", "image", "build"][i])}<b>${t}</b><div class="worker-dots">${"<i></i>".repeat(s.factory ? 1 : 3)}</div></div>`).join("")}</div><div class="textile-output">${icon("receipt")}<span>${s.factory ? "سازمان‌دهیِ متفاوت؛ تولیدِ بیشتر" : "زنجیره‌ای میان افراد و کارگاه‌های پراکنده"}</span><small>نمایشِ مفهومی؛ تعدادِ شکل‌ها آمارِ تاریخی نیست.</small></div>`;
        break;
      case "coach-story":
        content = `<div class="coach-story"><svg viewBox="0 0 700 360" role="img" aria-label="بازیکنان و رابطهٔ اعتماد در تیم"><rect x="10" y="10" width="680" height="340" rx="10" fill="#e5ede7" stroke="#9db6a5"/><path d="M350 10v340" stroke="#9db6a5"/><circle cx="350" cy="180" r="60" fill="none" stroke="#9db6a5"/>${[
          [120, 160],
          [230, 80],
          [230, 270],
          [400, 160],
          [550, 80],
          [550, 270],
        ]
          .map(
            ([x, y], i) =>
              `<path d="M350 180L${x} ${y}" stroke="#d8a447" stroke-width="2" class="team-bond"/><circle cx="${x}" cy="${y}" r="18" fill="#2159dd"/><text x="${x}" y="${y + 6}" fill="white" text-anchor="middle" font-size="16">${F(i + 1)}</text>`,
          )
          .join(
            "",
          )}<circle cx="350" cy="180" r="25" fill="#d8a447"/></svg><div>${panel(
          {
            label: "در رختکن، وقتی تیم عقب است",
            kind: "chat",
            rows: [
              ["بازیکن", "برنامه را می‌دانم؛ اما اعتمادم را از دست داده‌ام."],
              ["سرمربی", "نقشِ تو روشن است؛ تیم به تو تکیه می‌کند."],
            ],
          },
        )}</div></div>`;
        break;
      case "stamp-story":
        content = `<div class="stamp-story"><div class="expert-paper"><span class="rx">Rx</span><h3>گزارشِ تخصصی</h3><div class="paper-line"></div><div class="paper-line"></div><div class="paper-line"></div><div class="expert-seal">تأییدِ انسان</div></div><div class="institution-flow">${s.future ? `<div>${icon("receipt")}کارِ آماده و ارزان‌تر</div><span>↓</span><div>${icon("build")}رقابتِ بیشتر بر سرِ بررسی و امضا</div><span>↓</span><div>${icon("edit")}فشار بر قیمت و تغییرِ قواعدِ پذیرش</div>` : `<div>${icon("file")}کارِ تخصصی آماده می‌شود.</div><span>↓</span><div>${icon("check")}صاحبِ صلاحیت بررسی و تأیید می‌کند.</div><span>↓</span><div>${icon("receipt")}نهاد طبق قواعدش می‌پذیرد.</div>`}</div></div>`;
        break;
      case "closing":
        content = `<div class="closing-story"><div class="closing-ticket"><small>از خواستن تا انجام‌شدن</small><strong>یک سفر.<br>یک خدمتِ مفید.</strong>${icon("receipt")}</div><div class="closing-steps">${[
          ["plan", "کار را روشن کنیم."],
          ["tool", "ابزارش را بسازیم."],
          ["lock", "اختیارش را محدود کنیم."],
          ["check", "نتیجه‌اش را بیازماییم."],
        ]
          .map(([i, t]) => `<div>${icon(i)}<span>${t}</span></div>`)
          .join("")}</div></div>`;
        break;
      default:
        throw new Error("Unknown teaching scene: " + s.kind);
    }
    return `<div class="story-root" data-story-kind="${E(s.kind)}"><div class="story-visual">${content}</div>${frames(s) ? `<div class="story-sequence"><span dir="ltr">${F(step + 1)} / ${F(frames(s))}</span>${button("next", "گام بعد ←")}${button("reset", "از ابتدا")}</div>` : ""}<div class="story-point">${E(note)}</div></div>`;
  }
  function act(s, action, state) {
    if (window.Journeys?.handles(s.kind)) return Journeys.act(s, action, state);
    if (window.Lessons?.handles(s.kind)) return Lessons.act(s, action, state);
    let n = { ...state };
    if (action === "reset") return {};
    if (action === "context") n.context = !n.context;
    if (action === "retrieve") n.retrieved = true;
    if (action === "cost-more") n.calls = Math.min(12, (n.calls || 1) + 1);
    if (action.startsWith("timeout-")) n.timeout = action.slice(8);
    if (action === "budget-step") {
      if ((n.steps || 0) < 5) n.steps = (n.steps || 0) + 1;
      else n.limit = true;
    }
    if (
      ["execute", "model-execute", "approve", "consent", "change"].includes(
        action,
      )
    )
      n = permission(s.mode, n, action);
    if (action === "identity-own") n.foreign = false;
    if (action === "identity-foreign") n.foreign = true;
    if (action === "secret-booking") {
      n.sink = "booking";
      n.checked = false;
    }
    if (action === "secret-ads") {
      n.sink = "ads";
      n.checked = false;
    }
    if (action === "secret-owner") {
      n.owner = n.owner === "U-42" ? "U-17" : "U-42";
      n.checked = false;
    }
    if (action === "secret-check") n.checked = true;
    if (action === "connection") n.online = !n.online;
    if (action === "internet") n.offline = !(n.offline ?? !!s.offline);
    return n;
  }
  window.Story = {
    render,
    act,
    frames,
    secretCheck,
    permission,
    scopeBookings,
  };
})();
