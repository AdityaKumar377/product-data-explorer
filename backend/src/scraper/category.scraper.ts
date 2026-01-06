import { PlaywrightCrawler } from 'crawlee';

export async function scrapeCategories(
  navigationSlug: string,
  navigationUrl: string,
): Promise<{ title: string; slug: string; navigationSlug: string }[]> {

  const results: {
    title: string;
    slug: string;
    navigationSlug: string;
  }[] = [];

  const crawler = new PlaywrightCrawler({
    maxConcurrency: 1,
    requestHandlerTimeoutSecs: 60,
    requestHandler: async ({ page }) => {
      await page.waitForLoadState('networkidle');

      const links = await page.$$eval('a', (anchors) =>
        anchors
          .map((a) => ({
            title: a.textContent?.trim() || '',
            href: a.href,
          }))
          .filter(
  (a) =>
    a.title.length > 2 &&
    a.href.startsWith('https://www.worldofbooks.com'),
),
      );

      console.log('Found links (sample):', links.slice(0, 10));

      for (const link of links) {
        const slug = link.href
          .split('/')
          .filter(Boolean)
          .pop();

        if (slug) {
          results.push({
            title: link.title,
            slug,
            navigationSlug,
          });
        }
      }
    },
  });

  await crawler.run([{ url: navigationUrl }]);

  return results;
}
