const puppeteer = require('puppeteer');
const fs = require('fs');

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

function pwn(payload) {
  void (async (payload) => {
    const browser = await puppeteer.launch({headless: false, args:['--disable-xss-auditor']});
    const page = await browser.newPage();
    page.on('dialog', (dialog) => {
      console.log('Payload OK!', payload);
      dialog.accept();
    });
    // const that = this;
    await page.goto('http://localhost:8000/');
    // await page.setCookie(...cookies);
    await page.type('input[name=test]', payload);
    await sleep(1000);
    await page.click('input[name=submit]');
    await page.waitForNavigation();
    try {
      await sleep(1000);
    } catch (err) {
      console.error('err', err);
    }
    await browser.close();
  })(payload);
}

fs.readFile('payloads.txt', 'utf-8', function(err, contents) {
  for(var payload of contents.split(/\r\n|\r|\n/)) {
    pwn(payload);
  };
});
