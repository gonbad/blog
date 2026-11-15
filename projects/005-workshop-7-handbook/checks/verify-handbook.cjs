/* Verify the real handbook on HTTP and its intentional single-file material. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = process.env.KANDOO_WORKSPACE || path.resolve(__dirname, '../../..');
const materials = fs.readFileSync(path.join(root, 'docs/projects/005-workshop-7-handbook/living/materials.md'), 'utf8');
const kitVersion = materials.match(/^- Kit version: (.+)$/m)[1].trim();
const base = process.env.BLOG_URL || 'http://127.0.0.1:4173';
const evidence = process.env.REVIEW_DIR || path.join(root, 'docs/projects/005-workshop-7-handbook/versions/V0/V0.1/verification/v95');
fs.mkdirSync(evidence, {recursive:true});

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROME_BIN || '/usr/bin/google-chrome',args:['--no-sandbox']});
  const errors=[],bad=[],checks=[];
  const context=await browser.newContext({viewport:{width:1440,height:960},reducedMotion:'reduce'});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('response',r=>{if(r.status()>=400)bad.push(`${r.status()} ${r.url()}`);});
  try {
    assert.equal((await page.goto(base)).status(),200);
    await page.locator('.read-post[href="005-workshop-7-handbook/"]').click();
    await page.evaluate(()=>document.fonts.ready);
    assert.equal(await page.locator('main section').count(),12);
    await page.locator('#starter-os').selectOption({label:'Linux'});
    await page.locator('#starter-task').selectOption('bot');
    assert.match(await page.locator('#starter-prompt').textContent(),/Linux/);
    assert.match(await page.locator('#starter-prompt').textContent(),/bot-builder/);
    await page.locator('#copy-prompt').click();
    await page.waitForFunction(()=>document.querySelector('#copy-status').textContent.length>0);
    await page.locator('[data-check="host"]').focus();
    await page.keyboard.press('Space');
    await page.reload();
    assert.equal(await page.locator('[data-check="host"]').isChecked(),true);
    await page.locator('#reset-checks').click();
    assert.equal(await page.locator('[data-check]:checked').count(),0);
    checks.push('journal link, complete chapters, configurable start prompt, copy fallback, persisted/reset readiness');
    for(const width of [1440,768,390,320]){
      await page.setViewportSize({width,height:900});
      await page.evaluate(()=>document.fonts.ready);
      await page.evaluate(()=>window.scrollTo(0,0));
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Overflow at ${width}`);
      await page.screenshot({path:path.join(evidence,`handbook-${width}.png`),fullPage:width===1440});
    }
    await page.locator('#start').scrollIntoViewIfNeeded();
    await page.screenshot({path:path.join(evidence,'handbook-mobile-reading.png')});
    checks.push('desktop/tablet/mobile widths and keyboard-accessible native controls');
    for(const target of [`005-workshop-7-handbook/downloads/moom-${kitVersion}.zip`,'001-workshop-7/downloads/moom-0.1.zip','001-workshop-7/downloads/handbook-0.1.html']){
      assert.equal((await context.request.get(`${base}/${target}`)).status(),200,target);
    }
    await page.emulateMedia({media:'print'});
    assert.equal(await page.locator('.contents').isVisible(),false);
    assert.equal(await page.locator('#book').isVisible(),true);
    checks.push('current and legacy downloads; readable print layout');
    const offline=await browser.newContext({viewport:{width:390,height:844}});
    const remote=[];
    await offline.route(/^https?:/,route=>{remote.push(route.request().url());return route.abort();});
    const local=await offline.newPage();
    local.on('pageerror',e=>errors.push(String(e)));
    await local.goto(pathToFileURL(path.join(root,'dist/001-workshop-7/downloads/handbook-0.1.html')).href);
    await local.evaluate(()=>document.fonts.ready);
    await local.locator('#starter-task').selectOption('web');
    assert.match(await local.locator('#starter-prompt').textContent(),/web-app-builder/);
    await local.locator('[data-check="input"]').check();
    assert.equal(await local.locator('[data-check="input"]').isChecked(),true);
    await local.screenshot({path:path.join(evidence,'handbook-offline.png')});
    await local.goto(pathToFileURL(path.join(root,'dist/001-workshop-7/downloads/handbook-0.1.html')).href);
    await local.locator('#starter-task').selectOption('agent');
    assert.match(await local.locator('#starter-prompt').textContent(),/agentic-chatbot/);
    await local.screenshot({path:path.join(evidence,'standalone-handbook.png')});
    assert.deepEqual(remote,[],'Offline handbook requested network runtime');
    checks.push('intentional single-file handbook material without network runtime');
    assert.deepEqual(errors,[]);
    assert.deepEqual(bad,[]);
    const report={ok:true,checks,evidence,errors,bad};
    fs.writeFileSync(path.join(evidence,'handbook-checks.json'),JSON.stringify(report,null,2)+'\n');
    process.stdout.write(JSON.stringify(report,null,2)+'\n');
    await offline.close();
  } finally {await context.close();await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
