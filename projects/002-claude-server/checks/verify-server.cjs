/* V0.2 acceptance: start with the owner's scene/actor contract, then test mechanics. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = process.env.KANDOO_WORKSPACE || path.resolve(__dirname, '../../..');
const out = process.env.REVIEW_DIR || path.join(root, 'docs/projects/002-claude-server/versions/V0.2/verification/v95');
const origin = process.env.BLOG_URL || 'http://127.0.0.1:4173';
const api = require(path.join(root, 'projects/002-claude-server/site/generator.js'));
const release = JSON.parse(fs.readFileSync(path.join(root, 'dist/release.json')));
const meta = {version:release.projects['002-claude-server'].version, acceptance_contract:'inputs/v0.2-contract.json'};
const contract = JSON.parse(fs.readFileSync(path.join(root, 'projects/002-claude-server', meta.acceptance_contract)));
// Synthetic fixtures only: no reader credentials, account login or real provisioning.
const input = {ip:'203.0.113.42',port:'22',username:'root',password:'TEST_password_"\'$<tag>_رمز',repo:'git@github.com:example/test-project.git',token:'TEST_PAT_SYNTHETIC_ONLY_123'};
fs.mkdirSync(out,{recursive:true});
for (const change of [{ip:'1.2.3.999'},{ip:'host; rm -rf /'},{port:'70000'},{username:'root;whoami'},{password:''},{token:''},{token:'bad\nvalue'},{repo:'git@github.com:owner/../../escape.git'},{repo:'git@github.com:owner/repo;whoami'},{repo:'https://other.example/owner/repo'}]) {
  assert.equal(api.validate({...input,...change}).valid,false,'Invalid setup input must be rejected');
  assert.throws(()=>api.generate({...input,...change}));
}
assert.equal(api.validate({...input,ip:'۲۰۳.۰.۱۱۳.۴۲',port:'۲۲'}).valid,true);
assert.equal(api.validate({...input,ip:'2001:db8::42'}).valid,true);
assert.equal(api.repository('https://github.com/example/test-project').https,'https://github.com/example/test-project.git');
const generated=api.generate(input);
assert.ok(!/[^\x00-\x7f]/.test(generated.prompt),'Complete automation prompt must be English/ASCII; credential data is JSON escaped');
const payload=JSON.parse(generated.prompt.split('CONFIGURATION (JSON; decode escaped characters before use):\n')[1]);
assert.equal(payload.ssh_password,input.password);assert.equal(payload.github_token,input.token);
assert.equal(payload.github_repository_input,input.repo);assert.equal(payload.github_https_remote,'https://github.com/example/test-project.git');
for(const text of ['LOCAL COMPUTER','PUBLIC KEY FIRST','tmux','Git','Claude Code','CLAUDE.md','COMMIT AND PUSH','Before every user task','After completing that task'])assert.ok(generated.prompt.includes(text),`Missing delegated requirement: ${text}`);
assert.match(api.sessionCommand(generated,'notes-2'),/tmux new-session -A -s notes-2/);
assert.throws(()=>api.sessionCommand(generated,'x$(id)'));
for(const branch of ['bad;whoami','a..b','HEAD','-main','a//b'])assert.equal(api.validBranch(branch),false);

function verifyActualGitCommands(){
  const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'Git نسخه با فاصله '));
  const git=(args,cwd)=>execFileSync('git',args,{cwd,stdio:'pipe',encoding:'utf8'});
  try{
    for(const branch of ['main','master','docs/custom']){
      const folder=path.join(temporary,branch.replace('/','_'));fs.mkdirSync(folder);
      const remote=path.join(folder,'remote.git'),seed=path.join(folder,'seed'),local=path.join(folder,"Reader's پروژه");
      git(['init','--bare','--initial-branch',branch,remote],folder);git(['init','--initial-branch',branch,seed],folder);
      git(['config','user.name','Fixture'],seed);git(['config','user.email','fixture@example.test'],seed);
      fs.writeFileSync(path.join(seed,'README.md'),'Initial');git(['add','README.md'],seed);git(['commit','-m','Initial'],seed);git(['remote','add','origin',remote],seed);git(['push','-u','origin',branch],seed);
      git(['clone',remote,local],folder);git(['config','user.name','Fixture'],local);git(['config','user.email','fixture@example.test'],local);
      fs.writeFileSync(path.join(seed,'incoming.md'),'Remote edit');git(['add','incoming.md'],seed);git(['commit','-m','Remote edit'],seed);git(['push'],seed);
      const commands=api.gitCommands({localPath:local,branch,shell:'bash'});
      execFileSync('bash',['-c',commands.pull],{stdio:'pipe'});assert.equal(fs.readFileSync(path.join(local,'incoming.md'),'utf8'),'Remote edit');
      fs.writeFileSync(path.join(local,'local-doc.md'),'Local edit');execFileSync('bash',['-c',commands.push],{stdio:'pipe'});
      assert.equal(git(['--git-dir',remote,'show',`${branch}:local-doc.md`],folder),'Local edit');
      execFileSync('bash',['-c',commands.push],{stdio:'pipe'}); // no new commit: still pushes cleanly
    }
  }finally{fs.rmSync(temporary,{recursive:true,force:true})}
}
verifyActualGitCommands();
const ps=api.gitCommands({localPath:"C:\\Users\\Reader's project",branch:'master',shell:'powershell'});
assert.ok(ps.pull.includes("Reader''s project"));assert.ok(ps.push.includes('$LASTEXITCODE'));

(async()=>{
  const browser=await chromium.launch({executablePath:process.env.CHROME_BIN||'/usr/bin/google-chrome',args:['--no-sandbox']});
  const errors=[],failed=[],requests=[],checks=['generator validation, exact synthetic credentials in English JSON, PAT/HTTPS conversion','real Bash Git transactions on main/master/custom, spaced/Persian/apostrophe paths, pull, commit/push and no-change push'];
  const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce',acceptDownloads:true,permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('request',r=>requests.push({url:r.url(),body:r.postData(),type:r.resourceType()}));
  page.on('response',r=>{if(r.status()>=400)failed.push(`${r.status()} ${r.url()}`)});
  async function seek(p,id){await p.locator(`.segment[href="#${id}"]`).click();await p.waitForFunction(id=>document.querySelector('.segment[aria-current="step"]').getAttribute('href')==='#'+id,id)}
  async function fill(p){
    await seek(p,'server-details');await p.locator('#server-ip').fill('۲۰۳.۰.۱۱۳.۴۲');await p.locator('#server-user').fill('root');await p.locator('#server-password').fill(input.password);await p.locator('#ssh-port').fill('۲۲');
    await p.locator('#server-continue').click();assert.equal(await p.locator('#slide-title').textContent(),'آماده‌سازی گیت‌هاب');
    await seek(p,'repository-details');await p.locator('#repository').fill(input.repo);await p.locator('#github-token').fill(input.token);
  }
  try{
    assert.equal((await page.goto(`${origin}/002-claude-server/`)).status(),200);await page.evaluate(()=>document.fonts.ready);
    assert.deepEqual(await page.locator('.slide').evaluateAll(xs=>xs.map(x=>x.id)),contract.scene_order);
    for(const id of contract.removed_scene_ids)assert.equal(await page.locator('#'+id).count(),0);
    const problem=await page.locator('#problem').innerText();assert.match(problem,/ایرانی/);assert.match(problem,/۲۱ آبان/);assert.ok(!/کامپیوترت را ببند|راستی‌آزمایی|تضمین|قطع اتصال/.test(problem));
    assert.equal(await page.locator('#problem .terminal-art').count(),0);assert.equal(await page.locator('#solution .terminal-art').count(),1);
    assert.match(await page.locator('#solution h2').textContent(),/خارج از ایران/);assert.match(await page.locator('#server h2').textContent(),/بخر/);
    assert.equal(await page.locator('#server a[href="https://vpsmarket.org/vps-canada/"]').textContent(),'https://vpsmarket.org/vps-canada/');
    assert.equal(await page.locator('#server-password').getAttribute('type'),'password');assert.equal(await page.locator('#github-token').getAttribute('type'),'password');
    assert.ok((await page.locator('#github').innerText()).includes('Read and write'));assert.ok((await page.locator('#prompt').innerText()).includes('دسترسی کامل'));
    await page.screenshot({path:path.join(out,'v02-problem-desktop.png')});
    checks.push('source fidelity: exact twelve-scene order, account-closure opening, solution visual, buy action/URL, GitHub guide, removed AI-owned teaching scenes');
    assert.equal(await page.locator('#generate').isDisabled(),true);await fill(page);
    await page.locator('#server-ip').fill('1.2.3.999');assert.equal(await page.locator('#generate').isDisabled(),true);
    await page.locator('#server-ip').fill('۲۰۳.۰.۱۱۳.۴۲');await seek(page,'repository-details');await page.locator('#github-token').focus();await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#slide-title').textContent(),'آدرس مخزن و توکن');
    await page.locator('#generate').click();assert.equal(await page.locator('#slide-title').textContent(),'کپی برای دستیار محلی');
    const complete=await page.locator('#prompt-output').inputValue();assert.equal(complete,generated.prompt);
    const preview=await page.locator('#prompt-preview').textContent();assert.ok(preview.length<complete.length);assert.ok(!preview.includes(input.token));
    assert.notEqual(await page.locator('#prompt-preview').evaluate(el=>getComputedStyle(el).maskImage),'none');
    await page.locator('#copy-prompt').focus();await page.keyboard.press('Space');await page.waitForFunction(()=>document.querySelector('#copy-status').textContent.length>0);
    assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),complete);
    await page.locator('#open-prompt').click();assert.equal(await page.locator('#prompt-dialog').evaluate(d=>d.open),true);
    await page.locator('#prompt-output').focus();await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#slide-title').textContent(),'کپی برای دستیار محلی');
    for(let n=0;n<6;n++){await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>Boolean(document.activeElement.closest('#prompt-dialog'))),true)}
    await page.keyboard.press('Escape');assert.equal(await page.locator('#prompt-dialog').evaluate(d=>d.open),false);assert.equal(await page.evaluate(()=>document.activeElement.id),'open-prompt');
    const pending=page.waitForEvent('download');await page.locator('#prompt [data-download-prompt]').click();const download=await pending;
    assert.equal(fs.readFileSync(await download.path(),'utf8'),complete);assert.equal(download.suggestedFilename(),'claude-server-setup-v0.2.txt');
    await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#slide-title').textContent(),'اتصال به همان نشست');
    checks.push('complete English prompt includes exact entered credentials; short faded preview, modal focus/escape, full clipboard and download, input/native Space/arrows');
    const main=await page.locator('#reconnect-command').textContent();assert.equal(main,generated.reconnect);
    await seek(page,'new-session');await page.locator('#new-session-name').fill('notes-2');assert.match(await page.locator('#new-session-command').textContent(),/new-session -A -s notes-2/);assert.equal(await page.locator('#reconnect-command').textContent(),main);
    await page.locator('#new-session-name').fill('bad;name');assert.equal(await page.locator('#copy-session').isDisabled(),true);await page.locator('#new-session-name').fill('notes-2');
    await page.locator('#copy-session').click();await page.keyboard.press('ArrowDown');assert.equal(await page.locator('#slide-title').textContent(),'ورود به کلود');
    await seek(page,'local-edit');await page.locator('#local-path').fill("/tmp/Reader's پروژه");
    await page.locator('#local-shell').selectOption('bash');assert.match(await page.locator('#pull-command').textContent(),/switch 'main'/);
    await page.locator('#local-branch').selectOption('master');assert.match(await page.locator('#push-command').textContent(),/origin 'master'/);
    await page.locator('#local-branch').selectOption('custom');assert.equal(await page.locator('#copy-pull').isDisabled(),true);await page.locator('#custom-branch').fill('docs/custom');
    assert.match(await page.locator('#pull-command').textContent(),/docs\/custom/);await page.locator('#local-shell').selectOption('powershell');assert.match(await page.locator('#push-command').textContent(),/Reader''s/);
    await page.locator('#copy-push').click();await page.keyboard.press('ArrowUp');assert.equal(await page.locator('#slide-title').textContent(),'کار با کلود CLI');
    checks.push('independent create-or-attach named sessions; main/master/custom Git selector, shell quoting and post-click navigation');
    await seek(page,'server-details');await page.locator('#server-password').fill('TEST_changed');assert.equal(await page.locator('#prompt-output').inputValue(),'');assert.equal(await page.locator('#copy-prompt').isDisabled(),true);await page.locator('#server-password').fill(input.password);await seek(page,'repository-details');await page.locator('#generate').click();
    for(const view of [{width:1440,height:960},{width:1366,height:768},{width:390,height:844},{width:320,height:640}]){
      await page.setViewportSize(view);
      for(const id of contract.scene_order){await seek(page,id);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Overflow ${view.width}/${id}`)}
      await seek(page,'prompt');await page.screenshot({path:path.join(out,`v02-prompt-${view.width}.png`)});
      await page.locator('#open-prompt').click();assert.ok(await page.locator('#prompt-dialog').evaluate(el=>el.getBoundingClientRect().width<=innerWidth));await page.keyboard.press('Escape');
      checks.push(`all scenes and modal layout ${view.width}×${view.height}`);
    }
    await page.locator('#reading-toggle').click();assert.equal(await page.locator('#reading-toggle').getAttribute('aria-pressed'),'true');await page.locator('#reading-toggle').click();
    await page.reload();assert.equal(await page.locator('#server-password').inputValue(),'');assert.equal(await page.locator('#github-token').inputValue(),'');assert.equal(await page.locator('#prompt-output').inputValue(),'');
    assert.deepEqual(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length})),{local:0,session:0});
    assert.ok(requests.every(r=>!r.url.includes(input.token)&&!r.body?.includes(input.token)&&!['xhr','fetch'].includes(r.type)));
    checks.push('credential edits invalidate output; reading mode; refresh clears credentials; no storage or runtime credential requests');
    assert.equal(release.projects['002-claude-server'].targets.offline,undefined);
    assert.equal(await page.locator('a[href$="claude-server-v0.2.zip"]').count(),0);
    checks.push('web delivery without an automatically generated article ZIP');
    assert.deepEqual(errors,[]);assert.deepEqual(failed,[]);
    const report={checked_at:new Date().toISOString(),url:origin,project:'002-claude-server',version:meta.version,primary_input:contract.primary_input,checks,page_errors:errors,failed_requests:failed,real_server_provisioning_tested:false,powershell_execution_tested:false,credential_fixtures:'synthetic only'};
    fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
  }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
