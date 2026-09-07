const { chromium } = require('C:/Users/irana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true});
 const context = await browser.newContext();
 const page = await context.newPage();
 const errors=[]; const results=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('response',r=>{if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`)});
 await page.goto('http://127.0.0.1:4175/?v=release-review-v21');
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:900});
  await page.getByRole('button',{name:'MENU',exact:true}).click();
  await page.getByRole('button',{name:/06.*Contact/}).click();
  await page.getByRole('dialog').waitFor();
  await page.waitForTimeout(500);
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);
  await page.screenshot({path:`docs/review-${width}.png`});
  await page.keyboard.press('Escape');
  results.push(`Menu, contact and viewport ${width}: pass`);
 }
 await page.setViewportSize({width:1440,height:900});
 await page.getByRole('button',{name:'MENU',exact:true}).click();
 await page.getByRole('button',{name:/06.*Contact/}).click();
 await page.locator('input[name=name]').fill('Release QA');
 await page.locator('input[name=contact]').fill('qa@example.test');
 await page.getByRole('button',{name:'Submit enquiry'}).click();
 await page.getByText('This message has not been sent',{exact:false}).waitFor();
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('eyvan_kheshti_leads_v2')).length),1);
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'MENU',exact:true}).click();
 await page.getByRole('button',{name:/01.*Projects/}).click();
 for(const label of ['Services','Projects','Tutorials','Architecture Notes','Courses & Shop']){
  await page.locator('.ek-library-tabs button').filter({hasText:label}).click();
  results.push(`Library ${label}: pass`);
 }
 await page.locator('input[name=email]').fill('qa@example.test');
 await page.getByRole('button',{name:'Join the journal'}).click();
 await page.getByText('Newsletter delivery is not connected',{exact:false}).waitFor();
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'نمایش فارسی'}).click();
 assert.equal(await page.locator('html').getAttribute('dir'),'rtl');
 await page.getByRole('button',{name:'Show English'}).click();
 await page.getByRole('button',{name:'Click to Begin'}).click();
 for(let i=0;i<6;i++){
  await page.waitForFunction(()=>{let v=document.querySelector('video');return v && v.readyState>=2 && v.currentTime>0.1});
  const state=await page.locator('video').evaluate(v=>({src:v.currentSrc,rate:v.playbackRate,duration:v.duration}));
  assert.equal(state.rate,[1.2,1.2,1.35,1.05,1.35,1.35][i]);
  results.push(state);
  await page.waitForFunction(()=>document.querySelector('video').ended,{},{timeout:60000});
  if(i<5) await page.getByRole('button',{name:'Click to Continue'}).click();
 }
 const audio=await page.locator('audio').evaluate(a=>({time:a.currentTime,paused:a.paused,error:a.error?.code}));
 assert(audio.time>0 && !audio.paused && !audio.error);
 results.push({audio});
 await page.goto('http://127.0.0.1:4175/#/admin');
 await page.getByRole('button',{name:/ورود به دموی مدیریت/}).click();
 for(const title of ['هویت و متن','متن روی ویدئو','خدمات','پروژه‌ها','آموزش‌ها','مطالب معماری','دوره‌ها و فروش','فروش و پرداخت','راه‌های ارتباطی','درخواست‌ها','اعضای خبرنامه','اتصال اپ']) {
  await page.locator('.admin-sidebar nav button').filter({hasText:title}).click();
  results.push(`Admin ${title}: pass`);
 }
 await page.screenshot({path:'docs/review-admin.png'});
 results.push({adminText:(await page.locator('body').innerText()).slice(0,700)});
 assert.equal(errors.length,0,JSON.stringify(errors));
 fs.writeFileSync('docs/release-browser-results.json',JSON.stringify({results,errors},null,2));
 console.log(JSON.stringify({results,errors},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
