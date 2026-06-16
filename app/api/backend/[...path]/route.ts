import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "http://34.50.70.186:8080";

async function proxy(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const targetUrl = `${BACKEND_URL}/${path.join("/")}${req.nextUrl.search}`;

  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("Content-Type") || "application/json",
    },
    body,
  });

  const data = await response.text();

  return new NextResponse(data, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("Content-Type") || "application/json",
    },
  });
}

export async function GET(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context);
}

export async function POST(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  return proxy(req, context);
}
