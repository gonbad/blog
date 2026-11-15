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
    if (document.querySelector('dialog[open]')) return;
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

  const serverForm = document.querySelector('#server-form');
  const repositoryForm = document.querySelector('#repository-form');
  const fields = { ip: document.querySelector('#server-ip'), username: document.querySelector('#server-user'), password: document.querySelector('#server-password'), port: document.querySelector('#ssh-port'), repo: document.querySelector('#repository'), token: document.querySelector('#github-token') };
  const dialog = document.querySelector('#prompt-dialog');
  const output = document.querySelector('#prompt-output');
  let result = null;
  let copyTimer;
  const values = () => Object.fromEntries(Object.entries(fields).map(([name, el]) => [name, el.value]));
  const seek = id => goTo(slides.findIndex(el => el.id === id), { focus: true });
  function renderSession() {
    const name = document.querySelector('#new-session-name').value.trim();
    const valid = ServerSetup.validSession(name);
    const button = document.querySelector('#copy-session');
    button.disabled = !result || !valid;
    document.querySelector('#session-status').textContent = !valid ? 'نام نشست را با حروف لاتین شروع کن؛ از عدد، خط تیره و زیرخط هم می‌توانی استفاده کنی.' : '';
    document.querySelector('#new-session-command').textContent = result && valid ? ServerSetup.sessionCommand(result, name) : 'ابتدا پرامپت آماده‌سازی را بساز و نام نشست را کامل کن.';
  }
  function invalidate() {
    result = null;
    if (dialog.open) dialog.close();
    output.value = '';
    document.querySelector('#prompt-preview').textContent = 'پس از تکمیل اطلاعات، پرامپت اینجا نمایش داده می‌شود.';
    document.querySelector('#copy-prompt').disabled = true;
    document.querySelector('#open-prompt').disabled = true;
    document.querySelectorAll('[data-download-prompt],[data-needs-config]').forEach(el => { el.disabled = true; });
    document.querySelector('#reconnect-command').textContent = 'ابتدا اطلاعات سرور و گیت‌هاب را کامل و پرامپت را بساز.';
    document.querySelector('#copy-status').textContent = '';
    document.querySelector('#dialog-copy-status').textContent = '';
    renderSession();
  }
  function validate() {
    const server = ServerSetup.validateServer(values());
    const all = ServerSetup.validate(values());
    document.querySelector('#server-continue').disabled = !server.valid;
    document.querySelector('#generate').disabled = !all.valid;
    document.querySelector('#server-status').textContent = server.valid ? 'اطلاعات سرور کامل است؛ ادامه بده.' : Object.values(server.errors)[0];
    document.querySelector('#config-status').textContent = all.valid ? 'همهٔ اطلاعات کامل است؛ پرامپت را بساز.' : !server.valid ? 'ابتدا اطلاعات سرور را در اسلاید ۴ کامل کن.' : Object.values(all.errors)[0];
    for (const [key, field] of Object.entries(fields)) field.setAttribute('aria-invalid', String(Boolean(field.value && all.errors[key])));
    return all;
  }
  for (const form of [serverForm, repositoryForm]) {
    form.addEventListener('input', () => { invalidate(); validate(); });
    form.addEventListener('change', () => { invalidate(); validate(); });
  }
  serverForm.addEventListener('submit', event => { event.preventDefault(); if (ServerSetup.validateServer(values()).valid) seek('github'); });
  repositoryForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!validate().valid) return;
    result = ServerSetup.generate(values());
    output.value = result.prompt;
    document.querySelector('#prompt-preview').textContent = result.prompt.slice(0, 900) + '\n…';
    document.querySelector('#reconnect-command').textContent = result.reconnect;
    document.querySelectorAll('[data-download-prompt],[data-needs-config]').forEach(el => { el.disabled = false; });
    document.querySelector('#copy-prompt').disabled = false;
    document.querySelector('#open-prompt').disabled = false;
    renderSession();
    seek('prompt');
  });
  document.querySelector('#new-session-name').addEventListener('input', renderSession);
  document.querySelector('#open-prompt').addEventListener('click', () => dialog.showModal());
  document.querySelector('#close-prompt').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button:not(:disabled), textarea, a[href]')].filter(el => el.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  dialog.addEventListener('close', () => document.querySelector('#open-prompt').focus({ preventScroll: true }));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copy);
    const text = target.value || target.textContent;
    if (!text) return;
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(text); copied = true; } catch { /* local-file fallback below */ }
    }
    if (!copied) {
      const area = document.createElement('textarea');
      area.value = text; area.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      // Native modal dialogs make the page inert, so put the fallback in the dialog when open.
      (dialog.open ? dialog : document.body).append(area); area.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      area.remove(); button.focus({ preventScroll: true });
    }
    const message = copied ? 'متن کامل کپی شد.' : 'کپی خودکار ممکن نشد؛ متن را انتخاب و از گزینهٔ کپی مرورگر استفاده کن.';
    document.querySelector('#copy-status').textContent = message;
    document.querySelector('#dialog-copy-status').textContent = message;
    clearTimeout(copyTimer);
    copyTimer = setTimeout(() => { document.querySelector('#copy-status').textContent = ''; document.querySelector('#dialog-copy-status').textContent = ''; }, 6000);
    if (!copied) {
      if (target === output && !dialog.open) dialog.showModal();
      if (target instanceof HTMLTextAreaElement) { target.focus({ preventScroll: true }); target.select(); }
      else { const range = document.createRange(); range.selectNodeContents(target); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); }
    }
  }));
  document.querySelectorAll('[data-download-prompt]').forEach(button => button.addEventListener('click', () => {
    if (!result) return;
    const address = URL.createObjectURL(new Blob([result.prompt], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = address; link.download = 'claude-server-setup-v0.2.txt'; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(address), 1000);
  }));
  const localForm = document.querySelector('#local-form');
  const branchSelect = document.querySelector('#local-branch');
  function renderGit() {
    const custom = branchSelect.value === 'custom';
    document.querySelector('#custom-branch-label').hidden = !custom;
    const branch = custom ? document.querySelector('#custom-branch').value.trim() : branchSelect.value;
    const shell = document.querySelector('#local-shell').value;
    document.querySelector('#local-path').placeholder = shell === 'powershell' ? 'C:\\Users\\you\\project' : '/home/you/project';
    try {
      const commands = ServerSetup.gitCommands({ localPath: document.querySelector('#local-path').value, branch, shell });
      document.querySelector('#pull-command').textContent = commands.pull;
      document.querySelector('#push-command').textContent = commands.push;
      document.querySelector('#copy-pull').disabled = false;
      document.querySelector('#copy-push').disabled = false;
      document.querySelector('#local-status').textContent = 'دستورهای همین پوشه و شاخه آماده‌اند.';
    } catch {
      document.querySelector('#pull-command').textContent = 'مسیر پوشه و شاخه را مشخص کن.';
      document.querySelector('#push-command').textContent = 'مسیر پوشه و شاخه را مشخص کن.';
      document.querySelector('#copy-pull').disabled = true;
      document.querySelector('#copy-push').disabled = true;
      document.querySelector('#local-status').textContent = 'مسیر پوشه و یک نام شاخهٔ معتبر را وارد کن.';
    }
  }
  localForm.addEventListener('submit', event => event.preventDefault());
  localForm.addEventListener('input', renderGit);
  localForm.addEventListener('change', renderGit);
  function reset() {
    serverForm.reset(); repositoryForm.reset(); localForm.reset();
    document.querySelector('#local-shell').value = /Win/i.test(navigator.platform) ? 'powershell' : 'bash';
    document.querySelector('#new-session-name').value = 'work-2';
    invalidate(); validate(); renderGit();
  }
  document.querySelector('#clear-inputs').addEventListener('click', reset);
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
