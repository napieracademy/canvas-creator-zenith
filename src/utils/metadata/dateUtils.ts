
export const extractDates = (doc: Document): { publicationDate?: string; modificationDate?: string } => {
  const publicationDate = 
    doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="og:article:published_time"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="publication_date"]')?.getAttribute('content') ||
    doc.querySelector('time[pubdate]')?.getAttribute('datetime') ||
    doc.querySelector('.published-date')?.getAttribute('datetime') ||
    doc.querySelector('time[class*="publish"]')?.getAttribute('datetime');

  const modificationDate = 
    doc.querySelector('meta[property="article:modified_time"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="og:article:modified_time"]')?.getAttribute('content') ||
    doc.querySelector('meta[property="last-modified"]')?.getAttribute('content') ||
    doc.querySelector('time[class*="modified"]')?.getAttribute('datetime');

  return { publicationDate, modificationDate };
};
