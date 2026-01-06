import { PlaywrightCrawler } from 'crawlee';

export async function testWorldOfBooks() {
  const crawler = new PlaywrightCrawler({
    maxConcurrency: 1,
    requestHandler: async ({ page }) => {
      const title = await page.title();
      console.log('Page title:', title);
    },
  });

  await crawler.run([
    { url: 'https://www.worldofbooks.com/' },
  ]);
}
