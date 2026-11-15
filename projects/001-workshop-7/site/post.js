(() => {
  'use strict';
  const slides = [...document.querySelectorAll('.slide')];
  const segments = [...document.querySelectorAll('.segment')];
  const previous = document.querySelector('#previous-slide');
  const next = document.querySelector('#next-slide');
  const readingToggle = document.querySelector('#reading-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const visited = new Set();
  let current = -1;
  let navigationTarget = null;
  let ticking = false;
  const fa = number => String(number).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[digit]);

  function setCurrent(index) {
    if (index === current || index < 0 || index >= slides.length) return;
    current = index;
    visited.add(index);
    segments.forEach((segment, i) => {
      segment.classList.toggle('is-current', i === index);
      segment.classList.toggle('is-visited', visited.has(i));
      if (i === index) segment.setAttribute('aria-current', 'step');
      else segment.removeAttribute('aria-current');
    });
    document.querySelector('#slide-count').textContent = `${fa(index + 1).padStart(2, '۰')} / ${fa(slides.length).padStart(2, '۰')}`;
    document.querySelector('#slide-title').textContent = slides[index].dataset.title;
    previous.disabled = index === 0;
    next.disabled = index === slides.length - 1;
    try { history.replaceState(null, '', `#${slides[index].id}`); } catch { /* File viewers may restrict history. */ }
  }

  function updateFromScroll() {
    const marker = window.innerHeight * 0.37;
    let index = 0;
    slides.forEach((slide, i) => { if (slide.getBoundingClientRect().top <= marker) index = i; });
    // Seeking past a section is not the same as visiting it. Ignore intermediate
    // scroll frames until the requested section arrives, or the reader interrupts.
    if (navigationTarget !== null && index !== navigationTarget) {
      ticking = false;
      return;
    }
    navigationTarget = null;
    setCurrent(index);
    ticking = false;
  }

  function goTo(index, options = {}) {
    const bounded = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slides[bounded];
    navigationTarget = bounded;
    setCurrent(bounded);
    slide.scrollIntoView({ behavior: options.instant || reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
    if (options.focus) {
      const heading = slide.querySelector('h1, h2');
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
    if (options.instant || reducedMotion.matches) setCurrent(bounded);
  }

  previous.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    const index = slides.findIndex(slide => `#${slide.id}` === anchor.getAttribute('href'));
    if (index < 0) return;
    anchor.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      goTo(index, { focus: true });
    });
  });
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(updateFromScroll); }
  }, { passive: true });
  window.addEventListener('resize', updateFromScroll);
  for (const event of ['wheel', 'touchstart']) {
    window.addEventListener(event, () => { navigationTarget = null; }, { passive: true });
  }
  document.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.defaultPrevented || event.isComposing) return;
    const target = event.target;
    if (target.isContentEditable || target.closest('input, textarea, select, [role="textbox"], [data-slide-keys="local"]')) return;
    if (document.body.classList.contains('reading-mode')) return;
    // Buttons and links keep focus after clicks. Up/Down still belong to the
    // presentation; Space must retain the focused control's activation behavior.
    if (event.key === ' ' && target.closest('button, a, summary, [role="button"], [role="tab"]')) return;
    const moves = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, ' ': event.shiftKey ? -1 : 1 };
    if (Object.hasOwn(moves, event.key)) {
      event.preventDefault();
      goTo(current + moves[event.key], { focus: true });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      goTo(event.key === 'Home' ? 0 : slides.length - 1, { focus: true });
    }
  });
  readingToggle.addEventListener('click', () => {
    const index = Math.max(current, 0);
    const reading = document.body.classList.toggle('reading-mode');
    readingToggle.setAttribute('aria-pressed', String(reading));
    readingToggle.textContent = reading ? 'حالت ارائه' : 'حالت مطالعه';
    goTo(index, { instant: true });
  });

  const examples = {
    exam: { input: 'سؤال‌های آزمون این هفته', description: 'متن سؤال‌ها، پایهٔ تحصیلی، زمان آزمون و بارم هر سؤال.', token: 'x² + ۲x = ۸', method: 'روشِ تولید برگهٔ آزمون', steps: ['گرفتن و روشن کردن سؤال‌ها', 'بررسی فرمول‌ها و نمره‌ها', 'چیدن یک صفحهٔ نمونه', 'بازبینی و ساخت فایل نهایی'], output: 'یک PDF مرتب با صورت سؤال و بارم روشن.' },
    deck: { input: 'موضوع ارائهٔ بعدی', description: 'مخاطب، پیام اصلی، زمان ارائه و منابع این موضوع.', token: 'یک موضوع تازه ← یک روایت روشن', method: 'روشِ ساخت ارائه', steps: ['روشن کردن مخاطب و پیام', 'چیدن مسیر روایت', 'ساخت و بررسی چند اسلاید نمونه', 'تکمیل ارائه و کنترل خوانایی'], output: 'یک ارائه با روایت روشن و مثال مناسب مخاطب.' },
    translation: { input: 'فصل بعدیِ کتاب', description: 'متن تازه، مخاطب ترجمه و اصطلاح‌های این فصل.', token: 'متن تازه + واژه‌نامهٔ قبلی', method: 'روشِ ترجمه و بازبینی', steps: ['روشن کردن معنا و اصطلاح‌ها', 'استفاده از سبک و واژه‌نامهٔ منتخب', 'ترجمهٔ یک بخش و گرفتن نظر', 'ویرایش و کنترل یکدستی'], output: 'ترجمه‌ای یکدست، با واژه‌نامه و سبک قابل پیگیری.' },
    content: { input: 'آموزش یا معرفیِ بعدی', description: 'ایده، مخاطب، مثال‌ها و نکته‌ای که این بار باید منتقل شود.', token: 'یک تجربهٔ واقعی ← یک مطلبِ قابل استفاده', method: 'روشِ ساخت یک مطلبِ تعاملی', steps: ['انتخاب پیام و مثال واقعی', 'نوشتن روایت و ساخت نمونه', 'اضافه کردن توضیح و تعامل لازم', 'بررسی و انتشار مطلب'], output: 'یک صفحهٔ آموزشی که مخاطب بتواند با آن کار کند.' }
  };
  const tabs = [...document.querySelectorAll('[data-example]')];
  function selectExample(tab, focus = false) {
    const value = examples[tab.dataset.example];
    tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; });
    document.querySelector('#example-panel').setAttribute('aria-labelledby', tab.id);
    document.querySelector('#example-input-title').textContent = value.input;
    document.querySelector('#example-input-copy').textContent = value.description;
    document.querySelector('#example-token').textContent = value.token;
    document.querySelector('#example-method-title').textContent = value.method;
    document.querySelector('#example-output-copy').textContent = value.output;
    document.querySelector('#example-steps').replaceChildren(...value.steps.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    if (focus) tab.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectExample(tab));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowLeft') target = (index + 1) % tabs.length;
      if (event.key === 'ArrowRight') target = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== undefined) { event.preventDefault(); selectExample(tabs[target], true); }
    });
  });

  document.querySelectorAll('[data-decision]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-decision]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelector('#decision-result').textContent = button.dataset.decision === 'separate'
      ? 'در این نمونه: برگهٔ سؤال و پاسخ‌نامه دو فایل جدا خواهند بود.'
      : 'در این نمونه: پاسخ‌ها در بخش جداگانهٔ همان فایل خواهند بود.';
  }));

  document.querySelector('#copy-brief').addEventListener('click', async () => {
    const text = document.querySelector('#starter-brief').textContent;
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); copied = true; } catch { /* A file:// viewer may require the selection fallback. */ }
    }
    if (!copied) {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.append(area); area.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      area.remove();
      document.querySelector('#copy-brief').focus({ preventScroll: true });
    }
    const status = document.querySelector('#copy-status');
    if (copied) { status.textContent = 'متن کپی شد. حالا آن را با کارِ خودتان کامل کنید.'; }
    else {
      const range = document.createRange(); range.selectNodeContents(document.querySelector('#starter-brief'));
      const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
      status.textContent = 'متن انتخاب شد؛ از گزینهٔ کپی مرورگر استفاده کنید یا برگهٔ تمرین را دریافت کنید.';
    }
  });

  if (document.documentElement.dataset.delivery === 'offline') {
    const home = document.querySelector('[data-home-link]');
    home.href = `${document.querySelector('meta[name="journal-origin"]').content}/`;
    home.querySelector('span').textContent = 'یادداشت‌های کارگاه · روی وب';
  }
  const initial = slides.findIndex(slide => `#${slide.id}` === window.location.hash);
  if (initial >= 0) goTo(initial, { instant: true });
  else updateFromScroll();
})();
