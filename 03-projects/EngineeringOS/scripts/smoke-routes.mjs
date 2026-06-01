import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const mode = process.argv.includes("--prisma") ? "prisma" : "mock";
const port = mode === "prisma" ? 3111 : 3110;
const baseUrl = `http://127.0.0.1:${port}`;
const routes = [
  "/dashboard",
  "/today",
  "/api/health",
  "/api/learner/profile",
  "/api/progress/summary",
  "/api/readiness",
  "/api/quality/status",
  "/courses",
  "/profile",
  "/signin",
  "/signup",
  "/onboarding",
  "/interview-rounds",
  "/sources",
  "/weak-areas",
  "/answer-builders",
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
  NEXT_PUBLIC_ENGINEERINGOS_DATA_SOURCE: mode,
  DATABASE_URL: mode === "prisma" ? process.env.DATABASE_URL ?? "file:./dev.db" : process.env.DATABASE_URL
};

const nextBin = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const server = spawn(process.execPath, [nextBin, "start", "--hostname", "127.0.0.1", "--port", String(port)], {
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
    const response = await fetchWithTimeout(`${baseUrl}${route}`, { redirect: "manual" }, 30000);
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
  await stopServer(server);
}

async function waitForServer(url) {
  const startedAt = Date.now();
  const timeoutMs = 30000;

  while (Date.now() - startedAt < timeoutMs) {
    try {
      const response = await fetchWithTimeout(url, { redirect: "manual" }, 5000);

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

async function fetchWithTimeout(url, init, timeoutMs) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function stopServer(child) {
  if (!child.pid || child.exitCode !== null) {
    return;
  }

  const exited = new Promise((resolve) => {
    child.once("exit", resolve);
  });

  if (process.platform === "win32") {
    const killer = spawn("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true
    });
    await new Promise((resolve) => killer.once("exit", resolve));
    await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 5000))]);
    return;
  }

  child.kill("SIGTERM");
  await Promise.race([exited, new Promise((resolve) => setTimeout(resolve, 5000))]);
}
