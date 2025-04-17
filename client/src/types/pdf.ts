export interface PdfResponse {
  filename: string;
  fileSize: number;
  text: string;
  summary?: string;
}

export interface SummaryResponse {
  summary: string;
}

export type SummaryType = 'concise' | 'detailed' | 'bullet'; 