import { test as setup } from "@playwright/test";
import { execSync } from "child_process";

setup("create new database", async () => {
  console.log("creating new database...");
  execSync("npm run db:migrate -w @repo/db", { stdio: "inherit" });
});
