const puppeteer = require('puppeteer-core');
const path = require('path');

async function capture() {
  console.log('Starting screenshot capture...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setCacheEnabled(false);
    await page.setViewport({ width: 1280, height: 800 });
    
    console.log('Navigating to http://localhost:3000 ...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });
    
    console.log('Waiting for 4 seconds for framer-motion animations to complete...');
    await new Promise(r => setTimeout(r, 4000));
    
    const outputPath = path.resolve('C:\\Users\\Rishika\\.gemini\\antigravity\\brain\\189a2d39-6cfd-42c6-a115-cbcebc976fe5\\homepage_hero.png');
    console.log(`Saving screenshot to ${outputPath} ...`);
    await page.screenshot({ path: outputPath });
    console.log('Screenshot saved successfully!');
  } catch (err) {
    console.error('Error taking screenshot:', err);
  } finally {
    await browser.close();
  }
}

capture();
