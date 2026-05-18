// 导出功能 —— Word / Excel 生成

import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import ExcelJS from "exceljs";

/**
 * 生成 Word 文档 buffer（Listing 全案报告）
 */
export async function generateWordReport(data: {
  title: string;
  sections: { heading: string; content: string }[];
}): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            text: data.title,
            heading: HeadingLevel.HEADING_1,
          }),
          ...data.sections.flatMap((section) => [
            new Paragraph({
              text: section.heading,
              heading: HeadingLevel.HEADING_2,
            }),
            new Paragraph({
              children: [new TextRun(section.content)],
            }),
          ]),
        ],
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}

/**
 * 生成 Excel 文件 buffer（利润表 / 广告数据 / 关键词矩阵）
 */
export async function generateExcelReport(
  sheetName: string,
  columns: string[],
  rows: (string | number)[][]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  sheet.columns = columns.map((col, i) => ({
    header: col,
    key: `col${i}`,
    width: 20,
  }));

  rows.forEach((row) => {
    const obj: Record<string, string | number> = {};
    row.forEach((val, i) => {
      obj[`col${i}`] = val;
    });
    sheet.addRow(obj);
  });

  return Buffer.from(await workbook.xlsx.writeBuffer());
}
