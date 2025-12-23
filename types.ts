
export interface ColorRow {
  row: number;
  hex: string;
  name: string;
  preview: string;
}

export interface ProcessResult {
  success: boolean;
  message: string;
  blob?: Blob;
  fileName?: string;
  rowCount?: number;
  previewData?: ColorRow[];
}
