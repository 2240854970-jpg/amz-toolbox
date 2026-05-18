// Sorftime MCP 代理 API
// POST /api/sorftime - 中转请求到 Sorftime MCP

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { tool, args } = await req.json();

    if (process.env.SORFTIME_MCP_ENDPOINT && process.env.SORFTIME_API_KEY) {
      const res = await fetch(process.env.SORFTIME_MCP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.SORFTIME_API_KEY}`,
        },
        body: JSON.stringify({ name: tool, arguments: args }),
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({
      error: "Sorftime MCP 未配置。请设置 SORFTIME_MCP_ENDPOINT 和 SORFTIME_API_KEY 环境变量。",
    }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
