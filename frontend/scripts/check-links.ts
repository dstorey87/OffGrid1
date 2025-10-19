#!/usr/bin/env tsx
/**
 * Link and Asset Integrity Checker
 * Crawls the running site and checks for broken links and missing assets
 * Exit code 1 if any broken links/assets are found
 */

import * as http from 'http';
import * as https from 'https';
import { URL } from 'url';

interface CheckResult {
  url: string;
  status: number;
  error?: string;
}

interface CrawlStats {
  pagesChecked: number;
  linksChecked: number;
  assetsChecked: number;
  brokenLinks: CheckResult[];
  brokenAssets: CheckResult[];
}

const BASE_URL = process.env.SITE_URL || 'http://localhost:3000';
const visited = new Set<string>();
const toVisit: string[] = [BASE_URL];
const stats: CrawlStats = {
  pagesChecked: 0,
  linksChecked: 0,
  assetsChecked: 0,
  brokenLinks: [],
  brokenAssets: [],
};

/**
 * Make HTTP/HTTPS request and return status code
 */
async function checkUrl(urlString: string): Promise<CheckResult> {
  return new Promise((resolve) => {
    try {
      const url = new URL(urlString);
      const client = url.protocol === 'https:' ? https : http;

      const req = client.get(
        urlString,
        {
          timeout: 10000,
          headers: {
            'User-Agent': 'LinkChecker/1.0',
          },
        },
        (res) => {
          resolve({
            url: urlString,
            status: res.statusCode || 0,
          });
        }
      );

      req.on('error', (error) => {
        resolve({
          url: urlString,
          status: 0,
          error: error.message,
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({
          url: urlString,
          status: 0,
          error: 'Request timeout',
        });
      });
    } catch (error) {
      resolve({
        url: urlString,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}

/**
 * Extract all links and assets from HTML
 */
async function extractLinksAndAssets(url: string): Promise<{
  links: string[];
  assets: string[];
}> {
  const result = await checkUrl(url);

  if (result.status < 200 || result.status >= 400) {
    return { links: [], assets: [] };
  }

  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;

    client
      .get(url, (res) => {
        let html = '';

        res.on('data', (chunk) => {
          html += chunk.toString();
        });

        res.on('end', () => {
          const links: string[] = [];
          const assets: string[] = [];

          // Extract links (href)
          const hrefRegex = /href=["']([^"']+)["']/g;
          let match;
          while ((match = hrefRegex.exec(html)) !== null) {
            const href = match[1];
            if (!href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
              try {
                const absoluteUrl = new URL(href, url).toString();
                links.push(absoluteUrl);
              } catch {
                // Ignore invalid URLs
              }
            }
          }

          // Extract assets (src, srcset)
          const srcRegex = /src=["']([^"']+)["']/g;
          while ((match = srcRegex.exec(html)) !== null) {
            const src = match[1];
            try {
              const absoluteUrl = new URL(src, url).toString();
              assets.push(absoluteUrl);
            } catch {
              // Ignore invalid URLs
            }
          }

          resolve({ links, assets });
        });
      })
      .on('error', () => {
        resolve({ links: [], assets: [] });
      });
  });
}

/**
 * Main crawler function
 */
async function crawl(): Promise<void> {
  console.log(`🔍 Starting link check for ${BASE_URL}\n`);

  while (toVisit.length > 0) {
    const currentUrl = toVisit.shift();
    if (!currentUrl || visited.has(currentUrl)) {
      continue;
    }

    // Only crawl same-origin URLs
    const currentUrlObj = new URL(currentUrl);
    const baseUrlObj = new URL(BASE_URL);
    if (currentUrlObj.origin !== baseUrlObj.origin) {
      continue;
    }

    visited.add(currentUrl);
    stats.pagesChecked++;

    console.log(`Checking page: ${currentUrl}`);

    const { links, assets } = await extractLinksAndAssets(currentUrl);

    // Check all links
    for (const link of links) {
      stats.linksChecked++;
      const result = await checkUrl(link);

      if (result.status >= 400 || result.error) {
        stats.brokenLinks.push(result);
        console.error(`❌ Broken link: ${link} (Status: ${result.status})`);
      }

      // Add to crawl queue if same origin and not visited
      try {
        const linkUrlObj = new URL(link);
        if (linkUrlObj.origin === baseUrlObj.origin && !visited.has(link)) {
          toVisit.push(link);
        }
      } catch {
        // Ignore invalid URLs
      }
    }

    // Check all assets
    for (const asset of assets) {
      stats.assetsChecked++;
      const result = await checkUrl(asset);

      if (result.status >= 400 || result.error) {
        stats.brokenAssets.push(result);
        console.error(`❌ Broken asset: ${asset} (Status: ${result.status})`);
      }
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(80));
  console.log('Link Check Summary');
  console.log('='.repeat(80));
  console.log(`Pages checked: ${stats.pagesChecked}`);
  console.log(`Links checked: ${stats.linksChecked}`);
  console.log(`Assets checked: ${stats.assetsChecked}`);
  console.log(`Broken links: ${stats.brokenLinks.length}`);
  console.log(`Broken assets: ${stats.brokenAssets.length}`);
  console.log('='.repeat(80));

  if (stats.brokenLinks.length > 0) {
    console.log('\n❌ Broken Links:');
    stats.brokenLinks.forEach((result) => {
      console.log(`  - ${result.url} (${result.status}) ${result.error || ''}`);
    });
  }

  if (stats.brokenAssets.length > 0) {
    console.log('\n❌ Broken Assets:');
    stats.brokenAssets.forEach((result) => {
      console.log(`  - ${result.url} (${result.status}) ${result.error || ''}`);
    });
  }

  // Exit with error code if any broken links/assets found
  if (stats.brokenLinks.length > 0 || stats.brokenAssets.length > 0) {
    console.error('\n❌ Link check failed! Found broken links or assets.');
    process.exit(1);
  }

  console.log('\n✅ All links and assets are valid!');
  process.exit(0);
}

// Run the crawler
crawl().catch((error) => {
  console.error('Fatal error during link check:', error);
  process.exit(1);
});
