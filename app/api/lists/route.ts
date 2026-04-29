import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

export async function GET() {
  const listsPath = path.join(process.cwd(), "data", "lists.json");
  const lists = JSON.parse(fs.readFileSync(listsPath, "utf-8")) as unknown;
  return Response.json(lists);
}
