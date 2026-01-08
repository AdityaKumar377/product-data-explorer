import { PlaywrightCrawler } from 'crawlee';

export async function scrapeProductDetail(productUrl: string) {
  let result: {
    description: string | null;
    specs: Record<string, string>;
  } = {
    description: null,
    specs: {},
  };

  const crawler = new PlaywrightCrawler({
    maxConcurrency: 1,
    requestHandlerTimeoutSecs: 60,

    requestHandler: async ({ page }) => {
      // Wait for page + scripts
      await page.waitForTimeout(5000);

      // ✅ 1️⃣ DESCRIPTION (FROM JSON-LD)
      const description = await page.evaluate(() => {
        const scripts = Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        );

        for (const script of scripts) {
          try {
            const json = JSON.parse(script.textContent || '{}');

            // Book schema
            if (json['@type'] === 'Book' && json.description) {
              return json.description.trim();
            }

            // Sometimes wrapped in array
            if (Array.isArray(json)) {
              for (const item of json) {
                if (item['@type'] === 'Book' && item.description) {
                  return item.description.trim();
                }
              }
            }
          } catch {
            // ignore bad JSON
          }
        }

        return null;
      });

      // ✅ 2️⃣ SPECS (FROM "Additional information" LIST)
      const specs = await page.evaluate(() => {
        const data: Record<string, string> = {};

        document.querySelectorAll('li').forEach((li) => {
          const text = li.textContent?.trim();
          if (!text) return;

          const parts = text.split(':');
          if (parts.length === 2) {
            data[parts[0].trim()] = parts[1].trim();
          }
        });

        return data;
      });

      result = { description, specs };

      // DEBUG
      console.log('Scraped product detail (clean):', result);
    },
  });

  await crawler.run([{ url: productUrl }]);

  return result;
}
