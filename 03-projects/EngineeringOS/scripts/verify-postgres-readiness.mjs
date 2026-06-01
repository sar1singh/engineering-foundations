import { readFileSync } from "node:fs";

const envFile = readLocalEnv();
const databaseUrl = process.env.DATABASE_URL ?? envFile.DATABASE_URL ?? "";
const deployMode = process.env.ENGINEERINGOS_DEPLOY_MODE ?? "local";

if (deployMode === "beta" || deployMode === "production") {
  if (!databaseUrl.startsWith("postgresql://")) {
    console.error("Beta/production Postgres verification requires DATABASE_URL=postgresql://...");
    process.exit(1);
  }
}

if (!databaseUrl) {
  console.error("DATABASE_URL is required for database readiness verification.");
  process.exit(1);
}

console.log(
  JSON.stringify({
    ok: true,
    deployMode,
    provider: databaseUrl.startsWith("postgresql://") ? "postgresql" : databaseUrl.startsWith("file:") ? "sqlite" : "unknown",
    message: "Database readiness env check passed. Run Prisma migration verification against the target DB before beta."
  })
);

function readLocalEnv() {
  try {
    const content = readFileSync(".env", "utf8");
    return Object.fromEntries(
      content
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => {
          const [key, ...valueParts] = line.split("=");
          return [key, valueParts.join("=").replace(/^"|"$/g, "")];
        })
    );
  } catch {
    return {};
  }
}
