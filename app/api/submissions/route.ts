import { readSubmissions } from "@/lib/data";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ submissions: readSubmissions() });
}
