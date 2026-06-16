import { NextResponse } from "next/server";

const BACKEND_URL = "http://34.50.70.186:8080";

export async function GET() {
  const response = await fetch(BACKEND_URL);
  const data = await response.text();

  return new NextResponse(data, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    },
  });
}
