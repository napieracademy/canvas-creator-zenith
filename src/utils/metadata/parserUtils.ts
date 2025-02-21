
import { ParsedContent } from './types';

export const extractMainContent = (doc: Document): string => {
  const mainContentSelectors = [
    'article',
    '[role="main"]',
    'main',
    '.post-content',
    '.article-content',
    '.entry-content',
    '#article-body',
    '.story-body',
    '.article-body',
    '.content-body'
  ];

  const unwantedSelectors = [
    'script', 'style', 'iframe', 'nav', 'header', 'footer', 'aside',
    'form', '.social', '.share', '.comments', '.related', '.sidebar',
    '.advertisement', '.newsletter', '.subscription'
  ];

  let mainElement = null;
  for (const selector of mainContentSelectors) {
    mainElement = doc.querySelector(selector);
    if (mainElement) break;
  }

  if (!mainElement) {
    mainElement = doc.body;
  }

  const clone = mainElement.cloneNode(true) as HTMLElement;

  unwantedSelectors.forEach(selector => {
    const elements = clone.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });

  const paragraphs = Array.from(clone.querySelectorAll('p'))
    .map(p => p.textContent?.trim())
    .filter(text => text && text.length > 20)
    .filter(text => {
      const unwantedPatterns = [
        /^in evidenza$/i,
        /^ultime notizie$/i,
        /^leggi anche$/i,
        /^potrebbe interessarti$/i,
        /^correlati$/i,
        /^articoli correlati$/i
      ];
      return !unwantedPatterns.some(pattern => pattern.test(text || ''));
    });

  return paragraphs.join('\n\n');
};

export const parseMetadata = (doc: Document, url: string): ParsedContent => {
  const title = 
    doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
    doc.querySelector('title')?.textContent || '';

  let description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
    doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
    doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="article:description"]')?.getAttribute('content');

  if (!description) {
    description = 
      doc.querySelector('.description p, .summary p, [class*="description"] p, [class*="summary"] p')?.textContent ||
      doc.querySelector('article p:first-of-type')?.textContent ||
      doc.querySelector('.article-content p:first-of-type')?.textContent ||
      doc.querySelector('.post-content p:first-of-type')?.textContent || '';
  }

  let image = 
    doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="twitter:image"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="twitter:image:src"]')?.getAttribute('content') ||
    doc.querySelector('link[rel="image_src"]')?.getAttribute('href') ||
    doc.querySelector('meta[name="thumbnail"]')?.getAttribute('content');

  if (image && !image.startsWith('http')) {
    try {
      const baseUrl = new URL(url);
      image = new URL(image, baseUrl.origin).toString();
    } catch {
      image = undefined;
    }
  }

  const author = 
    doc.querySelector('meta[name="author"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="article:author"]')?.getAttribute('content') || '';
    
  const publisher = 
    doc.querySelector('meta[property="og:site_name"]')?.getAttribute('content') ||
    doc.querySelector('meta[name="publisher"]')?.getAttribute('content') || 
    new URL(url).hostname.replace('www.', '');

  const extractedContent = extractMainContent(doc);

  return {
    title: title.trim(),
    description: description?.trim(),
    image,
    author,
    publisher,
    extractedContent
  };
};
