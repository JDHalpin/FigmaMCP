import fs from "node:fs/promises";
import { Plan } from "../types";

export async function writePlan(plan: Plan, path = "docs/flow.plan.json") {
  await fs.mkdir("docs", { recursive: true });
  await fs.writeFile(path, JSON.stringify(plan, null, 2), "utf8");
  console.log(`📝 Wrote ${path}`);
}
