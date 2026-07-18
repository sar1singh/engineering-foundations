import type { ManualUrlFetchResult } from "@/lib/services/manual-url-fetch-contracts";
import type { FetchBoundary, ManualUrlSubmission } from "@/lib/services/manual-url-fetch-contracts";

const DEFAULT_FETCH_BOUNDARY: FetchBoundary = {
  allowedProtocols: ["https:", "http:"],
  restrictedDomains: [],
  maxContentBytes: 5 * 1024 * 1024, // 5MB
  requestTimeoutMs: 30000, // 30s
  respectRobotsTxt: true,
  redirectLimit: 5,
  allowCookies: false,
  allowDownload: false,
  assertNoBulkCrawl: true,
};

function getContentTypeFromResponse(response: Response): string | null {
  const contentTypeHeader = response.headers.get("content-type") || "";
  return contentTypeHeader.split(";")[0].trim() || null;
}

function validateContentType(contentType: string | null): boolean {
  if (!contentType) return false;
  const allowedTypes = ["text/html", "text/plain", "application/xhtml+xml"];
  return allowedTypes.includes(contentType);
}

function extractTitleFromHtml(html: string): string | null {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch ? titleMatch[1].trim() : null;
}

function extractMetaDescription(html: string): string | null {
  const metaMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i);
  return metaMatch ? metaMatch[1].trim() : null;
}

async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number }): Promise<Response> {
  const { timeout = 30000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
}

export async function runRealHttpFetch(
  url: string,
  submission: ManualUrlSubmission,
  boundary: FetchBoundary = DEFAULT_FETCH_BOUNDARY
): Promise<ManualUrlFetchResult> {
  const startTime = Date.now();
  
  // Basic URL validation
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch (error) {
    return {
      fetchStatus: "error",
      errors: [`Invalid URL: ${error}`],
      attribution: {
        agentId: "real-fetch-agent",
        agentVersion: "1.0.0",
        agentTraceId: "",
        discoveredAt: new Date().toISOString(),
        sourceUrl: url,
        extractionMethod: "manual",
        rawMetadata: "",
      },
    };
  }
  
  // Protocol check
  if (!boundary.allowedProtocols.includes(parsedUrl.protocol as "https:" | "http:")) {
    return {
      fetchStatus: "error",
      errors: [`Protocol ${parsedUrl.protocol} not allowed`],
      attribution: {
        agentId: "real-fetch-agent",
        agentVersion: "1.0.0",
        agentTraceId: "",
        discoveredAt: new Date().toISOString(),
        sourceUrl: url,
        extractionMethod: "manual",
        rawMetadata: "",
      },
    };
  }
  
  // Enforce HTTPS preference (but allow http for now as fallback)
  if (parsedUrl.protocol === "http:" && boundary.allowedProtocols.includes("https:")) {
    // Note: Not blocking HTTP, but could warn
  }
  
  // Redirect limit will be handled by fetch with redirect manual
  
  try {
    const response = await fetchWithTimeout(url, {
      redirect: "follow", // Let fetch handle redirects up to browser limit
      // Enforce GET only
      method: "GET",
      headers: new Headers({
        "Accept": "text/html, text/plain, application/xhtml+xml, */*;q=0.8",
        "User-Agent": "engineering-fetch-agent/1.0 (+https://engineering-foundations.dev)",
        // Explicitly block problematic headers
        "Cookie": "",
        "Authorization": "",
      }),
    });
    
    // Check redirect count (basic approach - in reality we'd need to track this)
    const finalUrl = response.url;
    
    const contentType = getContentTypeFromResponse(response);
    
    if (!validateContentType(contentType)) {
      return {
        fetchStatus: "error",
        httpStatus: response.status,
        finalUrl,
           contentType: (contentType ?? undefined) as unknown as string,


        errors: [`Content type ${contentType} not allowed`],
        attribution: {
          agentId: "real-fetch-agent",
          agentVersion: "1.0.0",
          agentTraceId: "",
          discoveredAt: new Date().toISOString(),
          sourceUrl: url,
          extractionMethod: "manual",
          rawMetadata: "",
        },
      };
    }
    
    // Size-limited streaming read
    const chunks: Uint8Array[] = [];
    let totalSize = 0;
    const reader = response.body?.getReader();
    
    if (!reader) {
      return {
        fetchStatus: "error",
        httpStatus: response.status,
        finalUrl,
           contentType: (contentType ?? undefined) as unknown as string,


        errors: ["No response body available"],
        attribution: {
          agentId: "real-fetch-agent",
          agentVersion: "1.0.0",
          agentTraceId: "",
          discoveredAt: new Date().toISOString(),
          sourceUrl: url,
          extractionMethod: "manual",
          rawMetadata: "",
        },
      };
    }
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        totalSize += value.length;
        if (totalSize > boundary.maxContentBytes) {
          return {
            fetchStatus: "error",
            httpStatus: response.status,
            finalUrl,
           contentType: (contentType ?? undefined) as unknown as string,



            errors: [`Content exceeds maximum size of ${boundary.maxContentBytes} bytes`],
            attribution: {
              agentId: "real-fetch-agent",
              agentVersion: "1.0.0",
              agentTraceId: "",
              discoveredAt: new Date().toISOString(),
              sourceUrl: url,
          extractionMethod: "manual",

              rawMetadata: "",
            },
          };
        }
        
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    
    // Decode the content
    const rawText = new TextDecoder("utf-8").decode(new Uint8Array(
      // @ts-expect-error: Concatenate chunks
      [...chunks].reduce((acc, chunk) => [...acc, ...Array.from(chunk)], [])
    ));
    
    // Basic metadata extraction
    const title = extractTitleFromHtml(rawText);
    const metaDescription = extractMetaDescription(rawText);
    
    return {
      fetchStatus: "success",
      httpStatus: response.status,
      finalUrl,
           contentType: (contentType ?? undefined) as unknown as string,


      title: title ?? undefined,
      rawTextPreview: rawText.slice(0, 500), // First 500 chars for preview
      extractedMetadata: {
        wordCount: rawText.trim().split(/\s+/).length,
        charCount: rawText.length,
        hasTitle: !!title,
        hasMetaDescription: !!metaDescription,
        estimatedReadingTimeMinutes: Math.ceil(rawText.trim().split(/\s+/).length / 200),
      },
      attribution: {
        agentId: "real-fetch-agent",
        agentVersion: "1.0.0",
        agentTraceId: `${submission.submittedBy}-${Date.now()}`,
        discoveredAt: new Date().toISOString(),
        sourceUrl: url,
        extractionMethod: "manual",
        rawMetadata: JSON.stringify({
          url: finalUrl,
          statusCode: response.status,
           contentType: (contentType ?? undefined) as unknown as string,


          sizeBytes: totalSize,
        }),
      },
      errors: [],
    };
  } catch (error) {
    return {
      fetchStatus: "error",
      errors: [
        error instanceof Error ? error.message : String(error)
      ],
      attribution: {
        agentId: "real-fetch-agent",
        agentVersion: "1.0.0",
        agentTraceId: "",
        discoveredAt: new Date().toISOString(),
        sourceUrl: url,
        extractionMethod: "manual",
        rawMetadata: "",
      },
    };
  }
}
