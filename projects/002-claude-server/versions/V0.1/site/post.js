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

  const form = document.querySelector('#setup-form');
  const fields = { os: document.querySelector('#local-os'), terminal: document.querySelector('#terminal'), ip: document.querySelector('#server-ip'), repo: document.querySelector('#repository'), port: document.querySelector('#ssh-port'), session: document.querySelector('#session-name') };
  const output = document.querySelector('#prompt-output');
  const submit = document.querySelector('#generate');
  const status = document.querySelector('#config-status');
  let result = null;
  let copyTimer;
  const values = () => Object.fromEntries(Object.entries(fields).map(([name, el]) => [name, el.value]));
  function invalidate() {
    result = null;
    output.value = '';
    document.querySelector('#copy-prompt').disabled = true;
    document.querySelector('#download-prompt').disabled = true;
    document.querySelectorAll('[data-needs-config]').forEach(el => { el.disabled = true; });
    document.querySelector('#reconnect').textContent = 'ابتدا مشخصات را در اسلاید ۴ کامل کن.';
    document.querySelector('#new-session').textContent = 'نام تازه پس از ساخت پرامپت نمایش داده می‌شود.';
    document.querySelector('#clone-example').textContent = 'git clone REPOSITORY /root/projects/PROJECT\ncd /root/projects/PROJECT\ngit remote -v\ngit status --short --branch';
    document.querySelector('#copy-status').textContent = '';
  }
  function validate() {
    const checked = ServerSetup.validate(values());
    submit.disabled = !checked.valid;
    status.textContent = checked.valid ? 'مشخصات آماده است. برای ساخت متن، دکمه را بزن.' : Object.values(checked.errors)[0];
    for (const [name, el] of Object.entries(fields)) el.setAttribute('aria-invalid', String(Boolean(el.value && checked.errors[name])));
    return checked;
  }
  function resetTerminals() {
    const choices = ServerSetup.terminals[fields.os.value] || [];
    fields.terminal.replaceChildren(new Option(choices.length ? 'انتخاب کن' : 'اول سیستم‌عامل را انتخاب کن', ''), ...choices.map(([id, label]) => new Option(label, id)));
    fields.terminal.disabled = !choices.length;
  }
  fields.os.addEventListener('change', () => { resetTerminals(); invalidate(); validate(); });
  form.addEventListener('input', () => { invalidate(); validate(); });
  form.addEventListener('change', () => { invalidate(); validate(); });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate().valid) return;
    result = ServerSetup.generate(values());
    output.value = result.prompt;
    document.querySelector('#reconnect').textContent = result.reconnect;
    document.querySelector('#new-session').textContent = result.newSession;
    document.querySelector('#clone-example').textContent = result.clone;
    document.querySelector('#copy-prompt').disabled = false;
    document.querySelector('#download-prompt').disabled = false;
    document.querySelectorAll('[data-needs-config]').forEach(el => { el.disabled = false; });
    goTo(slides.findIndex(el => el.id === 'prompt'), { focus: true });
  });
  document.querySelector('#clear-inputs').addEventListener('click', () => { form.reset(); resetTerminals(); invalidate(); validate(); });
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copy);
    const text = target.value || target.textContent;
    if (!text) return;
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); copied = true; } catch { /* file viewers may require the fallback */ }
    }
    if (!copied) {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.append(area); area.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      area.remove(); button.focus({ preventScroll: true });
    }
    const copyStatus = document.querySelector('#copy-status');
    clearTimeout(copyTimer);
    copyStatus.textContent = copied ? 'متن کپی شد.' : 'کپی خودکار ممکن نشد؛ متن را انتخاب و از گزینهٔ کپی مرورگر استفاده کن.';
    if (!copied) {
      if (target instanceof HTMLTextAreaElement) { target.focus({ preventScroll: true }); target.select(); }
      else { const range = document.createRange(); range.selectNodeContents(target); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); }
    }
    copyTimer = setTimeout(() => { copyStatus.textContent = ''; }, 6000);
  }));
  document.querySelector('#download-prompt').addEventListener('click', () => {
    if (!result) return;
    const address = URL.createObjectURL(new Blob([result.prompt], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = address; link.download = 'claude-server-setup.txt'; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(address), 1000);
  });
  // Browser form restoration is not a storage mechanism for this generator.
  function reset() { form.reset(); resetTerminals(); invalidate(); validate(); }
  reset();
  window.addEventListener('pageshow', event => { if (event.persisted) reset(); });
  if (document.documentElement.dataset.delivery === 'offline') {
    const home = document.querySelector('[data-home-link]');
    home.href = `${document.querySelector('meta[name="journal-origin"]').content}/`;
    home.querySelector('span').textContent = 'یادداشت‌های کارگاه · روی وب';
  }
  const initial = slides.findIndex(slide => `#${slide.id}` === window.location.hash);
  if (initial >= 0) goTo(initial, { instant: true }); else updateFromScroll();
})();
