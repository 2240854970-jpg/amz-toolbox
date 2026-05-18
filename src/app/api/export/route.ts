// 导出 API
// POST /api/export - 生成 Word / Excel 文件

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { format, data } = await req.json();

    if (format === "word") {
      const { generateWordReport } = await import("@/lib/export");
      const buffer = await generateWordReport(data);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${data.title || "report"}.docx"`,
        },
      });
    }

    if (format === "excel") {
      const { generateExcelReport } = await import("@/lib/export");
      const buffer = await generateExcelReport(data.sheetName, data.columns, data.rows);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${data.sheetName || "data"}.xlsx"`,
        },
      });
    }

    return NextResponse.json({ error: "不支持的格式，请使用 word 或 excel" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
