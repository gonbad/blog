/* Calculable teaching examples for datasets, representation, retrieval and cost. */
(function (root) {
  "use strict";
  const esc = (s) =>
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
  const kinds = new Set([
    "dataset",
    "holdout",
    "language-pipeline",
    "parameter-scale",
    "evaluation-set",
    "access-route",
    "model-card",
    "model-roles",
    "trust-ladder",
    "billing-choice",
    "cache-cost",
    "access-products",
    "plans",
    "plan-board",
    "passage-vectors",
    "cosine-lab",
    "rag-vector",
  ]);
  const heldout = [
    {
      x: ["00110", "01001", "10001", "01001", "00110"]
        .join("")
        .split("")
        .map(Number),
      y: 0,
    },
    {
      x: ["00010", "00110", "00010", "00010", "01111"]
        .join("")
        .split("")
        .map(Number),
      y: 1,
    },
  ];
  const passages = [
    {
      id: "hotel",
      title: "آیین‌نامهٔ سفر",
      text: "هزینهٔ هر شب هتل تا سه میلیون تومان بازپرداخت می‌شود؛ مبلغِ بیشتر به تأییدِ مدیر نیاز دارد.",
      v: [1, 0, 0],
    },
    {
      id: "leave",
      title: "راهنمای مرخصی",
      text: "درخواستِ مرخصی باید در سامانهٔ منابع انسانی ثبت شود.",
      v: [0, 1, 0],
    },
    {
      id: "device",
      title: "راهنمای تجهیزات",
      text: "تحویلِ لپ‌تاپ با ثبت در سامانهٔ دارایی انجام می‌شود.",
      v: [0, 0, 1],
    },
  ];
  const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0),
    norm = (v) => Math.hypot(...v);
  function cosine(a, b) {
    const den = norm(a) * norm(b);
    if (!den) throw Error("Cosine requires nonzero vectors");
    return Math.max(-1, Math.min(1, dot(a, b) / den));
  }
  function geometry(theta = 25, phi = 25) {
    const t = (theta * Math.PI) / 180,
      p = (phi * Math.PI) / 180;
    const q = [
      Math.cos(t),
      Math.sin(t) * Math.cos(p),
      Math.sin(t) * Math.sin(p),
    ];
    return {
      q,
      ranked: passages
        .map((d) => ({
          ...d,
          score: cosine(q, d.v),
          angle: (Math.acos(cosine(q, d.v)) * 180) / Math.PI,
        }))
        .sort((a, b) => b.score - a.score),
    };
  }
  function cost(rounds = 2, cached = false) {
    const ins = [2000, 2700, 3100],
      outs = [500, 300, 200];
    const rows = ins.slice(0, rounds).map((input, i) => {
      const read = cached && i > 0 ? ins[i - 1] : 0,
        uncached = input - read,
        output = outs[i];
      return {
        round: i + 1,
        input,
        read,
        uncached,
        output,
        cost: (uncached * 2 + read * 0.5 + output * 8) / 1e6,
      };
    });
    return { rows, total: rows.reduce((s, r) => s + r.cost, 0) };
  }
  const languageWeights = [
    [4, -2, 0.5],
    [-2, 4, 0.5],
    [-1, -1, 2],
    [-2, -2, 0],
  ];
  function language(which = "iran") {
    const vectors = [
      [0.1, 0.1, 0.2],
      which === "iran" ? [1, 0, 0.1] : [0, 1, 0.1],
      [0.05, 0.05, 0.1],
    ];
    const h = vectors.reduce((a, v) => a.map((x, i) => x + v[i]), [0, 0, 0]);
    const logits = languageWeights.map((w) => dot(w, h)),
      m = Math.max(...logits),
      exps = logits.map((x) => Math.exp(x - m)),
      sum = exps.reduce((a, b) => a + b, 0);
    return {
      vectors,
      logits,
      probs: exps.map((x) => x / sum),
      weights: languageWeights,
    };
  }
  function pixels(x, small = false) {
    return `<div class="ls-pixels ${small ? "small" : ""}">${x.map((v) => `<i class="${v ? "on" : ""}"></i>`).join("")}</div>`;
  }
  const btn = (a, t) => `<button data-story="${a}">${t}</button>`;
  function wrap(s, body, step) {
    const n = s.kind === "language-pipeline" ? 3 : 0;
    return `<div class="story-root lesson-root" data-story-kind="${s.kind}"><div class="story-visual lesson-visual">${body}</div>${n ? `<div class="story-sequence"><span dir="ltr">${fa(step + 1)} / ${fa(n)}</span>${btn("next", "گام بعد ←")}${btn("reset", "از ابتدا")}</div>` : ""}<div class="story-point">${esc(s.point)}</div></div>`;
  }
  function cosineScene(state) {
    const g = geometry(state.theta ?? 25, state.phi ?? 25),
      project = (v) => [
        300 + 175 * v[0] - 120 * v[1],
        225 - 85 * v[0] - 50 * v[1] - 150 * v[2],
      ],
      o = [300, 225],
      q = project(g.q);
    const ends = passages.map((d) => project(d.v));
    const queryLabelY = ends.some(
      ([x, y]) => Math.hypot(q[0] - x, q[1] - y) < 65,
    )
      ? q[1] + 35
      : q[1] - 20;
    const theta = state.theta ?? 25,
      phi = ((state.phi ?? 25) * Math.PI) / 180;
    const arc = Array.from({ length: 25 }, (_, i) => {
      const a = (((theta * Math.PI) / 180) * i) / 24;
      return project([
        0.32 * Math.cos(a),
        0.32 * Math.sin(a) * Math.cos(phi),
        0.32 * Math.sin(a) * Math.sin(phi),
      ]).join(",");
    }).join(" ");
    return `<div class="cosine-scene"><svg viewBox="0 0 620 365" role="img" aria-label="سه محور و بردار پرسش؛ مختصات آموزشی"><defs><marker id="ls-head" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0L6 3L0 6" fill="currentColor"/></marker></defs><path d="M180 175L355 90L475 140L300 225Z" fill="#e5ecfb" opacity=".45"/>${ends.map(([x, y], i) => `<path d="M300 225L${x} ${y}" stroke="${["#2159dd", "#2f8b67", "#c28b26"][i]}" stroke-width="3"/><circle cx="${x}" cy="${y}" r="6" fill="${["#2159dd", "#2f8b67", "#c28b26"][i]}"/><text x="${x + 15}" y="${y - 12}" class="ls-svg-label">${["X · هتل", "Y · مرخصی", "Z · تجهیزات"][i]}</text>`).join("")}<path d="M300 225L${q[0]} ${q[1]}" stroke="#b64e3e" stroke-width="5"/><circle cx="${q[0]}" cy="${q[1]}" r="9" fill="#b64e3e"/><text x="${q[0]}" y="${queryLabelY}" text-anchor="middle" class="ls-svg-label query-label">پرسش</text><polyline points="${arc}" fill="none" stroke="#b64e3e" stroke-width="2"/><text x="335" y="250" class="ls-svg-label query-label">θ = ${fa(theta)}°</text><circle cx="300" cy="225" r="5" fill="#142536"/><text x="40" y="335" class="ls-svg-label">q = [${g.q.map((x) => x.toFixed(2)).join(", ")}]</text></svg><div class="cosine-results">${g.ranked.map((d, i) => `<div class="cosine-result ${i === 0 ? "best" : ""}" data-document="${d.id}" data-score="${d.score}" data-angle="${d.angle}"><strong>${d.title}</strong><span>زاویه: ${fa(d.angle.toFixed(1))}°</span><b dir="ltr">cos = ${d.score.toFixed(3)}</b></div>`).join("")}<p class="ls-caption">بالاترین امتیاز: ${g.ranked[0].title}</p></div></div>`;
  }
  function render(s, step = 0, state = {}, neural) {
    let body = "";
    switch (s.kind) {
      case "dataset": {
        let i = state.sample ?? 0;
        body = `<div class="dataset-scene"><div class="dataset-sheet">${Learning.dataset.map((d, j) => `<button data-story="sample-${j}" class="sample-card ${i === j ? "selected" : ""}">${pixels(d.x, true)}<span>برچسب: ${fa(d.y)}</span></button>`).join("")}</div><div class="sample-focus">${pixels(Learning.dataset[i].x)}<strong>نمونهٔ ${fa(i + 1)} از ۱۲</strong><p>تصویر + پاسخِ درستِ «${fa(Learning.dataset[i].y)}»</p><span class="ls-caption">روی هر نمونه بزنید تا تصویر و برچسبش را ببینید.</span></div></div>`;
        break;
      }
      case "holdout": {
        const d = heldout[state.digit || 0],
          p = neural.net.forward(d.x).probs,
          guess = p[1] > p[0] ? 1 : 0;
        body = `<div class="holdout-scene"><div class="holdout-image">${pixels(d.x)}<div class="story-actions">${btn("heldout-0", "تصویرِ تازهٔ صفر")}${btn("heldout-1", "تصویرِ تازهٔ یک")}</div><p class="ls-caption">این تصویر در ۱۲ نمونهٔ آموزش نیست.</p></div><div class="holdout-model"><div class="parameter-lock">وزن‌های فعلی: ثابت در این آزمایش</div><div class="holdout-arrow">←</div><p>گام‌های آموزشِ انجام‌شده: ${fa(neural.net.epochs)}</p></div><div class="holdout-prediction"><span>حدسِ مدل</span><b class="${guess === d.y ? "right" : "wrong"}">${fa(guess)}</b><p>پاسخِ درست: ${fa(d.y)}</p><div class="ls-probs">${p.map((v, k) => `<div><span>احتمالِ ${fa(k)}</span><i style="--p:${100 * v}%"></i><strong data-holdout-prob="${v}">${fa((100 * v).toFixed(1))}٪</strong></div>`).join("")}</div></div></div>`;
        break;
      }
      case "language-pipeline": {
        let which = state.country || "iran",
          d = language(which),
          words = ["تهران", "پاریس", "اصفهان", "دیگر"];
        body = `<div class="language-scene"><div class="language-stages"><span class="${step === 0 ? "active" : ""}">۱ · توکن و بردار</span><span class="${step === 1 ? "active" : ""}">۲ · محاسبه با وزن‌ها</span><span class="${step === 2 ? "active" : ""}">۳ · احتمالِ ادامه</span></div><div class="language-live"><div class="language-tokens"><div class="language-prompt">پایتختِ ${which === "iran" ? "ایران" : "فرانسه"} شهرِ …</div>${["پایتخت", which === "iran" ? "ایران" : "فرانسه", "شهر"].map((t, i) => `<div class="language-token"><b>${t}</b><span dir="ltr">id ${[101, which === "iran" ? 208 : 209, 305][i]}</span><code>[${d.vectors[i].join(", ")}]</code></div>`).join("")}</div><span class="ls-flow-arrow">←</span><div class="language-parameters ${step >= 1 ? "exposed" : ""}"><strong>وزن‌های ثابتِ نمونه</strong><div class="weight-matrix">${d.weights
          .flat()
          .map(
            (v) =>
              `<i style="--v:${Math.min(0.9, 0.15 + Math.abs(v) * 0.17)}">${v}</i>`,
          )
          .join(
            "",
          )}</div></div><span class="ls-flow-arrow">←</span><div class="language-probs ${step >= 2 ? "exposed" : ""}">${d.probs.map((v, i) => `<div><span>${words[i]}</span><i style="--p:${100 * v}%"></i><b data-language-prob="${v}">${fa((100 * v).toFixed(1))}٪</b></div>`).join("")}</div></div><div class="story-actions">${btn("country-iran", "ورودی: ایران")}${btn("country-france", "ورودی: فرانسه")}</div><p class="ls-caption">این محاسبهٔ کوچک، مدلِ زبانیِ واقعی نیست؛ Transformer نمایشِ دنباله و رابطهٔ توکن‌ها را با لایه‌های بسیار پیچیده‌تری پردازش می‌کند.</p></div>`;
        break;
      }
      case "parameter-scale":
        body = `<div class="parameter-scene"><div class="small-parameters"><span>شبکهٔ تشخیصِ صفر و یک</span><strong>۱۱۴</strong><b>پارامترِ آموزش‌پذیر</b><p>۱۰۸ وزن + ۶ بایاس</p></div><div class="scale-link">←<span>اصلِ یادگیری مشترک؛ معماری و مقیاس متفاوت</span></div><div class="large-parameters"><span>نمونهٔ منتشرشده: MiMo-V2.5</span><div class="parameter-field">${Array.from({ length: 192 }, (_, i) => `<i style="opacity:${0.15 + (i % 7) * 0.1}"></i>`).join("")}</div><span class="ls-caption">نمایشِ نمادینِ مقیاس</span><strong>۳۱۰ میلیارد</strong><b>پارامترِ کل؛ ۱۵ میلیارد فعال در هر گام</b><p>در بعضی معماری‌ها همهٔ پارامترها هم‌زمان فعال نیستند.</p></div></div>`;
        break;
      case "evaluation-set":
        body = `<div class="evaluation-scene"><table class="story-table"><thead><tr><th>ورودیِ آزمون</th><th>معیارِ قبولی</th><th>امتیازِ ثبت‌شدنی</th></tr></thead><tbody>${[
          ["بودجه‌ام ۸ میلیون است.", "گزینهٔ ۹ میلیونی را مناسب اعلام نکند."],
          ["قبل از ساعت ۱۸ برسم.", "رسیدن در ساعت ۱۹ را دیر بداند."],
          ["موجودیِ هتل را می‌خواهم.", "موجودیِ بدون شاهد را قطعی اعلام نکند."],
        ]
          .map(
            ([a, b]) =>
              `<tr><td>${a}</td><td>${b}</td><td><span class="score-slot">قبول / رد</span></td></tr>`,
          )
          .join(
            "",
          )}</tbody></table><div class="eval-baseline">همان پرسش‌ها + همان زمینه و شرایطِ ابزار + همان معیار → مقایسهٔ مدل‌ها</div></div>`;
        break;
      case "access-route": {
        let routed = state.routed ?? true;
        body = `<div class="access-scene"><div class="creator-label">سازندهٔ خانوادهٔ GPT: OpenAI <span>← رابطه با مدل؛ نه الزاماً یک مسیرِ جدا برای ارسالِ پیام</span></div><div class="access-nodes">${[["برنامهٔ ما", "پیام و زمینه"], ...(routed ? [["واسطهٔ دسترسی", "مثلاً OpenRouter"]] : []), ["میزبانِ اجرای مدل", routed ? "میزبانِ انتخاب‌شده در مسیر" : "اتصالِ مستقیم به میزبان"], ["مدلِ اجراشده", "نسخهٔ مشخصِ GPT"]].map(([a, b]) => `<div><strong>${a}</strong><span>${b}</span></div>`).join("")}</div><div class="story-actions">${btn("route", routed ? "نمایشِ مسیرِ مستقیم" : "نمایشِ مسیر با واسطه")}</div><p class="ls-caption">این مسیر، نقش‌ها را نشان می‌دهد؛ میزبانِ واقعی را از تنظیمات و گزارشِ همان سرویس مشخص می‌کنیم.</p></div>`;
        break;
      }
      case "model-card":
        body = `<div class="model-choice-card"><div class="model-family"><span>سازنده</span><strong dir="ltr">${esc(s.company)}</strong><b dir="ltr">${esc(s.family)}</b><p>برای آزمونِ همان کارِ سفر، یک یا چند گزینه را انتخاب می‌کنیم.</p></div><div class="model-variants">${s.models.map(([name, role]) => `<div><strong dir="ltr">${esc(name)}</strong><p>${esc(role)}</p></div>`).join("")}</div></div>`;
        break;
      case "model-roles":
        body = `<div class="model-role-scene"><div class="role-model"><span>در ساخت</span><strong>مدلِ دستیارِ برنامه‌نویس</strong><p>طراحی، حلِ مسئله، نوشتن و بررسیِ کد</p><b>اولویت: توان و کیفیتِ خروجیِ ساخت</b></div><div class="built-agent"><div>برنامهٔ ایجنت</div><span>← ساخته می‌شود</span><span>در هر درخواست مدل را صدا می‌زند →</span></div><div class="role-model runtime"><span>در اجرا</span><strong>مدلِ داخلِ خدمت</strong><p>پاسخ‌گوییِ تکرارشونده به کاربران</p><b>اولویت: کیفیتِ کافی + هزینه و سرعت</b></div></div>`;
        break;
      case "trust-ladder":
        body = `<div class="trust-scene">${s.rungs.map((r, i) => `<div class="trust-rung" style="--rung:${i}"><b>${fa(i + 1)}</b><strong>${r}</strong><span>${["کنترلِ توسعه و آموزش", "کنترلِ محلِ اجرای وزن‌ها", "اعتمادِ بیرونی؛ بررسیِ مسیرِ API", "آخرین ترجیح؛ متناسب با حساسیتِ کار"][i]}</span></div>`).join("")}</div>`;
        break;
      case "billing-choice":
        body = `<div class="billing-scene"><div class="billing-plan"><span class="billing-symbol">◷</span><h3>اشتراک</h3><strong>مبلغِ دوره‌ای + سهمیهٔ مشخص</strong><p>سقفِ مصرف، مدل‌های مجاز و پنجرهٔ بازنشانی دارد.</p><div class="quota-sample"><i></i><span>سهمیه پر شد → صبر یا مصرفِ اضافه طبق طرح</span></div></div><div class="billing-meter"><span class="billing-symbol">▥</span><h3>پرداخت به‌اندازهٔ مصرف</h3><strong>مصرفِ ثبت‌شده × نرخِ همان مدل</strong><p>ورودی، خروجی و کش می‌توانند نرخ‌های متفاوت داشته باشند.</p><div class="meter-sample">${[20, 38, 55, 80].map((h) => `<i style="height:${h}px"></i>`).join("")}<span>مصرفِ بیشتر → صورتحسابِ بیشتر</span></div></div></div>`;
        break;
      case "cache-cost": {
        const rounds = state.rounds ?? 2,
          cached = !!state.cached,
          c = cost(rounds, cached),
          ribbon =
            rounds === 1
              ? [2000, 0, 0]
              : rounds === 2
                ? [2000, 500, 200]
                : [2700, 300, 100];
        body = `<div class="cache-scene"><div class="context-ribbon"><div style="flex:${ribbon[0]}" class="ribbon-prefix">${fa(ribbon[0])}<br><small>ورودیِ نگه‌داشته‌شده</small></div>${rounds > 1 ? `<div style="flex:${ribbon[1]}" class="ribbon-output">${fa(ribbon[1])}<br><small>پاسخِ قبلی</small></div><div style="flex:${ribbon[2]}" class="ribbon-new">${fa(ribbon[2])}<br><small>پیامِ تازه</small></div>` : ""}</div><div class="ribbon-label">نوبتِ ${fa(rounds)}: ${ribbon.filter(Boolean).map(fa).join(" + ")} = ${fa(c.rows.at(-1).input)} توکنِ ورودی</div><table class="cost-table"><thead><tr><th>نوبت</th><th>ورودیِ کل</th><th>تازه / بی‌کش</th><th>کش‌شده</th><th>خروجی</th><th>هزینه</th></tr></thead><tbody>${c.rows.map((r) => `<tr><td>${fa(r.round)}</td><td>${fa(r.input)}</td><td>${fa(r.uncached)}</td><td>${fa(r.read)}</td><td>${fa(r.output)}</td><td dir="ltr">$${r.cost.toFixed(5)}</td></tr>`).join("")}</tbody></table><div class="cache-controls"><div class="story-actions">${btn("cache", cached ? "غیرفعال‌کردنِ فرضِ Cache Hit" : "فرض کنیم پیشوند، Cache Hit دارد")}${btn("rounds", "یک / دو / سه نوبت")}</div><div class="cost-total">جمع: <b dir="ltr" data-cost-total="${c.total}">$${c.total.toFixed(5)}</b></div></div><p class="ls-caption">کش، بخشی از پردازشِ پیشوندِ مشترک را دوباره استفاده می‌کند؛ متن از زمینه حذف نمی‌شود و پاسخِ قدیمی برگردانده نمی‌شود. Cache Hit در عمل تضمین‌شده نیست.</p></div>`;
        break;
      }
      case "access-products":
        body = `<div class="access-products"><div><h3>خریدِ مستقیم</h3><p>از API همان میزبان، با نرخ و حسابِ مصرفِ خودش.</p></div><div><h3>واسطهٔ دسترسی</h3><p dir="ltr">OpenRouter · GapGPT</p><span>طرح، مدل، نرخ و پردازشگرِ مسیرِ انتخابی را بررسی می‌کنیم.</span></div><div><h3 dir="ltr">OpenCode</h3><p dir="ltr">Go → subscription<br>Zen / Console → pay-as-you-go</p><span>دو محصولِ دسترسی؛ جدا از خودِ نرم‌افزارِ OpenCode.</span></div></div>`;
        break;
      case "plans":
        body = `<div class="plans-scene"><div class="plans-brand" dir="ltr">${esc(s.brand)}</div><div class="plan-prices">${s.plans.map(([name, price, limits]) => `<div><strong dir="ltr">${esc(name)}</strong><b dir="auto">${esc(price)}</b><p>${esc(limits)}</p></div>`).join("")}</div></div>`;
        break;
      case "plan-board":
        body = `<table class="plans-board"><thead><tr><th>محیط / سرویس</th><th>قیمتِ ماهانه</th><th>نوعِ سهمیه</th></tr></thead><tbody>${s.rows.map((r) => `<tr>${r.map((v, i) => `<td ${i < 2 ? 'dir="ltr"' : ""}>${esc(v).replace(/\n/g, "<br>")}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
        break;
      case "passage-vectors":
        body = `<div class="passage-embeddings">${passages.map((d, i) => `<div><div class="passage-sheet"><span>${d.title}</span><p>${d.text}</p></div><span class="embedding-arrow">↓ مدلِ امبدینگ</span><div class="embedding-cells">${d.v.map((v) => `<b>${fa(v)}</b>`).join("")}</div></div>`).join("")}</div><div class="question-embedding">پرسش: «هزینهٔ هتل؟» → <span dir="ltr">q = [0.906, 0.383, 0.179]</span></div>`;
        break;
      case "cosine-lab":
        body = `<div class="cosine-lab"><div data-lesson-live>${cosineScene(state)}</div><div class="cosine-controls"><label>چرخشِ بردارِ پرسش <input data-lesson-angle="theta" aria-label="چرخش بردار پرسش" type="range" min="0" max="180" value="${state.theta ?? 25}"></label><label>چرخش در بُعد سوم <input data-lesson-angle="phi" aria-label="چرخش در بعد سوم" type="range" min="0" max="90" value="${state.phi ?? 25}"></label><code>cos(q,d) = (q·d) / (‖q‖ ‖d‖)</code></div></div>`;
        break;
      case "rag-vector": {
        const g = geometry(25, 25),
          d = g.ranked[0];
        body = `<div class="rag-vector-scene"><div class="retrieval-ranks">${g.ranked.map((r) => `<div class="${state.retrieved && r.id === d.id ? "selected" : ""}"><span>${r.title}</span><b dir="ltr">${r.score.toFixed(3)}</b></div>`).join("")}<div class="story-actions">${btn("retrieve", "متنِ بندِ بالاتر را کنارِ سؤال بگذار")}</div><small>مختصاتِ همان مثالِ آموزشیِ سه‌بعدی</small></div><div class="retrieved-context"><strong>زمینهٔ مدلِ پاسخ‌گو</strong><p>پرسش: هتلِ شبی ۳٫۴ میلیون بازپرداخت می‌شود؟</p>${state.retrieved ? `<blockquote>${d.text}</blockquote><div class="retrieval-answer">پاسخِ متکی به بند: این مبلغ از سقف بیشتر است؛ به تأییدِ مدیر نیاز دارد.</div>` : '<div class="empty-source">هنوز متنِ سند اضافه نشده است.</div>'}</div></div>`;
        break;
      }
      default:
        throw Error("Unknown lesson " + s.kind);
    }
    return wrap(s, body, step);
  }
  function act(s, action, state) {
    const n = { ...state };
    if (action === "reset") return {};
    if (action.startsWith("sample-")) n.sample = Number(action.slice(7));
    if (action.startsWith("heldout-")) n.digit = Number(action.slice(8));
    if (action.startsWith("country-")) n.country = action.slice(8);
    if (action === "route") n.routed = !(n.routed ?? true);
    if (action === "cache") n.cached = !n.cached;
    if (action === "rounds") n.rounds = ((n.rounds ?? 2) % 3) + 1;
    if (action === "retrieve") n.retrieved = true;
    return n;
  }
  const api = {
    handles: (k) => kinds.has(k),
    render,
    act,
    frames: (s) => (s.kind === "language-pipeline" ? 3 : 0),
    geometry,
    cosine,
    cost,
    language,
    heldout,
    passages,
    refresh(s, state) {
      const el = document.querySelector(".slide.active [data-lesson-live]");
      if (el && s.kind === "cosine-lab") el.innerHTML = cosineScene(state);
    },
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.Lessons = api;
})(typeof window === "undefined" ? null : window);
