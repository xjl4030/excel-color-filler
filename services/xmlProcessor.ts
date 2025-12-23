
import { ProcessResult, ColorRow } from '../types';

declare const XLSX: any;

/**
 * Enhanced processor that handles Excel files and creates a previewable web version.
 * It parses the file (XML or XLSX), extracts color info, and prepares a styled XML download.
 */
export const processExcelXml = async (file: File): Promise<ProcessResult> => {
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert to JSON to extract preview data
  // Assuming Column B (index 1) is Hex, Column A is Name/ID
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
  
  const previewData: ColorRow[] = [];
  const hexRegex = /^(0x|#)?([0-9a-fA-F]{6})$/i;

  jsonData.forEach((row, index) => {
    if (index === 0) return; // Skip header
    const rawHex = String(row[1] || "");
    const match = rawHex.match(hexRegex);
    
    if (match) {
      let cleanHex = match[2].toUpperCase();
      previewData.push({
        row: index + 1,
        name: String(row[0] || `Row ${index + 1}`),
        hex: `#${cleanHex}`,
        preview: `#${cleanHex}`
      });
    }
  });

  if (previewData.length === 0) {
    throw new Error("在B列中没有检测到有效的十六进制色码。");
  }

  // To provide a styled download that Excel actually renders as color,
  // we generate an Excel XML 2003 string manually as standard XLSX community edition doesn't support styles.
  const xmlStyles = Array.from(new Set(previewData.map(d => d.hex)))
    .map(hex => `
      <Style ss:ID="cf_${hex.substring(1)}">
        <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
        <Interior ss:Color="${hex}" ss:Pattern="Solid"/>
      </Style>`).join('');

  const xmlRows = jsonData.map((row, rIdx) => {
    const cells = row.map((val, cIdx) => {
      let styleAttr = "";
      if (cIdx === 3 && rIdx > 0) { // Column D (index 3)
        const rawHex = String(row[1] || "");
        const match = rawHex.match(hexRegex);
        if (match) {
          styleAttr = ` ss:StyleID="cf_${match[2].toUpperCase()}"`;
        }
      }
      return `<Cell${styleAttr}><Data ss:Type="String">${val || ""}</Data></Cell>`;
    }).join('');
    
    // Ensure Column D exists if row has a color
    if (row.length < 4 && rIdx > 0 && row[1]) {
      const match = String(row[1]).match(hexRegex);
      if (match) {
        const padding = Array(3 - row.length).fill('<Cell><Data ss:Type="String"></Data></Cell>').join('');
        const styleAttr = ` ss:StyleID="cf_${match[2].toUpperCase()}"`;
        return `<Row>${cells}${padding}<Cell${styleAttr}><Data ss:Type="String"></Data></Cell></Row>`;
      }
    }

    return `<Row>${cells}</Row>`;
  }).join('');

  const xmlContent = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
  </Style>
  ${xmlStyles}
 </Styles>
 <Worksheet ss:Name="ColoredSheet">
  <Table>
   ${xmlRows}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel" });
  const fileName = file.name.replace(/\.[^/.]+$/, "") + "_preview.xml";

  return {
    success: true,
    message: "Success",
    blob,
    fileName,
    rowCount: previewData.length,
    previewData
  };
};
