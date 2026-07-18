import { realFetchOrchestrator } from '../src/lib/services/real-fetch-orchestrator';

async function main() {
  const families = [
    'system-design-primer',
    'computer-science',
    'roadmaps',
    'official-docs',
    'coding-interview-university',
    'cs-video-courses',
    'awesome-courses'
  ];
  console.log(`Starting execution for approved source families: ${families.join(', ')}`);
  for (const family of families) {
    try {
      console.log(`\n=== INGESTING SOURCE FAMILY: ${family} ===`);
      await realFetchOrchestrator(family);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`Error ingesting ${family}:`, msg);
    }
  }
  console.log(`\nAll ingestion sessions completed!`);
}

main().catch(console.error);
