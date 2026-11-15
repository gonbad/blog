(function (global) {
  'use strict';
  const terminals = {
    windows: [['powershell', 'PowerShell'], ['cmd', 'Command Prompt (CMD)'], ['wsl', 'WSL / Bash']],
    macos: [['terminal', 'Terminal'], ['iterm', 'iTerm2']],
    linux: [['bash', 'Bash / ترمینال لینوکس'], ['zsh', 'Zsh']]
  };
  const digits = value => String(value || '').replace(/[۰-۹٠-٩]/g, c => String(c.charCodeAt(0) >= 1776 ? c.charCodeAt(0) - 1776 : c.charCodeAt(0) - 1632)).trim();
  function validIP(value) {
    if (/^\d+\.\d+\.\d+\.\d+$/.test(value)) return value.split('.').every(part => /^(0|[1-9]\d{0,2})$/.test(part) && Number(part) <= 255);
    if (!/^[a-fA-F0-9:]+$/.test(value) || !value.includes(':')) return false;
    try { return new URL(`http://[${value}]/`).hostname.startsWith('['); } catch { return false; }
  }
  function repository(value) {
    let host, port = '', path;
    const scp = /^git@([a-zA-Z0-9.-]+):([a-zA-Z0-9._/-]+)$/.exec(value);
    if (scp) [, host, path] = scp;
    else {
      const uri = /^ssh:\/\/git@([a-zA-Z0-9.-]+)(?::(\d+))?\/([a-zA-Z0-9._/-]+)$/.exec(value);
      if (!uri) return null;
      [, host, port, path] = uri;
      if (port && (Number(port) < 1 || Number(port) > 65535)) return null;
    }
    if (!host.includes('.') || host.split('.').some(p => !/^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(p))) return null;
    const parts = path.split('/');
    if (parts.length < 2 || parts.some(p => !p || p === '.' || p === '..' || !/^[a-zA-Z0-9._-]+$/.test(p))) return null;
    const name = parts.at(-1).replace(/\.git$/, '');
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/.test(name)) return null;
    return { host: host.toLowerCase(), name, path, port };
  }
  function validate(input) {
    const value = { os: input.os, terminal: input.terminal, ip: digits(input.ip), port: digits(input.port), repo: String(input.repo || '').trim(), session: String(input.session || '').trim() };
    const errors = {};
    if (!terminals[value.os]) errors.os = 'سیستم‌عامل کامپیوترت را انتخاب کن.';
    if (!terminals[value.os]?.some(([id]) => id === value.terminal)) errors.terminal = 'ترمینال همین سیستم‌عامل را انتخاب کن.';
    if (!validIP(value.ip)) errors.ip = 'آی‌پی IPv4 یا IPv6 معتبر وارد کن.';
    if (!/^\d{1,5}$/.test(value.port) || Number(value.port) < 1 || Number(value.port) > 65535) errors.port = 'درگاه باید عددی میان ۱ و ۶۵۵۳۵ باشد.';
    const repo = repository(value.repo);
    if (!repo) errors.repo = 'نشانی SSH مخزن را وارد کن؛ مانند git@github.com:you/project.git';
    if (!/^[a-zA-Z][a-zA-Z0-9_-]{0,31}$/.test(value.session)) errors.session = 'نام نشست: حداکثر ۳۲ حرف لاتین، عدد، خط تیره یا زیرخط؛ با حرف شروع شود.';
    return { valid: Object.keys(errors).length === 0, errors, value, repository: repo };
  }
  function generate(input) {
    const checked = validate(input);
    if (!checked.valid) throw new Error(Object.values(checked.errors).join(' '));
    const c = checked.value, repo = checked.repository;
    const folder = `/root/projects/${repo.name}`;
    const alias = `workshop-${c.ip.replace(/[:.]/g, '-')}`;
    const reconnect = `ssh -t ${alias} "tmux new-session -A -s ${c.session} -c ${folder}"`;
    const newSession = `ssh -t ${alias} "tmux new-session -s ${c.session}-new -c ${folder}"`;
    const terminalLabel = terminals[c.os].find(([id]) => id === c.terminal)[1];
    const prompt = `من می‌خواهم محیط کاری Claude Code پروژه‌ام را روی سرور خودم آماده کنی. تو دستیار نصب‌شده روی کامپیوتر من هستی؛ کارهای ترمینال و تنظیمات را خودت انجام بده و فقط در جاهایی که ورود تعاملی یا حساب من لازم است، از من کمک بگیر.

مشخصات این درخواست:
سیستم‌عامل کامپیوتر: ${c.os}
ترمینال انتخاب‌شده: ${terminalLabel}
آی‌پی سرور: ${c.ip}
درگاه SSH: ${c.port}
کاربر سرور: root (کاربر جدید نساز)
سیستم‌عامل مورد انتظار سرور: Ubuntu 24.04
مخزن: ${c.repo}
مسیر پروژه روی سرور: ${folder}
نشست اصلی tmux: ${c.session}
نام اتصال در SSH config کامپیوتر: ${alias}

۱. اول محیط واقعی را بررسی کن.
ابزارهای فعلی کامپیوتر، ترمینال انتخاب‌شده و OpenSSH را تشخیص بده. اگر WSL انتخاب شده، کلید و تنظیم SSH را در همان محیطی بساز که دستورهای بعدی در آن اجرا می‌شوند. وضعیت سرور را قبل از نصب بخوان: نسخهٔ اوبونتو، RAM، CPU، دیسک و ابزارهای موجود. مبنای آموزش ۴ گیگ RAM، ۲ CPU و ۲۰ گیگ دیسک است. اگر سرور با این مشخصات تطابق ندارد یا ابزار تو امکان اتصال تعاملی ندارد، دقیق توضیح بده؛ موفقیت را جعل نکن. داده‌ها و سرویس‌های موجود را حفظ کن.

۲. اتصال کلیدی کامپیوتر به سرور را خودت آماده کن.
یک کلید مناسب موجود یا یک کلید اختصاصی Ed25519 برای این سرور استفاده کن؛ فایل کلید موجود را بازنویسی نکن. نصب کلید عمومی روی سرور را خودت آغاز کن؛ از من نخواه ssh-copy-id را دستی اجرا کنم. در ویندوز، اگر ssh-copy-id موجود نیست از معادل سازگار با PowerShell/CMD یا WSL استفاده کن. رمز ورود اولیه را فقط در یک ترمینال محلیِ تعاملی وارد می‌کنم؛ آن را در چت، فایل، آرگومان فرمان یا گزارش درخواست و ذخیره نکن. اثرانگشت میزبان را برای تطبیق با پنل فروشنده نشان بده. گذرواژهٔ کلید و ssh-agent را با امکانات واقعی محیط مدیریت کن.
در فایل SSH config همان محیط محلی، یک Host به نام ${alias} با HostName ${c.ip}، User root، Port ${c.port} و IdentityFile کلید انتخاب‌شده بساز؛ تنظیمات قبلی را نگه دار. سپس اتصال بدون رمز ورود سرور را با BatchMode=yes آزمایش کن. سیاست احراز هویت و فایروال سرور را برای این کار بی‌خبر تغییر نده.

۳. ابزارهای سرور را آماده کن.
وجود git، tmux، curl و ca-certificates را بررسی و موارد لازم را با apt نصب کن. Claude Code را با روش رسمی لینوکس نصب کن؛ در مستندات فعلی دستور اصلی این است:
curl -fsSL https://claude.ai/install.sh | bash
منبع را از https://code.claude.com/docs/en/setup بررسی کن. PATH کاربر root باید /root/.local/bin را بشناسد؛ فقط در صورت نیاز تنظیم پروفایل شل را بدون خراب کردن محتوای قبلی تکمیل کن. خروجی واقعی git --version، tmux -V و claude --version را ثبت کن. از کلید API یا کپی اعتبارنامهٔ کامپیوتر به سرور به جای ورود رسمی اشتراک استفاده نکن.

۴. کلید مستقل سرور برای مخزن را آماده کن.
برای ارتباط سرور با ${repo.host} یک کلید مناسب جدا از کلید کامپیوتر استفاده کن. فقط کلید عمومی را نشان بده تا در حساب Git ارائه‌دهنده، به عنوان Authentication key ثبت کنم؛ کلید خصوصی روی سرور بماند. بعد از اعلام انجام این کار، دسترسی واقعی همین مخزن را با git ls-remote آزمایش کن. در GitHub پیام موفق ssh -T ممکن است با exit code غیرصفر همراه باشد؛ صرفاً از کد خروج نتیجهٔ نادرست نگیر.

۵. پروژه را کلون و بررسی کن.
اگر مسیر وجود ندارد:
git clone ${c.repo} ${folder}
اگر وجود دارد، remote و وضعیت را بررسی کن؛ مخزن دیگری را جایگزین یا تغییرات موجود را حذف نکن. در همین پروژه git status --short --branch و remote را بخوان. اگر هویت Git برای commit تنظیم نیست، نام و ایمیل مورد نظر من را بپرس و فقط در صورت نیاز برای همین مخزن تنظیم کن.

۶. دستور پروژه را در CLAUDE.md ثبت کن.
محتوای فعلی و دستورهای پروژه را بخوان. قاعدهٔ زیر را در یک بخش مشخص و بدون تکرار اضافه کن؛ متن قبلی را جایگزین نکن:
«قبل از هر درخواست کاری pull کن؛ بعد از تکمیل همان کار و بررسی نتیجه، تغییرات مربوط به آن را commit و push کن. هر درخواست کاری یک مرز است، نه تک‌تک دستورهای ترمینال. پیش از pull وضعیت شاخه و تغییرات موجود را ببین؛ برای توقف روشن روی واگرایی، از git pull --ff-only استفاده کن. اگر تغییرات موجود، تعارض یا مجوز مانع شد، گزارش کن و چیزی را بازنویسی نکن. هرگز force-push یا حذف تغییرات دیگران انجام نده. اگر push نشد، دقیق بگو چه چیزی هنوز همگام نشده است.»
قاعده را برای همین آماده‌سازی هم اجرا کن: قبل از ویرایش همگام‌سازی را بررسی کن و پس از بررسی تغییر CLAUDE.md، همان تغییر را با اجازه و هویت موجود commit/push کن؛ موفقیت را فقط با نتیجهٔ واقعی اعلام کن.

۷. نشست پایدار را آماده کن و ورود به کلود را به من تحویل بده.
اگر نشست ${c.session} وجود ندارد، یک نشست tmux جداشده با working directory برابر ${folder} بساز. نشست موجود را نکش و فرایند قبلی را از بین نبر. برای ورود به حساب، من پس از اتصال داخل همین نشست و پروژه claude را اجرا می‌کنم. اگر مرورگر روی سرور باز نمی‌شود، لینک رسمی ورود را می‌گیرم و روی مرورگر کامپیوترم باز می‌کنم؛ فقط اگر خود ترمینال خواست، کد را آنجا وارد می‌کنم. توکن یا رمز حساب را در چت نخواه و ورود را بدون مشاهدهٔ نتیجه، انجام‌شده اعلام نکن. مستند ورود: https://code.claude.com/docs/en/authentication
اگر در root محدودیت یک حالت مجوز خاص دیده شد، همان محدودیت را توضیح بده؛ برای حل آن، bypass یا dangerously-skip-permissions را فعال نکن و کاربر جدید نساز.

۸. نتیجه و دستورهای برگشت را بده.
دستور برگشت به همین نشست، از ترمینال انتخاب‌شدهٔ کامپیوتر:
${reconnect}
ساخت یک نشست جدا با نام تازه:
${newSession}
اگر نام دوم قبلاً وجود دارد، برای نشست تازه نام دیگری پیشنهاد کن؛ نشست قبلی را پاک نکن. بعد از اتصال، داخل ${folder} دستور claude را اجرا می‌کنم. Ctrl+B سپس D از tmux جدا می‌شود. tmux با قطع SSH ادامه دارد، اما ریبوت سرور فرایندهایش را نگه نمی‌دارد.
گزارش آخر باید شامل آزمون واقعی اتصال SSH، نسخهٔ ابزارها، وضعیت دسترسی مخزن، مسیر پروژه، وضعیت تغییر CLAUDE.md و commit/push، وجود نشست، و کارهای انسانیِ باقی‌مانده برای ورود باشد. کار انجام‌نشده را صریح جدا کن. این تنظیمات و انتخاب‌ها مخصوص این پروژه‌اند.
`;
    return { prompt, reconnect, newSession, folder, alias, clone: `git clone ${c.repo} ${folder}\ncd ${folder}\ngit remote -v\ngit status --short --branch`, config: c };
  }
  const api = { terminals, validate, generate, validIP, repository };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (global) global.ServerSetup = api;
})(typeof window !== 'undefined' ? window : null);
