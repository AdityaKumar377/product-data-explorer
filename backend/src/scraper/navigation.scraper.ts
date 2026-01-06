import { PlaywrightCrawler } from 'crawlee';

export async function scrapeNavigation(): Promise<
  { title: string; slug: string; sourceUrl: string }[]
> {
  const results: { title: string; slug: string; sourceUrl: string }[] = [];

  const crawler = new PlaywrightCrawler({
    maxConcurrency: 1,
    requestHandlerTimeoutSecs: 60,
    requestHandler: async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const links = await page.$$eval('a', (anchors) =>
        anchors
          .map((a) => ({
            title: a.textContent?.trim() || '',
            sourceUrl: a.href,
          }))
          .filter(
            (a) =>
              a.title.length > 2 &&
              a.sourceUrl.includes('/books')
          ),
      );

      for (const link of links) {
        const slug = link.sourceUrl
          .split('/')
          .filter(Boolean)
          .pop();

        if (slug) {
          results.push({
            title: link.title,
            slug,
            sourceUrl: link.sourceUrl,
          });
        }
      }
    },
  });

  await crawler.run([{ url: 'https://www.worldofbooks.com/' }]);

  return results;
}
