/* Project 002: exercise the actual generator, browser inputs and offline archive. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = process.env.MOOM_WORKSPACE || path.resolve(__dirname, '..');
const out = process.env.REVIEW_DIR || path.join(os.tmpdir(), 'claude-server-review');
const origin = process.env.BLOG_URL || 'http://127.0.0.1:4173';
const api = require(path.join(root, 'projects/002-claude-server/site/generator.js'));
const input = {os:'windows',terminal:'powershell',ip:'203.0.113.42',port:'22',repo:'git@github.com:example/test-project.git',session:'work'};
fs.mkdirSync(out,{recursive:true});
for (const change of [{ip:'1.2.3.999'},{ip:'host; rm -rf /'},{port:'70000'},{repo:'git@github.com:owner/../../escape.git'},{repo:'https://github.com/owner/repo'},{repo:'git@github.com:owner/repo;whoami'},{session:'x$(id)'},{terminal:'bash'}]) {
  assert.equal(api.validate({...input,...change}).valid,false,JSON.stringify(change));
  assert.throws(()=>api.generate({...input,...change}));
}
for(const [ip,port] of [['۲۰۳.۰.۱۱۳.۴۲','۲۲'],['2001:db8::42','2222']]) assert.equal(api.validate({...input,ip,port}).valid,true);
assert.equal(api.validate({...input,repo:'ssh://git@gitlab.com:2222/group/sub/project.git'}).valid,true);
const generated = api.generate(input);
assert.match(generated.reconnect,/ssh -t workshop-203-0-113-42/);
assert.match(generated.prompt,/git pull --ff-only/);
assert.match(generated.prompt,/کاربر جدید نساز/);

(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']});
  const errors=[],failed=[],checks=['generator rejects unsafe/malformed inputs; Persian digits, IPv6 and SSH URI supported'];
  const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce',acceptDownloads:true});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
  async function seek(id){await page.locator(`.segment[href="#${id}"]`).click();await page.waitForFunction(id=>document.querySelector('.segment[aria-current="step"]').getAttribute('href')==='#'+id,id)}
  async function fill(p,system='windows',terminal='powershell'){
    await p.locator('#local-os').selectOption(system);await p.locator('#terminal').selectOption(terminal);
    await p.locator('#server-ip').fill('203.0.113.42');await p.locator('#repository').fill(input.repo);
  }
  try{
    assert.equal((await page.goto(`${origin}/002-claude-server/`)).status(),200);
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('.slide').count(),10);
    assert.equal(await page.locator('#generate').isDisabled(),true);
    await page.screenshot({path:path.join(out,'server-cover-desktop.png')});
    await seek('setup');await fill(page);
    await page.locator('#server-ip').fill('1.2.3.999');assert.equal(await page.locator('#generate').isDisabled(),true);
    await page.locator('#server-ip').fill('۲۰۳.۰.۱۱۳.۴۲');await page.locator('#ssh-port').fill('۲۲');
    assert.equal(await page.locator('#generate').isEnabled(),true);
    await page.locator('#server-ip').focus();await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#slide-title').textContent(),'مشخصات تو');
    await page.locator('#generate').click();
    assert.equal(await page.locator('#slide-title').textContent(),'پرامپت آماده');
    assert.match(await page.locator('#prompt-output').inputValue(),/آی‌پی سرور: 203.0.113.42/);
    await page.locator('#copy-prompt').focus();await page.keyboard.press('Space');await page.waitForFunction(()=>document.querySelector('#copy-status').textContent.length>0);
    assert.equal(await page.locator('#slide-title').textContent(),'پرامپت آماده');
    await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#slide-title').textContent(),'ورود و کلیدها');
    await page.keyboard.press('ArrowUp');assert.equal(await page.locator('#slide-title').textContent(),'پرامپت آماده');
    await page.locator('#prompt-output').focus();await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#slide-title').textContent(),'پرامپت آماده');
    const download=page.waitForEvent('download');await page.locator('#download-prompt').click();const promptDownload=await download;
    assert.equal(promptDownload.suggestedFilename(),'claude-server-setup.txt');
    assert.equal(fs.readFileSync(await promptDownload.path(),'utf8'),await page.locator('#prompt-output').inputValue());
    checks.push('form validation, generation, prompt download, native editing keys, arrows after buttons');
    await seek('setup');await page.locator('#session-name').fill('other');
    assert.equal(await page.locator('#copy-prompt').isDisabled(),true);assert.equal(await page.locator('#prompt-output').inputValue(),'');
    await page.locator('#generate').click();await seek('return');
    assert.match(await page.locator('#reconnect').textContent(),/-s other -c \/root\/projects\/test-project/);
    await page.locator('[data-copy="reconnect"]').click();await page.keyboard.press('ArrowUp');assert.equal(await page.locator('#slide-title').textContent(),'قاعدهٔ پروژه');
    await page.locator('#reading-toggle').click();assert.equal(await page.locator('#reading-toggle').getAttribute('aria-pressed'),'true');
    await page.locator('#reading-toggle').click();
    checks.push('stale generated output invalidated on edits, personalized commands, reading mode');
    for(const view of [{width:1440,height:960},{width:1366,height:768},{width:390,height:844},{width:320,height:640}]){
      await page.setViewportSize(view);
      for(const id of ['problem','server','setup','prompt','handoffs','project-rule','return','controls']){
        await seek(id);
        assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Horizontal overflow at ${view.width}/${id}`);
      }
      await seek('setup');await page.screenshot({path:path.join(out,`server-form-${view.width}.png`),fullPage:false});
      if(view.width===1440){await seek('prompt');await page.screenshot({path:path.join(out,'server-prompt.png')})}
      checks.push(`layout ${view.width}×${view.height}`);
    }
    await page.reload();assert.equal(await page.locator('#server-ip').inputValue(),'');assert.equal(await page.locator('#prompt-output').inputValue(),'');
    assert.deepEqual(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length})),{local:0,session:0});
    await page.locator('#local-os').selectOption('linux');assert.equal(await page.locator('#terminal option[value="powershell"]').count(),0);
    await page.locator('#terminal').selectOption('bash');await page.locator('#clear-inputs').click();assert.equal(await page.locator('#terminal').isDisabled(),true);
    checks.push('OS-specific terminal choices, memory-only inputs, reload/reset clears configuration');
    const archive=await context.request.get(`${origin}/002-claude-server/downloads/claude-server-v0.1.zip`);assert.equal(archive.status(),200);
    const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'آموزش سرور با فاصله '));
    const archivePath=path.join(temporary,'post.zip');fs.writeFileSync(archivePath,await archive.body());
    const extracted=path.join(temporary,'نسخه آفلاین');
    execFileSync('python3',['-c','import sys,zipfile;zipfile.ZipFile(sys.argv[1]).extractall(sys.argv[2])',archivePath,extracted]);
    assert.ok(!fs.existsSync(path.join(extracted,'downloads/claude-server-v0.1.zip')));
    const offline=await browser.newContext({offline:true,reducedMotion:'reduce',viewport:{width:390,height:844}});const op=await offline.newPage();const remote=[];
    op.on('request',r=>{if(/^https?:/.test(r.url()))remote.push(r.url())});op.on('pageerror',e=>errors.push(String(e)));
    await op.goto(pathToFileURL(path.join(extracted,'index.html')).href);await op.evaluate(()=>document.fonts.ready);
    assert.equal(await op.evaluate(()=>document.fonts.check('14px Estedad')),true);
    await op.locator('.segment[href="#setup"]').click();await fill(op,'macos','terminal');await op.locator('#generate').click();
    assert.match(await op.locator('#prompt-output').inputValue(),/ترمینال انتخاب‌شده: Terminal/);
    await op.locator('#copy-prompt').click();await op.waitForFunction(()=>document.querySelector('#copy-status').textContent.length>0);
    await op.keyboard.press('ArrowDown');assert.equal(await op.locator('#slide-title').textContent(),'ورود و کلیدها');
    assert.equal(await op.locator('[data-online-only]').isVisible(),false);assert.equal(remote.length,0);
    assert.match(await op.locator('[data-home-link]').getAttribute('href'),/^https:\/\//);
    assert.ok(fs.existsSync(path.join(extracted,'assets/vpsmarket-ca4.png')));
    await offline.close();fs.rmSync(temporary,{recursive:true,force:true});
    checks.push('actual downloaded ZIP: file://, Persian/spaced path, offline fonts, generator/copy/navigation, zero network requests');
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
    const report={checked_at:new Date().toISOString(),url:origin,project:'002-claude-server',checks,page_errors:errors,failed_requests:failed,real_server_provisioning_tested:false};
    fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
