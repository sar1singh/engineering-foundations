import { createHash } from 'crypto';
import { RawDocument } from './document-fetcher';
import { NormalizedDocument } from './multi-document-ingestion/types';

export function getHash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

export function parseMarkdown(md: string): { title: string; headings: string[]; paragraphs: string[]; codeBlocks: string[] } {
  const headings: string[] = [];
  const paragraphs: string[] = [];
  const codeBlocks: string[] = [];
  let title = 'Untitled';

  const lines = md.split(/\r?\n/);
  let inCodeBlock = false;
  let currentCode = '';

  for (let line of lines) {
    line = line.trim();
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        if (currentCode) codeBlocks.push(currentCode.trim());
        currentCode = '';
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      currentCode += line + '\n';
      continue;
    }

    if (line.startsWith('#')) {
      const match = line.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const headingText = match[2].trim();
        headings.push(headingText);
        if (match[1].length === 1 && title === 'Untitled') {
          title = headingText;
        }
      }
      continue;
    }

    if (line.length > 20) {
      paragraphs.push(line);
    }
  }

  return { title, headings, paragraphs, codeBlocks };
}

export function parseHtml(html: string): { title: string; headings: string[]; paragraphs: string[]; codeBlocks: string[] } {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled';

  const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
  const headings: string[] = [];
  let match;
  while ((match = headingRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text) headings.push(text);
  }

  const paraRegex = /<p[^>]*>(.*?)<\/p>/gi;
  const paragraphs: string[] = [];
  while ((match = paraRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text && text.length > 20) paragraphs.push(text);
  }

  const codeRegex = /<(?:pre|code)[^>]*>(.*?)<\/(?:pre|code)>/gi;
  const codeBlocks: string[] = [];
  while ((match = codeRegex.exec(html)) !== null) {
    const text = match[1].replace(/<[^>]+>/g, '').trim();
    if (text && text.length > 10) codeBlocks.push(text);
  }

  return { title, headings, paragraphs, codeBlocks };
}

export async function normalizeDocumentContent(rawDocs: RawDocument[]): Promise<NormalizedDocument[]> {
  return rawDocs.map(doc => {
    const isHtml = doc.content.includes('<html') || doc.content.includes('<body') || doc.url.endsWith('.html');
    const parsed = isHtml ? parseHtml(doc.content) : parseMarkdown(doc.content);

    return {
      url: doc.url,
      normalizedContent: {
        title: parsed.title,
        headings: parsed.headings,
        paragraphs: parsed.paragraphs,
        codeBlocks: parsed.codeBlocks,
        contentHash: getHash(doc.content)
      },
      sourceProfile: {
        trustLevel: doc.sourceProfile.trustLevel,
        sourceType: isHtml ? 'html' : 'markdown',
        educationalCategory: doc.sourceProfile.educationalCategory,
        sourceFamily: doc.sourceProfile.sourceFamily
      }
    };
  });
}
