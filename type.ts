export interface MarkdownToken {
  type: string;
  raw: string;
  align?: string[];
  checked?: boolean;
  depth?: number;
  href?: string;
  lang?: string;
  loose?: boolean;
  ordered?: boolean;
  rows?: { text: string; tokens: MarkdownToken[] }[][];
  start?: number;
  task?: boolean;
  text?: string;
  title?: string;
  items?: MarkdownToken[];
  header?: { text: string; tokens: MarkdownToken[] };
  tokens?: MarkdownToken[];
  [key: string]: any;
}
