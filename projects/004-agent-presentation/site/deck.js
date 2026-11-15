(() => {
  "use strict";
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const e = (s) =>
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
  const fa = (n) => String(n).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const pair = (s) => String(s).split("|");
  const stage = $("#stage"),
    states = new Map();
  stage.setAttribute("tabindex", "-1");
  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("close", () =>
      stage.focus({ preventScroll: true }),
    );
    dialog.addEventListener("cancel", (ev) => {
      ev.preventDefault();
      dialog.close();
      stage.focus({ preventScroll: true });
    });
  });
  let current = 0;
  const pages = [];
  let lastGroup = "";
  SLIDES.forEach((s) => {
    if (s.g !== lastGroup) {
      const map = { map: true, g: s.g, part: s.part, id: "map-" + s.g };
      if (s.id === 1) {
        pages.push(s, map);
        lastGroup = s.g;
        return;
      }
      pages.push(map);
      lastGroup = s.g;
    }
    pages.push(s);
  });
  const step = (s) => states.get(s.id)?.step ?? s.start ?? 0;
  const parts = () =>
    PARTS.map((p, i) => `<span>${fa(i + 1)} — ${e(p)}</span>`).join("");
  function columns(items, cls = "") {
    return `<div class="column-grid ${cls}" style="--columns:${Math.min(items.length, 4)}">${items
      .map((x, i) => {
        const [a, b] = pair(x);
        return `<div class="column"><span class="index">${fa(i + 1).padStart(2, "۰")}</span><h3>${e(a)}</h3><p>${e(b)}</p></div>`;
      })
      .join("")}</div>`;
  }
  function compare(s) {
    return `<div class="compare">${s.items
      .map((x, i) => {
        const [a, b] = pair(x);
        return `<div><div class="tag">${fa(i + 1).padStart(2, "۰")}</div><h3>${e(a)}</h3><p>${e(b)}</p>${s.answers ? `<div class="answer">${e(s.answers[i])}</div>` : ""}</div>`;
      })
      .join("")}</div>`;
  }
  function flow(s) {
    return `<div class="flow">${s.items
      .map((x, i) => {
        const [a, b] = pair(x);
        return `${i ? '<span class="flow-arrow">←</span>' : ""}<div class="flow-node"><div class="num">${fa(i + 1).padStart(2, "۰")}</div><h3>${e(a)}</h3><p>${e(b)}</p></div>`;
      })
      .join("")}</div>`;
  }
  function toolbar(s, n) {
    const waiting =
      (s.type === "confirmation" && s.mode === "hard" && step(s) === 1) ||
      (s.type === "travel" && [3, 4].includes(step(s)));
    return `<div class="demo-toolbar"><button data-demo="next" ${waiting ? "disabled" : ""}>${waiting ? (s.type === "travel" && step(s) === 3 ? "منتظر انتخاب" : "منتظر تأیید") : "گام بعد ←"}</button><button data-demo="reset" class="secondary">از نو</button><span>${fa(step(s) + 1)} / ${fa(n)}</span></div><div class="demo-notice">نمونهٔ آموزشی · اجرا در همین صفحه</div>`;
  }
  const ticketURLs = new Map();
  function ticketURL(plan, kind) {
    const key = plan + "-" + kind;
    if (!ticketURLs.has(key)) {
      const bytes = Uint8Array.from(atob(DEMO_TICKETS[plan][kind]), (c) =>
        c.charCodeAt(0),
      );
      ticketURLs.set(
        key,
        URL.createObjectURL(new Blob([bytes], { type: "application/pdf" })),
      );
    }
    return ticketURLs.get(key);
  }
  const neural = {
    net: new Learning.TinyNet(),
    input: [...Learning.dataset[6].x],
    label: 1,
    busy: false,
    token: 0,
  };
  let temperatureValue = 1;
  const sampledWords = [];
  const words = ["تهران", "اصفهان", "شیراز", "تبریز"];
  const baseProbs = [0.91, 0.04, 0.03, 0.02];
  const plans = {
    a: {
      name: "اول",
      hotel: "آفتاب",
      out: "پنجشنبه ۷ صبح",
      arrive: "پنجشنبه ۱۹",
      back: "جمعه ۱۰ صبح",
      home: "جمعه ۲۲",
      total: "۶٬۲۰۰٬۰۰۰",
      fare: "۱٬۶۰۰٬۰۰۰",
      room: "۳٬۰۰۰٬۰۰۰",
    },
    b: {
      name: "دوم",
      hotel: "سپیدار",
      out: "پنجشنبه ۸ صبح",
      arrive: "پنجشنبه ۲۰",
      back: "جمعه ۱۱ صبح",
      home: "جمعه ۲۳",
      total: "۷٬۴۰۰٬۰۰۰",
      fare: "۲٬۰۰۰٬۰۰۰",
      room: "۳٬۴۰۰٬۰۰۰",
    },
  };
  function pixelGrid(editable = false) {
    return `<div class="pixel-grid" role="group" aria-label="تصویر ورودیِ پنج در پنج">${neural.input.map((v, i) => (editable ? `<button data-pixel="${i}" aria-label="خانهٔ ${fa(i + 1)}" aria-pressed="${!!v}" class="pixel ${v ? "filled" : ""}"></button>` : `<i class="pixel ${v ? "filled" : ""}"></i>`)).join("")}</div>`;
  }
  function earlyAI(s) {
    return `<div class="early-ai">${s.items
      .map((x, i) => {
        const [a, b] = pair(x);
        return `<div class="early-example"><div class="early-symbol">${["۷", "✉", "◉"][i]}</div><h3>${a}</h3><p>${b}</p></div>`;
      })
      .join("")}</div>`;
  }
  function digitTask(s) {
    return `<div class="digit-example"><div class="digit-input"><div class="state-label">این تصویر را به برنامه می‌دهیم</div>${pixelGrid()}<p class="caption">۲۵ خانه؛ هر خانه روشن یا خاموش</p></div><span class="big-arrow">←</span><div class="digit-machine"><div class="model-gauge">؟</div><h3>مدلِ تشخیص رقم</h3></div><span class="big-arrow">←</span><div><div class="state-label">این پاسخ را می‌خواهیم</div><div class="digit-answer">${fa(neural.label)}</div><p class="lead">«این تصویر، رقم ${fa(neural.label)} است.»</p></div></div><p class="caption digit-bottom">${s.type === "digit-io" ? "ورودی یعنی داده‌ای که به مدل می‌دهیم؛ خروجی یعنی پیش‌بینی‌ای که از آن می‌گیریم." : "کار را کوچک کرده‌ایم تا بتوانیم یادگرفتنش را ببینیم."}</p>`;
  }
  function networkSVG() {
    const f = neural.net.forward(neural.input);
    let links = "",
      nodes = "";
    neural.net.w1.forEach((row, j) =>
      row.forEach((weight, i) => {
        links += `<line x1="560" y1="${14 + i * 12.5}" x2="310" y2="${55 + j * 80}" stroke="${weight < 0 ? "#b58155" : "#2159dd"}" stroke-width="${0.5 + Math.min(3, Math.abs(weight) * 1.7)}" opacity="${0.1 + Math.min(0.5, Math.abs(weight) * 0.3)}" stroke-dasharray="${weight < 0 ? "5 3" : "none"}" data-weight-value="${weight}"/>`;
      }),
    );
    neural.net.w2.forEach((row, k) =>
      row.forEach((weight, j) => {
        const selected = k === 1 && j === 0;
        links += `<line x1="310" y1="${55 + j * 80}" x2="75" y2="${115 + k * 110}" stroke="${selected ? "#c28b26" : weight < 0 ? "#b58155" : "#2159dd"}" stroke-width="${selected ? 1.5 + Math.min(7, Math.abs(weight) * 2.2) : 1 + Math.min(5, Math.abs(weight) * 2)}" opacity="${selected ? 1 : 0.35}" data-selected-weight="${selected}" stroke-dasharray="${weight < 0 ? "5 3" : "none"}" data-weight-value="${weight}"/>`;
      }),
    );
    neural.input.forEach(
      (v, i) =>
        (nodes += `<circle cx="560" cy="${14 + i * 12.5}" r="4" fill="${v ? "#142536" : "#e1e3df"}"/>`),
    );
    f.hidden.forEach(
      (a, j) =>
        (nodes += `<circle cx="310" cy="${55 + j * 80}" r="21" fill="rgba(33,89,221,${0.08 + 0.5 * a})" stroke="#2159dd" stroke-width="2"/>`),
    );
    f.probs.forEach(
      (p, k) =>
        (nodes += `<circle cx="75" cy="${115 + k * 110}" r="26" fill="${p > 0.5 ? "#2159dd" : "#e5ecfb"}" stroke="#2159dd" stroke-width="2"/><text x="75" y="${125 + k * 110}" class="nn-output-label" fill="${p > 0.5 ? "white" : "#142536"}">${fa(k)}</text>`),
    );
    return `<svg viewBox="0 0 600 355" role="img" aria-label="شبکهٔ واقعی این مثال؛ ۲۵ ورودی، چهار نورون میانی و دو خروجی">${links}${nodes}<text x="550" y="350" class="nn-layer-label">۲۵ ورودی</text><text x="310" y="350" class="nn-layer-label">لایهٔ میانی</text><text x="75" y="350" class="nn-layer-label">دو خروجی</text></svg>`;
  }
  function predictionHTML() {
    const { probs } = neural.net.forward(neural.input);
    const guess = probs[1] > probs[0] ? 1 : 0;
    return `<div class="state-label">حدسِ فعلیِ مدل</div><div class="nn-guess ${guess === neural.label ? "correct" : "wrong"}" data-prediction="${guess}">${fa(guess)}</div>${probs.map((p, k) => `<div class="nn-prob"><span>احتمال ${fa(k)}</span><strong data-prob="${p}">${fa((p * 100).toFixed(1))}٪</strong><i style="--value:${p * 100}%"></i></div>`).join("")}<p class="caption">پاسخ درستِ این نمونه: <b>${fa(neural.label)}</b></p>`;
  }
  function neuralMetrics() {
    const loss = neural.net.loss(),
      weight = neural.net.w2[1][0];
    return `<div><span>گام‌های آموزش</span><b data-epochs>${fa(neural.net.epochs)}</b></div><div><span>خطای مدل در ۱۲ نمونه</span><b class="latin" data-loss="${loss}">${loss.toFixed(3)}</b></div><div><span>وزنِ اتصال طلایی</span><b class="latin" data-live-weight>${weight.toFixed(3)}</b></div>`;
  }
  function learning(s) {
    return `<div class="learning-demo ${neural.busy ? "training" : ""}" data-learning-root><div class="nn-main"><div class="nn-input"><div class="state-label">ورودی: تصویرِ رقم</div>${pixelGrid(true)}<div class="digit-select"><button data-digit="0">تصویر ۰</button><button data-digit="1">تصویر ۱</button></div><p class="caption">روی خانه‌ها بزنید تا تصویر عوض شود.</p></div><div class="nn-diagram">${networkSVG()}</div><div class="nn-result">${predictionHTML()}</div></div><div class="nn-metrics">${neuralMetrics()}</div><div class="learning-controls">${s.manual ? `<label class="manual-weight">وزنِ اتصال طلایی <input type="range" aria-label="وزن اتصال طلایی" data-manual-weight min="-4" max="4" step=".05" value="${neural.net.w2[1][0]}"></label><span class="caption">تغییر دستی، آموزش نیست. خط‌چین: وزن منفی.</span>` : `<button data-train="1">یک گام آموزش</button><button data-train="20">۲۰ گام آموزش</button><span class="caption">تصویر + پاسخ درست → محاسبهٔ خطا → تغییر وزن‌ها</span>`}<button data-neural-reset class="secondary">از ابتدا</button></div><p class="caption nn-footnote">مدلِ کوچکِ محلی، فقط برای همین دو رقم؛ اعداد، خط‌ها و پیش‌بینی‌ها از یک محاسبه می‌آیند.</p></div>`;
  }
  function refreshNeural() {
    const root = $(".slide.active [data-learning-root]");
    if (!root) return;
    root.classList.toggle("training", neural.busy);
    root.querySelector(".nn-diagram").innerHTML = networkSVG();
    root.querySelector(".nn-result").innerHTML = predictionHTML();
    root.querySelector(".nn-metrics").innerHTML = neuralMetrics();
    root
      .querySelectorAll("[data-train], [data-digit], [data-pixel]")
      .forEach((b) => (b.disabled = neural.busy));
  }
  async function trainNeural(n) {
    if (neural.busy) return;
    neural.busy = true;
    const token = ++neural.token;
    for (let i = 0; i < n; i++) {
      if (token !== neural.token) return;
      neural.net.train();
      refreshNeural();
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
        await new Promise((resolve) => setTimeout(resolve, 65));
    }
    if (token === neural.token) {
      neural.busy = false;
      refreshNeural();
    }
  }
  function candidateBars(s) {
    const p = Learning.temperature(
      baseProbs,
      s.temperature ? temperatureValue : 1,
    );
    return p
      .map(
        (prob, i) =>
          `<div class="candidate-row"><strong>${words[i]}</strong><div class="candidate-track"><i style="width:${prob * 100}%"></i></div><b class="latin" data-probability="${prob}">${(prob * 100).toFixed(1)}%</b></div>`,
      )
      .join("");
  }
  function probabilities(s) {
    return `<div class="probability-demo"><div class="sentence-prompt">پایتخت ایران شهرِ <span>…</span></div><div class="candidate-bars">${candidateBars(s)}</div><div class="temperature-controls">${s.temperature ? `<label>دما <input type="range" data-temperature aria-label="دما" min=".25" max="2.5" step=".05" value="${temperatureValue}"><b class="latin" data-temperature-value>${temperatureValue.toFixed(2)}</b></label>` : ""}<button data-sample-word>یک انتخاب انجام بده</button><div class="sample-output" aria-live="polite">${sampledWords.length ? "این بار: " + words[sampledWords[sampledWords.length - 1]] : "هنوز انتخاب نکرده‌ایم."}</div></div><div class="sample-history">${sampledWords
      .slice(-12)
      .map((i) => `<span>${words[i]}</span>`)
      .join(
        "",
      )}</div><p class="caption">اعدادِ نمایشی برای توضیح مفهوم؛ دما، درستیِ اطلاعات را تضمین نمی‌کند.</p></div>`;
  }
  function advice() {
    return `<div class="advice-layout"><div class="advice-conversation"><div class="bubble user">پنجشنبه می‌خواهم بروم مشهد و جمعه برگردم. بلیت و هتل را هماهنگ کن.</div><div class="bubble">برای این سفر می‌توانی اول قیمت قطارها را در یک سامانهٔ سفر مقایسه کنی. بعد هتلی با قیمت مناسب پیدا کن و بلیت و اتاق را رزرو کن.</div></div><div class="advice-result"><div class="empty-ticket"><span>بلیطِ سفر</span><strong>هنوز رزرو نشده</strong></div><p class="lead">راهنمایی گرفتیم.<br>جستجو و رزرو هنوز با خودمان است.</p><p class="caption">حالا ببینیم همان درخواست، با یک ایجنت چگونه پیش می‌رود.</p></div></div>`;
  }
  function travel(s) {
    const st = step(s),
      planKey = states.get(s.id)?.plan || "a",
      p = plans[planKey];
    const messages = [
      [
        "user",
        "پنجشنبه می‌خواهم بروم مشهد و جمعه برگردم. بلیت و هتل را هماهنگ کن.",
      ],
      [
        "agent",
        "برای چند نفر؟ حدود بودجه‌ات چقدر است؟ قطار را ترجیح می‌دهی یا هواپیما؟",
      ],
      [
        "user",
        "یک نفر، قطار. برای رفت‌وبرگشت و یک شب هتل، تا هشت میلیون تومان.",
      ],
      ["agent", "پنجشنبه صبح حرکت کنی و جمعه شب به تهران برسی مناسب است؟"],
      ["user", "بله، همین برنامه خوب است."],
      [
        "agent",
        "این دو گزینه در بودجه‌ات جا می‌گیرند. قیمت‌ها را همراه ساعت رفت‌وبرگشت و یک شب اقامت ببین:",
      ],
      ["options", ""],
      ["user", `گزینهٔ ${p.name} را می‌خواهم.`],
      [
        "agent",
        `رفت ${p.out}، رسیدن ${p.arrive}؛ برگشت ${p.back}، رسیدن تهران ${p.home}؛ یک شب هتل ${p.hotel}؛ جمعاً ${p.total} تومان. همین برنامه را رزرو کنم؟`,
      ],
      ["user", "بله، همین برنامه و همین مبلغ را رزرو کن."],
      [
        "agent",
        "رزرو انجام شد. بلیط رفت، بلیط برگشت و واچر هتل را از پایین دریافت کن.",
      ],
    ];
    const limits = [2, 4, 5, 7, 9, 10, 11];
    const rows = messages
      .slice(0, limits[st])
      .map(([role, text]) =>
        role === "options"
          ? `<div class="trip-options">${Object.entries(plans)
              .map(
                ([key, pl]) =>
                  `<button class="trip-option" data-plan="${key}" ${st !== 3 ? "disabled" : ""}><b>گزینهٔ ${pl.name} · ${pl.total} تومان</b><span>رفت: ${pl.out} · رسیدن: ${pl.arrive}</span><span>برگشت: ${pl.back} · تهران: ${pl.home}</span><span>هتل ${pl.hotel} · یک شب</span><small>${st === 3 ? "این گزینه را انتخاب کن" : "برنامهٔ نمونه"}</small></button>`,
              )
              .join("")}</div>`
          : `<div class="bubble ${role === "user" ? "user" : ""}">${e(text)}</div>`,
      )
      .join("");
    const downloads =
      st === 6
        ? `<div class="trip-downloads">${[
            ["outbound", "بلیط رفت"],
            ["return", "بلیط برگشت"],
            ["hotel", "واچر هتل"],
          ]
            .map(
              ([file, label]) =>
                `<a href="${ticketURL(planKey, file)}" download="${planKey}-${file}.pdf">${label} ↓</a>`,
            )
            .join("")}</div>`
        : "";
    const [head, copy] = pair(s.steps[st]);
    return `<div class="demo-body travel-layout"><div class="travel-explainer"><div class="eyebrow">${fa(s.g)} · از خواستن تا انجام‌شدن</div><h2>${e(s.title)}</h2><div class="rule"></div><div class="state-label">${fa(st + 1)} — ${head}</div><h3>${e(copy)}</h3><p class="lead">${st === 3 ? "یکی از گزینه‌ها را در گفت‌وگو انتخاب کنید." : st === 4 ? "خلاصهٔ دقیق را بخوانید؛ سپس دکمهٔ تأیید را بزنید." : st === 6 ? "اکنون نتیجه‌ای داریم که می‌توانیم بازش کنیم و ببینیم." : "گفت‌وگو با پاسخ‌های واقعیِ کاربر جلو می‌رود."}</p><p class="caption">مبالغ، هتل‌ها و مدارک، نمونهٔ آموزشی‌اند.</p></div><div class="phone travel-phone"><div class="phone-top"><span class="avatar">ا</span>دستیار سفر <small>نمونهٔ آموزشی</small></div><div class="conversation">${rows}${st === 4 ? '<button class="travel-approve" data-travel-approve>بله، رزرو کن</button>' : ""}${downloads}</div></div></div>${toolbar(s, 7)}`;
  }
  function hero() {
    return `<div class="hero-layout"><div class="hero-copy"><div class="eyebrow">ایجنت</div><h1>برایم<br>سفر بچین.</h1><div class="rule"></div><p class="lead">پنجشنبه مشهد باشم؛ جمعه برگردم.<br>بلیت و هتل را هم هماهنگ کن.</p><div class="mini">از خواستن تا انجام‌شدن</div></div><div class="hero-art"><div class="dot-grid"></div><div class="orbit"></div><div class="orbit second"></div><div class="floating-label one">پنجشنبه · رفت</div><div class="travel-card"><div class="caption">یک خواسته، چند کار</div><div class="destination">تهران<br><span class="accent">مشهد</span></div><svg viewBox="0 0 260 90" aria-hidden="true"><path d="M15 55 C75 55 55 15 135 40 S190 85 245 30" stroke="#2159dd" stroke-width="2" fill="none" stroke-dasharray="5 6"/><circle cx="15" cy="55" r="6" fill="#2159dd"/><circle cx="245" cy="30" r="6" fill="#d8a447"/></svg><div class="ticket-line"><span>بلیت</span><span>هتل</span><span>هماهنگی</span></div></div><div class="floating-label two">جمعه · برگشت</div></div></div>`;
  }
  function renderRouteOverview() {
    return `<div class="column-grid" style="--columns:${PARTS.length}">${PARTS.map((x, i) => `<div class="column"><span class="big-number accent">${fa(i + 1)}</span><h3>${e(x)}</h3></div>`).join("")}</div>`;
  }
  function context() {
    return `<div class="context-window"><div class="context-stack">${[
      "دستورها|کمک به برنامه‌ریزی و رزروِ مجازِ سفر|210",
      "گفت‌وگو|«تا هشت میلیون، قطار را ترجیح می‌دهم.»|260",
      "رزروِ فعلی|مشهد؛ برگشت جمعه، رسیدن تا ساعت ۲۲|260",
      "نتیجهٔ جستجو|گزینه‌های تازهٔ برگشت با قیمت و ساعت|300",
    ]
      .map((x) => {
        const [a, b, h] = pair(x);
        return `<div class="context-block" style="--height:${h}px"><h3>${a}</h3><p>${b}</p></div>`;
      })
      .join(
        "",
      )}</div></div><p class="caption" style="margin-top:20px">زمینه محدود است؛ انتخاب و کوتاه‌سازی آن بخشی از کار هارنس است.</p>`;
  }
  function rag(s) {
    return `<div class="split"><div><div class="source-doc"><div class="caption">${s.private ? "آیین‌نامهٔ داخلی سازمان" : "منبع مجاز سازمان"}</div><h3>قواعد تغییر رزرو</h3><div class="doc-lines"><i></i><i style="--w:75%"></i><i class="selected">تغییر تاریخ تا پیش از صدور نهایی، طبق شرایط خدمت انجام می‌شود.</i><i style="--w:87%"></i><i style="--w:60%"></i></div></div></div><div><div class="state-label">بازیابی → افزودن به زمینه → پاسخ</div><h3>«می‌توانم تاریخ سفر را عوض کنم؟»</h3><p class="lead">قسمت مرتبطِ سند، همراهِ پرسش به مدل می‌رسد. پاسخ باید با همان منبع سازگار باشد.</p><p class="caption">RAG · Retrieval-Augmented Generation</p></div></div>`;
  }
  function providers(s) {
    return `<div class="provider-grid">${s.items
      .map((x) => {
        const [a, b] = pair(x);
        return `<div class="provider"><div class="monogram">${e(a[0])}</div><strong>${e(a)}</strong><p dir="ltr">${e(b)}</p></div>`;
      })
      .join("")}</div>`;
  }
  function pricing(s) {
    return `<div class="pricing"><div><div class="product-name">${e(s.product)}</div><div class="rule"></div><p class="lead">${e(s.detail)}</p></div><div class="plan-list">${s.plans
      .map((x) => {
        const [a, b, c] = pair(x);
        return `<div class="plan-row"><div><strong>${e(a)}</strong><small>${e(c)}</small></div><span class="price">${e(b)}</span></div>`;
      })
      .join(
        "",
      )}<p class="caption" style="margin-top:20px">بررسی طرح‌ها: ۴ نوامبر ۲۰۲۶ · سقف مصرف و شرایط حساب را هم ببینیم.</p></div></div>`;
  }
  function mistake(s) {
    return `<div class="mistake"><div class="mistake-card"><div class="label">خروجی مسئله‌دار</div><p>${e(s.bad).replace(/\n/g, "<br>")}</p><small>${e(s.badNote)}</small></div><div class="mistake-card good"><div class="label">خروجی مورد انتظار</div><p>${e(s.good)}</p><small>${e(s.goodNote)}</small></div></div>`;
  }
  function runBookingExample(guard) {
    const byRequest = new Map();
    const bookings = [];
    function reserve(requestId) {
      if (guard && byRequest.has(requestId)) return byRequest.get(requestId);
      const booking = { id: "DEMO-" + (bookings.length + 1), requestId };
      bookings.push(booking);
      byRequest.set(requestId, booking);
      return booking;
    }
    const first = reserve("R-124"),
      second = reserve("R-124");
    return {
      first: first.id,
      second: second.id,
      count: bookings.length,
      passed: first.id === second.id && bookings.length === 1,
    };
  }
  function tests(s) {
    return `<div class="mechanical-test"><div><h3>دو درخواستِ یکسان؛ چند رزرو؟</h3><p class="lead">اگر پاسخِ بار اول دیر برسد و درخواست را دوباره بفرستیم، نباید یک رزرو دیگر ساخته شود.</p><div class="mechanical-controls"><button data-run-booking-test>آزمون را اجرا کن</button><label><input type="checkbox" data-disable-dedup>کنترل تکرار را خاموش کن</label></div><p class="caption" style="margin-top:25px">این دکمه، دو درخواست را به یک تابعِ محلی می‌فرستد و نتیجه را می‌سنجد.</p></div><div class="mechanical-output" aria-live="polite"><div class="test-label">نتیجهٔ اجرا</div><p>هنوز آزمون اجرا نشده است.</p></div></div>`;
  }
  function policies() {
    return `<div class="policy-grid">${[
      [
        "direct",
        "اجرای مستقیم",
        "اجازهٔ اجرا در ابزار مدل وجود دارد.",
        "انجام کارِ مجاز بدون پرسش اضافه",
      ],
      [
        "soft",
        "تأیید نرم",
        "اجازهٔ اجرا وجود دارد؛ مدل باید اول بپرسد.",
        "وابسته به رعایت دستور گفت‌وگو",
      ],
      [
        "hard",
        "تأیید سخت",
        "مدل فقط پیشنهاد می‌دهد.",
        "اجرا پس از تأیید مستقلِ معتبر",
      ],
    ]
      .map(
        ([c, a, b, d], i) =>
          `<div class="policy ${c}"><div class="policy-icon">${["↗", "↔", "⌑"][i]}</div><h3>${a}</h3><div class="authority">${b}</div><p class="caption">${d}</p></div>`,
      )
      .join("")}</div>`;
  }
  function confirmation(s) {
    const st = step(s),
      mode = s.mode;
    const hard = mode === "hard",
      soft = mode === "soft";
    const heads = hard
      ? [
          "مدل فقط پیشنهاد می‌دهد.",
          "هارنس جزئیات را نمایش می‌دهد.",
          "کاربرِ معتبر همان کار را تأیید می‌کند.",
          "هارنس یک‌بار اجرا می‌کند.",
        ]
      : soft
        ? [
            "مدل ابزار اجرا را دارد.",
            "پیش از اجرا، در متن می‌پرسد.",
            "پاسخ کاربر را دریافت می‌کند.",
            "مدل ابزارِ مستقیم را فراخوانی می‌کند.",
          ]
        : [
            "درخواست کاربر دریافت می‌شود.",
            "ابزارِ مجاز انتخاب می‌شود.",
            "هارنس قواعد کار را بررسی می‌کند.",
            "عملیات مستقیم انجام می‌شود.",
          ];
    return `<div class="demo-body split"><div class="demo-story"><div class="state-label">${hard ? "پیشنهاد → مجوز → اجرا" : soft ? "پرسش → انتظار → اجرا" : "درخواست → بررسی → اجرا"}</div><div class="step-head">${heads[st]}</div><p class="step-copy">${hard ? "مدل ابزارِ دورزدن تأیید را در اختیار ندارد." : soft ? "اگر مدل پرسش را رعایت نکند، مرز مستقلِ تأیید نداریم." : "بدون تأیید اضافه؛ در همان محدودهٔ ازپیش‌تعیین‌شده."}</p></div><div class="phone"><div class="phone-top"><span class="avatar">ا</span>دستیار ثبت‌نام</div><div class="conversation"><div class="bubble user">${hard ? "رزرو من را لغو کن." : soft ? "نام نمایشی مرا تغییر بده." : "یک پیش‌نویس ثبت‌نام بساز."}</div>${st > 0 ? `<div class="bubble">${hard ? "لغو همین رزرو را تأیید می‌کنی؟" : soft ? "نام نمایشی به «سارا» تغییر کند؟" : "پیش‌نویس با اطلاعات مجاز آماده می‌شود."}</div>` : ""}${hard && st === 1 ? '<div class="bubble system">رزرو ۱۲۴ · لغو همین رزرو<button class="approve" data-hard-approve>تأیید لغو</button></div>' : ""}${st > 1 ? `<div class="bubble ${hard ? "system" : "user"}">${hard ? "تأیید معتبر در مسیر هارنس" : soft ? "بله، تغییر بده." : "قواعد کسب‌وکار برقرار است."}</div>` : ""}${st > 2 ? '<div class="bubble system">عملیات انجام شد.</div>' : ""}</div></div></div>${toolbar(s, 4)}`;
  }
  function loop(s) {
    const st = step(s);
    const labels = [
      "کاربر درخواست سفر را می‌فرستد.",
      "هارنس زمینه را آماده می‌کند.",
      "مدل گام بعد را پیشنهاد می‌دهد.",
      "هارنس ابزار مجاز را اجرا می‌کند.",
      "نتیجه به زمینه برمی‌گردد.",
      "مدل پاسخ می‌دهد یا کار ادامه می‌یابد.",
    ];
    const nodes = [
      [170, 180, "کاربر", "آغاز کار"],
      [620, 90, "مدل", "تفسیر و پیشنهاد"],
      [620, 290, "هارنس", "زمینه و کنترل"],
      [1090, 180, "سرویس", "اجرای کار"],
    ];
    return `<div class="demo-body"><div class="loop-canvas"><svg viewBox="0 0 1250 390" role="img" aria-label="حلقهٔ تعامل کاربر، هارنس، مدل و سرویس"><defs><marker id="loop-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8" fill="#869bb0"/></marker></defs><path class="wire" marker-end="url(#loop-arrow)" d="M280 180 C400 180 400 290 510 290"/><path class="wire" marker-end="url(#loop-arrow)" d="M600 235 L600 145"/><path class="wire" marker-end="url(#loop-arrow)" d="M640 145 L640 235"/><path class="wire" marker-end="url(#loop-arrow)" d="M730 290 C880 290 880 180 980 180"/><path class="wire" marker-end="url(#loop-arrow)" d="M980 200 C850 200 870 315 730 315"/><path class="wire" marker-end="url(#loop-arrow)" d="M510 270 C350 270 350 210 280 210"/>${nodes.map(([x, y, a, b], i) => `<g class="loop-node ${[0, 2, 1, 3, 2, 1][st] === i ? "active-node" : ""}"><rect class="node-bg" x="${x - 110}" y="${y - 48}" width="220" height="96" rx="12"/><text x="${x}" y="${y - 8}">${a}</text><text class="small" x="${x}" y="${y + 25}">${b}</text></g>`).join("")}<circle class="packet" r="7"><animateMotion dur="2.4s" repeatCount="indefinite" path="${["M280 180 C400 180 400 290 510 290", "M600 235 L600 145", "M640 145 L640 235", "M730 290 C880 290 880 180 980 180", "M980 200 C850 200 870 315 730 315", "M510 270 C350 270 350 210 280 210"][st]}"/></circle></svg><div class="loop-status">${labels[st]}</div></div></div>${toolbar(s, 6)}`;
  }
  function identity(s) {
    return `<div class="split"><div><div class="code-block">get_my_history()<br><br><span class="key">ExecutionContext</span><br>  caller = verified_user<br>  scope  = caller.records</div></div><div><div class="state-label">${s.attack ? "درخواست دسترسی به حساب دیگر" : "هویت از مسیر معتبر"}</div><h3>${s.attack ? "شناسهٔ متن، صاحب حساب را عوض نمی‌کند." : "مدل شناسهٔ صاحب داده را انتخاب نمی‌کند."}</h3><p class="lead">هارنس درخواست را به حسابِ احراز هویت‌شده محدود می‌کند.</p><span class="status-pill ${s.attack ? "denied" : ""}">${s.attack ? "دسترسی به حساب دیگر: رد شد" : "محدوده: دادهٔ همین کاربر"}</span></div></div>`;
  }
  function secret(s) {
    const st = step(s),
      bad = states.get(s.id)?.bad ?? !!s.attack;
    const raw = "09120000000";
    const model = st >= 1 ? "h_phone_7f2a" : "—";
    const sink = st >= 4 && !bad ? raw : st >= 3 && bad ? "DENIED" : "—";
    return `<div class="demo-body"><div class="secret-diagram"><div class="secret-zone"><h3>کاربر و خزانهٔ هارنس</h3><span class="secret-value">${raw}</span><small>مالک شماره از زمینهٔ معتبر مشخص است.</small></div><div class="secret-zone model"><h3>آنچه مدل می‌بیند</h3><span class="secret-value">${model}</span><small>${st >= 2 ? "reserve(phone=HandleRef)" : "متن پاک‌سازی‌شده و شناسهٔ ارجاع"}</small></div><div class="secret-zone"><h3>${bad ? "سرویس تبلیغات" : "سرویس رزرو مجاز"}</h3><span class="secret-value">${sink}</span><small>${st >= 3 ? (bad ? "اجازهٔ این ابزار برای دریافت شماره برقرار نیست." : "هم مالک شماره و هم مجوز ابزار بررسی شده‌اند.") : "مقدار واقعی هنوز به سرویس داده نشده است."}</small></div></div><div class="secret-options"><button data-secret="allowed" class="${!bad ? "selected" : ""}">سرویس مجاز</button><button data-secret="denied" class="${bad ? "selected" : ""}">مقصد نامجاز</button></div></div>${toolbar(s, 5)}`;
  }
  function outage(s) {
    const st = step(s);
    const desc = [
      "مدل در دسترس نیست؛ هارنس خطا را تشخیص می‌دهد.",
      "سامانهٔ اصلی می‌تواند یک کلاینت وب یا ربات معمولی هم داشته باشد.",
      "لینکِ مسیر جایگزین فرستاده می‌شود؛ وضعیت معتبر حفظ می‌شود.",
      "مدل برگشته است؛ ادامه از آخرین وضعیت معتبر.",
    ];
    return `<div class="demo-body split"><div class="demo-story"><div class="state-label">${st === 3 ? "اتصال برگشت" : "مدیریتِ وقفه"}</div><div class="step-head">${desc[st]}</div><p class="step-copy">${st < 2 ? "وجود مسیر جایگزین، به نیاز و ماهیت محصول بستگی دارد." : "کار انجام‌شده تکرار نمی‌شود؛ تأییدهای لازم همچنان لازم‌اند."}</p></div><div class="phone"><div class="phone-top"><span class="avatar">ا</span>ایجنت ثبت‌نام</div><div class="conversation"><div class="bubble user">ثبت‌نام من را ادامه بده.</div><div class="bubble">${st === 3 ? "دوباره می‌توانیم همین‌جا ادامه بدهیم." : st === 2 ? "برای ادامه، وارد سامانهٔ ثبت‌نام شوید." : "در حال حاضر دسترسی به مدل برقرار نیست."}</div>${st >= 1 ? '<div class="bubble system">سامانهٔ ثبت‌نام · همان حساب و وضعیت</div>' : ""}${st === 3 ? '<div class="bubble system">رزرو قبلی حفظ شده است.</div>' : ""}</div></div></div>${toolbar(s, 4)}`;
  }
  function os(s) {
    if (s.id === 108)
      return `<div class="split wide"><div><div class="product-name">Cyclon</div><div class="rule"></div><p class="lead">${e(s.detail)}</p><p class="caption">برنامه‌های موجود، با یک رابطِ ایجنت‌محور</p></div><div><img src="assets/cyclon.png" style="width:100%;border-radius:8px;border:1px solid var(--line)" alt="تصویر رسمی Cyclon؛ نمونهٔ رابط و انجام چند کار در پس‌زمینه"><p class="caption" style="margin-top:15px">تصویر معرفی محصول · cyclon.ai</p></div></div>`;
    return `<div class="split"><div><h3>${s.id === 109 ? "خواسته‌ای برای ساختن ابزار" : s.id === 113 ? "بخشی از توان، همین‌جاست" : "یک درخواست، چند کار"}</h3><p class="lead">${e(s.detail || "«برای سفر فردا زنگ بگذار، مسیر را پیدا کن و به همراهم خبر بده.»")}</p><div class="rule"></div><p class="caption">${s.id === 108 ? "Cyclon OS · نمونهٔ زودهنگام و سخت‌افزارِ در حال توسعه" : s.id === 113 ? "دستگاه، سرویس‌های آنلاین و مدل‌ها نقش‌های متفاوتی دارند." : "ابزارها و سرویس‌های مختلف، در پشت یک گفت‌وگو"}</p></div><div class="os-phone"><div class="os-orb"></div><p>چه کاری می‌خواهی<br>انجام شود؟</p><div class="app-icons"><span>↗</span><span>◷</span><span>⌘</span><span>✉</span></div></div></div>`;
  }
  function human() {
    let dots = "";
    for (let y = 40; y < 370; y += 15)
      for (let x = 70; x < 340; x += 15) {
        const head = ((x - 205) / 48) ** 2 + ((y - 80) / 57) ** 2 < 1;
        const torso =
          y > 140 && y < 300 && Math.abs(x - 205) < (y < 220 ? 83 : 68);
        const legs =
          y > 290 && Math.abs(x - 205) > 16 && Math.abs(x - 205) < 65;
        if (head || torso || legs)
          dots += `<circle cx="${x}" cy="${y}" r="${((x + y) % 3) + 2}" style="--i:${x + y}"/>`;
      }
    return `<div class="split"><div><div class="human-figure"><svg viewBox="0 0 410 420" aria-label="پیکرهٔ متحرک از نقاط نور">${dots}</svg></div></div><div><h3>متن → صدا → چهره → حرکت</h3><p class="lead">هر گام، امکانات دیگری برای دیدن، شنیدن و عمل‌کردن می‌خواهد.</p><div class="soundwave">${Array.from({ length: 28 }, (_, i) => `<i style="--i:${i};--h:${20 + ((i * 17) % 65)}px"></i>`).join("")}</div></div></div>`;
  }
  function diary() {
    return `<div class="split"><div class="scene"><div class="book"><div class="book-page"><p style="opacity:.55">یک خاطره…<br>یک پرسش…<br>یک جهان…</p></div><div class="book-page"><p class="ink-line" style="--i:0">آن روز چه اتفاقی افتاد؟</p><p class="ink-line" style="--i:1">بگذار نشانت بدهم…</p><p class="ink-line" style="--i:2">از همین صفحه شروع می‌کنیم.</p><div class="ink-glow"></div></div></div></div><div><div class="eyebrow">دفترچهٔ ریدل</div><h3>نوشتن، پاسخ‌گرفتن،<br>و واردشدن به یک صحنه</h3><p class="lead">یک شیء معمولی می‌تواند رابطِ یک ایجنت و درگاهِ یک تجربه باشد.</p></div></div>`;
  }
  function industry(s) {
    const factory = s.mode === "factory";
    return `<div class="factory-art"><svg viewBox="0 0 1300 410" aria-label="تغییر زنجیرهٔ نساجی با صنعت">${
      factory
        ? `<path d="M430 290V150L540 190V140L650 180V130L800 190V290Z" fill="#dce5ed" stroke="#142536" stroke-width="3"/><rect x="725" y="70" width="38" height="100" fill="#2159dd"/><rect x="465" y="220" width="60" height="70" fill="#2159dd"/><rect x="565" y="220" width="60" height="70" fill="#2159dd"/><rect x="665" y="220" width="60" height="70" fill="#2159dd"/><path class="thread" d="M110 240H425M810 240H1160"/><text x="235" y="200">مواد اولیه</text><text x="650" y="350">تولید یکپارچه</text><text x="1040" y="200">محصول بیشتر</text>`
        : ["نخ‌ریسی", "بافندگی", "رنگرزی", "خیاطی"]
            .map((x, i) => {
              const cx = 170 + i * 320;
              return `${i ? `<path class="thread" d="M${cx - 230} 190H${cx - 85}"/>` : ""}<circle cx="${cx}" cy="190" r="75" fill="#e5ecfb" stroke="#2159dd" stroke-width="2"/><path d="M${cx - 35} 175h70M${cx - 35} 190h70M${cx - 35} 205h70" stroke="#2159dd" stroke-width="5"/><text x="${cx}" y="315">${x}</text>`;
            })
            .join("")
    }</svg></div><p class="caption" style="text-align:center">${factory ? "فناوری همراه با سازمان‌دهی تازه، شکلِ کار را تغییر می‌دهد." : "زنجیره‌ای میان افراد و کارگاه‌های پراکنده"}</p>`;
  }
  function coach() {
    const ps = [
      [180, 170],
      [320, 100],
      [320, 280],
      [500, 170],
      [650, 90],
      [650, 285],
      [800, 180],
    ];
    return `<div class="split"><div class="coach-art"><svg viewBox="0 0 940 400" aria-label="هماهنگی بازیکنان در زمین فوتبال"><rect class="field" x="20" y="20" width="900" height="350" rx="10"/><path d="M470 20V370" stroke="#739680" stroke-width="2"/><circle cx="470" cy="195" r="70" fill="none" stroke="#739680" stroke-width="2"/>${ps
      .slice(0, -1)
      .map(
        (p, i) =>
          `<path class="bond" d="M${p[0]} ${p[1]}L${ps[i + 1][0]} ${ps[i + 1][1]}"/>`,
      )
      .join(
        "",
      )}${ps.map(([x, y], i) => `<circle class="player" cx="${x}" cy="${y}" r="17" style="animation-delay:${i * 0.3}s"/>`).join("")}</svg></div><div><h3>اعتماد و انگیزه<br>بین آدم‌ها شکل می‌گیرد.</h3><p class="lead">همدلی، اقتدار، دوستی و هماهنگیِ یک جمع، بخش بزرگی از کارِ سرمربی‌اند.</p></div></div>`;
  }
  function stamp(s) {
    return `<div class="split"><div class="stamp-paper"><span class="rx">Rx</span><h3>${s.future ? "کار تخصصی آماده است" : "گزارش و نظر تخصصی"}</h3><div class="paper-line" style="--w:80%"></div><div class="paper-line" style="--w:60%"></div><div class="paper-line" style="--w:75%"></div><div class="stamp-seal">تأیید<br>انسان</div></div><div><h3>${s.future ? "اگر ارزش فقط به امضا منتقل شود…" : "انجام کار و پذیرشِ رسمی"}</h3><p class="lead">${s.future ? "رقابت بر سر امضا بیشتر می‌شود؛ قیمت آن زیر فشار می‌رود و نهادها به بازنگری قواعد پذیرش می‌رسند." : "بیمه ممکن است نسخهٔ پزشک را بخواهد؛ مجوز ساخت ممکن است به امضای مهندس وابسته باشد."}</p><p class="caption">${s.future ? "ارزش حرفه‌ای به ساختن و ادارهٔ خدمتِ بهتر منتقل می‌شود." : "این مانع نهادی می‌تواند مدتی پس از خودکارشدنِ انجام کار باقی بماند."}</p></div></div>`;
  }
  function body(s) {
    switch (s.type) {
      case "story":
        return Story.render(s, step(s), states.get(s.id)?.story || {}, neural);
      case "hero":
        return hero();
      case "overview":
        return renderRouteOverview();
      case "equation":
        return `<div class="equation"><div class="term"><strong>ایجنت</strong><p>کاری را پیش می‌برد.</p></div><span>=</span><div class="term main"><strong>مدل</strong><p>می‌فهمد و پیشنهاد می‌دهد.</p></div><span>+</span><div class="term"><strong>هارنس</strong><p>زمینه و اجرا را اداره می‌کند.</p></div></div>`;
      case "compare":
        return compare(s);
      case "flow":
        return flow(s);
      case "travel":
        return travel(s);
      case "early-ai":
        return earlyAI(s);
      case "digit-task":
      case "digit-io":
        return digitTask(s);
      case "learning":
        return learning(s);
      case "network-structure":
        return `<div class="network-structure"><div>${pixelGrid()}<p class="caption">تصویر: ۲۵ عددِ صفر و یک<br><b>۱۰۸ وزن + ۶ بایاس<br>در مجموع ۱۱۴ پارامتر</b></p></div><div>${networkSVG()}</div><p class="caption">وزن‌ها: <span dir="ltr">۲۵×۴ + ۴×۲ = ۱۰۸</span> · بایاس‌ها: <span dir="ltr">۴ + ۲ = ۶</span><br><small>بایاس، یک عددِ آموزش‌پذیرِ افزوده‌شده در محاسبهٔ هر واحد است.</small></p></div>`;
      case "probabilities":
        return probabilities(s);
      case "advice":
        return advice();
      case "booking-trace":
        return flow(s);
      case "context":
        return context();
      case "rag":
        return rag(s);
      case "providers":
        return providers(s);
      case "pricing":
        return pricing(s);
      case "mistake":
        return mistake(s);
      case "tests":
        return tests(s);
      case "policies":
        return policies();
      case "confirmation":
        return confirmation(s);
      case "loop":
        return loop(s);
      case "identity":
        return identity(s);
      case "secret":
        return secret(s);
      case "outage":
        return outage(s);
      case "os":
        return os(s);
      case "human":
        return human();
      case "diary":
        return diary();
      case "industry":
        return industry(s);
      case "coach":
        return coach();
      case "stamp":
        return stamp(s);
      case "statement":
        return `<div class="pullquote"><h2>${e(s.text)}</h2>${s.sub ? `<p>${e(s.sub)}</p>` : ""}</div>`;
      case "tokens":
        return `<div class="tokens">${s.tokens.map((x, i) => `<span class="token" style="--i:${i}">${e(x)}</span>`).join("")}</div><p class="token-caption">${e(s.caption)}</p>`;
      case "chart":
        return `<div class="chart-box"><img src="assets/${s.image}" alt="${e(s.title)}؛ تصویر تهیه‌شده در ۴ نوامبر ۲۰۲۶" data-zoom></div><div class="chart-insight"><p>${e(s.insight)}</p><span class="chart-date">Artificial Analysis<br>2026-11-04</span></div>`;
      case "ladder":
        return `<div class="ladder">${s.items
          .map((x, i) => {
            const [a, b] = pair(x);
            return `<div class="rung" style="--i:${i}"><span class="level">${fa(i + 1)}</span><div><strong>${e(a)}</strong><p>${e(b)}</p></div></div>`;
          })
          .join("")}</div>`;
      case "code":
        return `<div class="split"><div><pre class="code-block">${e(s.code)}</pre></div><div><h3>${e(s.side)}</h3></div></div>`;
      case "frameworks":
        return `<table class="mini-table">${s.items
          .map((x) => {
            const [a, b] = pair(x);
            return `<tr><td dir="ltr">${e(a)}</td><td>${e(b)}</td></tr>`;
          })
          .join("")}</table>`;
      case "end":
        return `<div class="end-layout"><div class="eyebrow">ایجنت</div><h1 class="end-word">حالا بسازیم.</h1><p>${e(s.lead)}</p><div class="rule" style="background:var(--blue)"></div><span class="caption" style="color:var(--muted)">گفت‌وگو و پرسش</span></div>`;
      default:
        return columns(s.items || []);
    }
  }
  function footer(s) {
    return `<footer class="slide-footer"><span class="brand">ایجنت <span style="font-weight:400">/ ${e(PARTS[s.part - 1])}</span></span><span>${(s.source || []).map((k) => `<a href="${e(SOURCES[k][1])}" target="_blank" rel="noopener">${e(SOURCES[k][0])}</a>`).join(" · ")}</span><span class="folio">${fa(SLIDES.findIndex((x) => x.id === s.id) + 1).padStart(3, "۰")}</span></footer>`;
  }
  function mapHTML(s) {
    const groups = Object.entries(GROUPS).filter(
      ([k]) => Number(k[0]) === s.part,
    );
    const ix = groups.findIndex(([k]) => k === s.g);
    return `<div class="map-layout"><div class="map-title"><div class="section-num">${fa(s.part).padStart(2, "۰")}</div><h2>${e(PARTS[s.part - 1])}</h2><p class="map-subtitle">${e(GROUPS[s.g])}</p></div><ol class="map-list">${groups.map(([k, v], i) => `<li class="map-row ${i === ix ? "current" : i < ix ? "done" : ""}"><span class="map-num">${i < ix ? "✓" : fa(k)}</span><span>${e(v)}</span></li>`).join("")}</ol></div><div class="map-parents">${PARTS.map((p, i) => `<span class="${i + 1 === s.part ? "current" : ""}">${fa(i + 1)} ${e(p)}</span>`).join("")}</div><div class="slide-footer"><span class="brand">ایجنت</span><span>${fa(s.g)} — ${e(GROUPS[s.g])}</span></div>`;
  }
  function render(s) {
    if (s.map) return mapHTML(s);
    if (s.type === "cinema")
      return `<div class="cinema-layout"><div class="cinema-copy"><div class="eyebrow" dir="ltr">${e(s.kicker)}</div><h2>${e(s.title)}</h2><p>${e(s.lead)}</p><div class="cinema-flow">${(s.visualFlow || []).map((t, i) => `<div><b>${fa(i + 1)}</b><span>${e(t)}</span></div>`).join("")}</div></div><figure><img class="cinema-image" src="assets/${s.image}" alt="${e(s.title)}"><figcaption class="image-caption">${e(s.credit)}</figcaption></figure></div>${s.bridge ? `<div class="story-bridge">${e(s.bridge)}</div>` : ""}${footer(s)}`;
    if (s.type === "travel")
      return `<div class="content travel-content">${travel(s)}</div>${footer(s)}`;
    if (s.type === "hero" || s.type === "end") return body(s) + footer(s);
    return `<header class="slide-header ${s.title.length > 34 ? "compact" : ""}"><div class="eyebrow">${fa(s.g)} · ${e(GROUPS[s.g])}</div><h2>${e(s.title)}</h2><p class="lead">${e(s.lead)}</p></header><div class="content">${body(s)}</div>${s.bridge ? `<div class="story-bridge">${e(s.bridge)}</div>` : ""}${footer(s)}`;
  }
  pages.forEach((s) => {
    const el = document.createElement("section");
    el.className = `slide ${s.map ? "roadmap" : s.type === "cinema" ? "cinema" : s.type === "learning" ? "learning-slide" : s.type === "travel" ? "travel-slide" : s.type === "story" ? "story-slide" : s.bridge ? "revised-slide" : ""}`;
    el.dataset.key = s.map ? s.id : "slide-" + s.id;
    el.dataset.sourceId = s.id;
    el.setAttribute(
      "aria-label",
      s.map ? `نقشهٔ مسیر؛ ${GROUPS[s.g]}` : s.title,
    );
    el.innerHTML = render(s);
    stage.append(el);
  });
  function resize() {
    const space = $("#viewport").getBoundingClientRect();
    document.documentElement.style.setProperty(
      "--scale",
      Math.min(space.width / 1600, space.height / 900),
    );
  }
  function findHash() {
    const raw = decodeURIComponent(location.hash.slice(1));
    const i = pages.findIndex((s) => (s.map ? s.id : "slide-" + s.id) === raw);
    return i < 0 ? 0 : i;
  }
  function go(i, hash = true) {
    if (neural.busy) {
      neural.token++;
      neural.busy = false;
    }
    current = Math.max(0, Math.min(pages.length - 1, i));
    $$(".slide").forEach((el, j) => {
      el.classList.toggle("active", j === current);
      el.setAttribute("aria-hidden", String(j !== current));
    });
    const s = pages[current];
    if (
      [
        "learning",
        "probabilities",
        "network-structure",
        "digit-task",
        "digit-io",
      ].includes(s.type) ||
      (s.type === "story" &&
        (Lessons.handles(s.kind) || Journeys.handles(s.kind)))
    )
      rerender(s);
    if (hash)
      history.replaceState(null, "", "#" + (s.map ? s.id : "slide-" + s.id));
    $("#counter").textContent = s.map
      ? `${fa(s.g)} / نقشه`
      : `${fa(SLIDES.findIndex((x) => x.id === s.id) + 1)} / ${fa(SLIDES.length)}`;
    $("#sectionName").textContent = PARTS[s.part - 1];
    $("#progress i").style.width = `${(current / (pages.length - 1)) * 100}%`;
    document.title = `${s.map ? GROUPS[s.g] : s.title} — ایجنت`;
    const conversation = $$(".slide")[current].querySelector(".conversation");
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
    if ($("#notes").open) notes();
  }
  function rerender(s) {
    const el = $$(".slide")[current];
    el.innerHTML = render(s);
    const conversation = el.querySelector(".conversation");
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }
  function countSteps(s) {
    if (s.type === "story") return Story.frames(s);
    return (
      { travel: 7, confirmation: 4, loop: 6, secret: 5, outage: 4 }[s.type] || 0
    );
  }
  function advance(force = false) {
    const s = pages[current],
      n = countSteps(s);
    if (
      !force &&
      s.type === "confirmation" &&
      s.mode === "hard" &&
      step(s) === 1
    )
      return;
    if (!force && s.type === "travel" && [3, 4].includes(step(s))) return;
    if (
      !force &&
      s.type === "story" &&
      Journeys.handles(s.kind) &&
      !Journeys.canAdvance(s, step(s), states.get(s.id)?.story || {})
    )
      return;
    if (!force && n && step(s) < n - 1) {
      const previous = states.get(s.id) || {};
      states.set(s.id, {
        ...previous,
        step: step(s) + 1,
        story: Journeys.handles(s.kind)
          ? Journeys.enter(s, step(s) + 1, previous.story || {})
          : previous.story,
      });
      rerender(s);
    } else go(current + 1);
  }
  function openDialog(id) {
    const d = $("#" + id);
    if (!d.open) d.showModal();
  }
  function renderOverviewSearch() {
    const term = $("#search")
      .value.trim()
      .toLowerCase()
      .replace(/[۰-۹]/g, (c) => "۰۱۲۳۴۵۶۷۸۹".indexOf(c))
      .replace(/[٠-٩]/g, (c) => "٠١٢٣٤٥٦٧٨٩".indexOf(c));
    $("#overviewGrid").innerHTML = SLIDES.map((s, i) => ({
      ...s,
      number: i + 1,
    }))
      .filter((s) =>
        /^\d+$/.test(term)
          ? s.number === Number(term)
          : `${s.id} ${s.title} ${s.lead}`.toLowerCase().includes(term),
      )
      .map(
        (s) =>
          `<button class="overview-item ${pages[current].id === s.id ? "current" : ""}" data-jump="${s.id}"><small>${fa(s.number).padStart(3, "۰")} / ${fa(s.g)}</small>${e(s.title)}</button>`,
      )
      .join("");
  }
  function notes() {
    const s = pages[current];
    $("#notesBody").innerHTML = s.map
      ? `<p>${e(GROUPS[s.g])}</p><p>یک مرور کوتاه؛ سپس ادامهٔ موضوع فعلی.</p>`
      : `<h3>${e(s.title)}</h3><p>${e(s.lead)}</p>${window.SPEAKER_NOTES?.[s.id] ? `<p class="note-copy">${e(SPEAKER_NOTES[s.id])}</p>` : ""}<p>${(s.source || []).map((k) => `<a href="${e(SOURCES[k][1])}" target="_blank" rel="noopener">${e(SOURCES[k][0])}</a>`).join("<br>")}</p><p><a href="sources.html" target="_blank">همهٔ منابع و اعتبار تصاویر</a></p>`;
  }
  $("#nextBtn").onclick = () => advance();
  $("#backBtn").onclick = () => go(current - 1);
  $("#overviewBtn").onclick = () => {
    renderOverviewSearch();
    openDialog("overview");
    $("#search").focus();
  };
  $("#notesBtn").onclick = () => {
    notes();
    openDialog("notes");
  };
  $("#helpBtn").onclick = () => openDialog("help");
  $("#fullBtn").onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else document.documentElement.requestFullscreen().catch(() => {});
  };
  $("#search").oninput = renderOverviewSearch;
  document.addEventListener("click", (ev) => {
    const storyAction = ev.target.closest("[data-story]");
    if (storyAction) {
      const s = pages[current];
      const previous = states.get(s.id) || {};
      const action = storyAction.dataset.story;
      if (action === "next") {
        advance();
        return;
      }
      states.set(s.id, {
        ...previous,
        step: action === "reset" ? 0 : previous.step || 0,
        story: Story.act(s, action, previous.story || {}),
      });
      rerender(s);
      return;
    }
    const close = ev.target.closest("[data-close]");
    if (close) {
      $("#" + close.dataset.close).close();
      return;
    }
    const jump = ev.target.closest("[data-jump]");
    if (jump) {
      go(pages.findIndex((s) => !s.map && s.id === Number(jump.dataset.jump)));
      $("#overview").close();
      return;
    }
    if (ev.target.closest("[data-run-booking-test]")) {
      const root = ev.target.closest(".mechanical-test");
      const result = runBookingExample(
        !root.querySelector("[data-disable-dedup]").checked,
      );
      const out = root.querySelector(".mechanical-output");
      out.className = "mechanical-output " + (result.passed ? "pass" : "fail");
      out.dataset.result = JSON.stringify(result);
      out.innerHTML = `<div class="test-label">دو فراخوانی با شناسهٔ درخواستِ یکسان</div><p class="latin">${result.first} → ${result.second}</p><p>تعداد رزروهای ساخته‌شده: ${fa(result.count)}</p><div class="test-conclusion">${result.passed ? "آزمون قبول شد." : "آزمون رد شد؛ رزرو تکراری ساخته شد."}</div>`;
      return;
    }
    const plan = ev.target.closest("[data-plan]");
    if (plan) {
      const s = pages[current];
      if (s.type === "travel" && step(s) === 3) {
        states.set(s.id, { step: 4, plan: plan.dataset.plan });
        rerender(s);
      }
      return;
    }
    if (ev.target.closest("[data-travel-approve]")) {
      const s = pages[current];
      if (s.type === "travel" && step(s) === 4) {
        states.set(s.id, { ...states.get(s.id), step: 5 });
        rerender(s);
      }
      return;
    }
    const train = ev.target.closest("[data-train]");
    if (train) {
      trainNeural(Number(train.dataset.train));
      return;
    }
    const pixel = ev.target.closest("[data-pixel]");
    if (pixel && !neural.busy) {
      const i = Number(pixel.dataset.pixel);
      neural.input[i] = 1 - neural.input[i];
      rerender(pages[current]);
      return;
    }
    const digit = ev.target.closest("[data-digit]");
    if (digit && !neural.busy) {
      neural.label = Number(digit.dataset.digit);
      neural.input = [...Learning.dataset[neural.label === 1 ? 6 : 0].x];
      rerender(pages[current]);
      return;
    }
    if (ev.target.closest("[data-neural-reset]")) {
      neural.token++;
      neural.busy = false;
      neural.net = new Learning.TinyNet();
      neural.input = [...Learning.dataset[6].x];
      neural.label = 1;
      rerender(pages[current]);
      return;
    }
    if (ev.target.closest("[data-sample-word]")) {
      const s = pages[current];
      const p = Learning.temperature(
        baseProbs,
        s.temperature ? temperatureValue : 1,
      );
      sampledWords.push(Learning.sample(p));
      const root = $(".slide.active .probability-demo");
      root.querySelector(".sample-output").textContent =
        "این بار: " + words[sampledWords[sampledWords.length - 1]];
      root.querySelector(".sample-history").innerHTML = sampledWords
        .slice(-12)
        .map((i) => `<span>${words[i]}</span>`)
        .join("");
      return;
    }
    const demo = ev.target.closest("[data-demo]");
    if (demo) {
      const s = pages[current];
      if (demo.dataset.demo === "reset") {
        states.set(s.id, { ...(states.get(s.id) || {}), step: 0 });
        rerender(s);
      } else if (step(s) < countSteps(s) - 1) {
        states.set(s.id, { ...(states.get(s.id) || {}), step: step(s) + 1 });
        rerender(s);
      }
      return;
    }
    const approval = ev.target.closest("[data-hard-approve]");
    if (approval) {
      const s = pages[current];
      if (s.type === "confirmation" && s.mode === "hard" && step(s) === 1) {
        states.set(s.id, { ...(states.get(s.id) || {}), step: 2 });
        rerender(s);
      }
      return;
    }
    const sec = ev.target.closest("[data-secret]");
    if (sec) {
      const s = pages[current];
      states.set(s.id, {
        ...(states.get(s.id) || {}),
        step: Math.max(3, step(s)),
        bad: sec.dataset.secret === "denied",
      });
      rerender(s);
      return;
    }
    const zoom = ev.target.closest("[data-zoom]");
    if (zoom) {
      $("#lightbox img").src = zoom.src;
      $("#lightbox img").alt = zoom.alt;
      openDialog("lightbox");
    }
  });
  document.addEventListener("input", (ev) => {
    if (ev.target.matches("[data-lesson-angle]")) {
      const s = pages[current],
        previous = states.get(s.id) || {};
      const story = {
        ...(previous.story || {}),
        [ev.target.dataset.lessonAngle]: Number(ev.target.value),
      };
      states.set(s.id, { ...previous, story });
      Lessons.refresh(s, story);
      return;
    }
    if (ev.target.matches("[data-disable-dedup]")) {
      const out = ev.target
        .closest(".mechanical-test")
        .querySelector(".mechanical-output");
      out.className = "mechanical-output";
      delete out.dataset.result;
      out.innerHTML =
        '<div class="test-label">تنظیم تغییر کرد</div><p>آزمون را دوباره اجرا کن.</p>';
    }
    if (ev.target.matches("[data-manual-weight]")) {
      neural.net.w2[1][0] = Number(ev.target.value);
      refreshNeural();
    }
    if (ev.target.matches("[data-temperature]")) {
      temperatureValue = Number(ev.target.value);
      sampledWords.length = 0;
      const root = ev.target.closest(".probability-demo");
      root.querySelector(".candidate-bars").innerHTML = candidateBars(
        pages[current],
      );
      root.querySelector("[data-temperature-value]").textContent =
        temperatureValue.toFixed(2);
      root.querySelector(".sample-output").textContent =
        "دما عوض شد؛ دوباره انتخاب کنید.";
      root.querySelector(".sample-history").innerHTML = "";
    }
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.target.closest("button") && ["Enter", " "].includes(ev.key)) return;
    if (
      ev.target.matches("input,textarea,select") ||
      $$("dialog").some((d) => d.open)
    )
      return;
    switch (ev.key.toLowerCase()) {
      case "arrowleft":
      case " ":
      case "enter":
        ev.preventDefault();
        advance();
        break;
      case "arrowright":
      case "pageup":
        ev.preventDefault();
        go(current - 1);
        break;
      case "pagedown":
        ev.preventDefault();
        advance(true);
        break;
      case "home":
        ev.preventDefault();
        go(0);
        break;
      case "end":
        ev.preventDefault();
        go(pages.length - 1);
        break;
      case "g":
        $("#overviewBtn").click();
        break;
      case "n":
        $("#notesBtn").click();
        break;
      case "f":
        $("#fullBtn").click();
        break;
      case "?":
        $("#helpBtn").click();
        break;
      case "b":
        $("#blackout").hidden = !$("#blackout").hidden;
        break;
      case "h":
        document.body.classList.toggle("hide-controls");
        resize();
        break;
      case "escape":
        $("#blackout").hidden = true;
        break;
    }
  });
  let touchX = null,
    touchY = null;
  stage.addEventListener(
    "touchstart",
    (ev) => {
      if (ev.target.closest("button,input")) return;
      touchX = ev.touches[0].clientX;
      touchY = ev.touches[0].clientY;
    },
    { passive: true },
  );
  stage.addEventListener(
    "touchend",
    (ev) => {
      if (touchX === null) return;
      const dx = ev.changedTouches[0].clientX - touchX,
        dy = ev.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy))
        dx < 0 ? advance(true) : go(current - 1);
      touchX = null;
    },
    { passive: true },
  );
  window.addEventListener("resize", resize);
  window.addEventListener("hashchange", () => go(findHash(), false));
  window.addEventListener("fullscreenchange", resize);
  document.fonts.ready.then(resize);
  resize();
  go(findHash(), false);
  window.Deck = {
    pages,
    learning: neural,
    runBookingExample,
    slides: SLIDES,
    go,
    advance,
    states,
    get current() {
      return current;
    },
    get slide() {
      return pages[current];
    },
  };
})();
