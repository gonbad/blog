(() => {
  const form = document.querySelector('#starter-form');
  const prompt = document.querySelector('#starter-prompt');
  const names = {general:'یک کار تکراری عمومی',web:'ساخت وب‌اپلیکیشن با web-app-builder',bot:'ساخت ربات پیام‌رسان با bot-builder',agent:'بررسی نیاز به agentic-chatbot و انتخاب آن فقط اگر ربات ساده کافی نیست'};
  function render() {
    prompt.textContent = `سیستم من ${document.querySelector('#starter-os').value} است. می‌خواهم ${names[document.querySelector('#starter-task').value]} را انجام بدهم.
مخزن رسمی https://github.com/gonbad/moom را در یک پوشهٔ تازه دریافت کن؛ اگر همین پوشه قبلاً کندوی من است، آن را حفظ و ادامه بده. راهنماها و وضعیت واقعی را بخوان.
اگر این پوشه کندوی تنظیم‌شدهٔ من است، فقط با قانون اساسی و جاب نصب‌شده ادامه بده و به مخزن الگو مراجعه نکن. برای شروع تازه، /moom-start را اجرا کن: زبان گفت‌وگو و سندها را جدا بپرس، سیستم و Git را بررسی و در صورت دسترسی مخزن متعلق به خودم را با پشتیبان واقعی متصل کن؛ بدون شبکه با Git محلی ادامه بده. اگر خواستم هر مرحله‌ای را کنار بگذارم، ثبت کن و ادامه بده؛ بررسی انجام‌نشده را موفق ننام. موم فقط Markdown است؛ Python پیش‌نیاز عمومی نیست. خودت ابزارهای لازمِ کار را آماده و اجرا کن و باز کردن docs/ در Obsidian را توضیح بده.
همان ابتدا بپرس سرور دارم یا نه؛ اگر ندارم «ندارد» ثبت کن و ادامه بده. اگر دارم، SSH و کلید اختصاصی، دامنه یا نام رایگان nip.io، HTTPS معتبر و پروکسی HTTP دارای رمز را آماده و آزمایش کن. اطلاعات محرمانه فقط در فایل محلیِ نادیده‌گرفته‌شده بماند.
سپس /moom-job: شرح کار و پروژهٔ اول را در docs/kandoo/versions/0.1/00-job-input.md از من بگیر. پرسش‌ها و تصمیم‌های غیر‌بدیهی را در دورهای شماره‌دار با زمینه، گزینه‌ها، پیشنهاد صریح و جای پاسخ بیاور. پس از ارسال، پاسخ صریح قطعی است و جای خالی پیشنهاد موقت را واگذار می‌کند. جاب آماده را آزادانه تغییر بده یا جاب تازه بساز. جاب و فرمان‌های job-* را برای همهٔ میزبان‌ها کپی کن، ابتدا پروژهٔ اول را با ایدهٔ پرشده بساز و بررسی کن، سپس registry و سندهای شروع را از docs حذف کن؛ فرمان‌های شروعِ نصب‌شده را برای بازیابی از وضعیت نگه دار و بگو میزبان را ببندم و باز کنم و فرمان اول جاب را بزنم. در Codex CLI فرمان‌ها را با $ و در دسکتاپ با انتخاب اسلش یا دلار اجرا می‌کنم؛ در Antigravity مهارت را انتخاب یا نام می‌برم. هر پاسخ با پیشرفت و یک اقدام بعدی تمام شود.`;
  }
  form.addEventListener('change',render); render();
  document.querySelector('#copy-prompt').addEventListener('click',async () => {
    const status=document.querySelector('#copy-status');
    try { await navigator.clipboard.writeText(prompt.textContent); status.textContent='متن کپی شد.'; }
    catch { const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(prompt);selection.removeAllRanges();selection.addRange(range);status.textContent='متن انتخاب شد؛ آن را کپی کنید.'; }
  });
  const checks=[...document.querySelectorAll('[data-check]')];const key='workshop-7-readiness-v1';
  let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')||{};}catch{}
  checks.forEach(input=>{input.checked=saved[input.dataset.check]===true;});
  function progress(){const data={};checks.forEach(input=>{data[input.dataset.check]=input.checked;});try{localStorage.setItem(key,JSON.stringify(data));}catch{}document.querySelector('#readiness-count').textContent=`${checks.filter(input=>input.checked).length.toLocaleString('fa-IR')} از ${checks.length.toLocaleString('fa-IR')} مورد آماده است`;
  }
  checks.forEach(input=>input.addEventListener('change',progress));progress();
  document.querySelector('#reset-checks').addEventListener('click',()=>{checks.forEach(input=>{input.checked=false;});progress();});
  document.querySelector('#print-book').addEventListener('click',()=>window.print());
})();
