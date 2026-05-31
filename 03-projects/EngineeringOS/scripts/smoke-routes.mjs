import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const mode = process.argv.includes("--prisma") ? "prisma" : "mock";
const port = mode === "prisma" ? 3111 : 3110;
const baseUrl = `http://127.0.0.1:${port}`;
const routes = [
  "/dashboard",
  "/onboarding",
  "/graph",
  "/syllabus",
  "/syllabus/graph-bfs",
  "/topics/javascript",
  "/practice/practice-javascript",
  "/progress",
  "/content",
  "/quality",
  "/settings"
];

const childEnv = {
  ...process.env,
  NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE: mode
};

const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const server = spawn(process.execPath, [nextBin, "dev", "--hostname", "127.0.0.1", "--port", String(port)], {
  env: childEnv,
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true
});

let output = "";
server.stdout.on("data", (chunk) => {
  output += chunk.toString();
});
server.stderr.on("data", (chunk) => {
  output += chunk.toString();
});

try {
  await waitForServer(baseUrl);
  const results = [];

  for (const route of routes) {
    const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
    results.push(`${route} ${response.status}`);

    if (response.status < 200 || response.status >= 400) {
      throw new Error(`${route} returned ${response.status}`);
    }
  }

  console.log(`EngineeringOS ${mode} route smoke passed`);
  console.log(results.join("\n"));
} catch (error) {
  console.error(`EngineeringOS ${mode} route smoke failed`);
  console.error(error);
  console.error(output);
  process.exitCode = 1;
} finally {
  stopServer(server);
}

async function waitForServer(url) {
  const startedAt = Date.now();
  const timeoutMs = 30000;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetch(url, { redirect: "manual" });

      if (response.status < 500) {
        return;
      }
    } catch {
      // Keep waiting until Next finishes booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function stopServer(child) {
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true
    });
    return;
  }

  child.kill("SIGTERM");
}
