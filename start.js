const scraper = require("./helpers/scraper");
const puppeteer = require("puppeteer-extra");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
require("dotenv").config();

async function start() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  const page = await browser.newPage();
  await page.goto(`https://www.x.com/`, { waitUntil: "load" });

  setTimeout(async () => {
    await scraper(page);
  }, "60000");
}

start();
