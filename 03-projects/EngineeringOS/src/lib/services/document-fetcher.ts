import { SourceProfile } from './runtime-fetch-source-profiles';

export interface RawDocument {
  url: string;
  content: string;
  sourceProfile: SourceProfile;
}

export async function fetchDocumentContent(profile: SourceProfile): Promise<RawDocument[]> {
  const documents: RawDocument[] = [];

  for (const url of profile.explicitDocumentUrls) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (response.ok) {
        const text = await response.text();
        documents.push({
          url,
          content: text,
          sourceProfile: profile
        });
      } else {
        console.error(`Failed to fetch ${url}: HTTP status ${response.status}`);
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`Failed to fetch ${url}: ${msg}`);
    }
  }

  return documents;
}
