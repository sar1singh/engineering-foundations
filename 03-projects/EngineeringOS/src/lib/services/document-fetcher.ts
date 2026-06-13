// Update document-fetcher.ts with real HTTP fetching
import axios from 'axios';

export async function fetchDocumentContent(profile: SourceFamilyProfile) {
  const documents = [];

  for (const url of profile.explicitDocumentUrls) {
    try {
      const response = await axios.get(url);
      if (response.status === 200) {
        documents.push({
          url,
          content: response.data,
          sourceProfile: profile
        });
      }
    } catch (error) {
      console.error(`Failed to fetch ${url}: ${error.message}`);
    }
  }

  return documents;
}
