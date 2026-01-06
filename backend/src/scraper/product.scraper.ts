import { PlaywrightCrawler } from 'crawlee';

export async function scrapeProductsFromCategory(
  categorySlug: string,
  categoryUrl: string,
) {
  const results: {
    title: string;
    sourceId: string;
    sourceUrl: string;
    imageUrl: string;
    categorySlug: string;
  }[] = [];

  const crawler = new PlaywrightCrawler({
    maxConcurrency: 1,
    requestHandlerTimeoutSecs: 60,
    requestHandler: async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const products = await page.$$eval(
        'a',
        (anchors) =>
          anchors
            .map((a) => ({
              text: a.textContent?.trim() || '',
              href: a.href,
              img: a.querySelector('img')?.getAttribute('src') || '',
            }))
            .filter(
              (p) =>
                p.href.includes('/products/') &&
                !p.href.includes('world-of-books-plus') &&
                !p.text.toLowerCase().includes('join'),
            ),
      );

      // 🔍 Debug (you can remove later)
      console.log('Sample product links:', products.slice(0, 5));

      for (const p of products) {
        const parts = p.href.split('-');
        const sourceId = parts[parts.length - 1];

        results.push({
          title: p.text,
          sourceId,
          sourceUrl: p.href,
          imageUrl: p.img,
          categorySlug,
        });
      }
    },
  });

  await crawler.run([{ url: categoryUrl }]);

  // limit during testing
  return results.slice(0, 20);
}
