export interface SnippetItem {
  prefix: string[] | string;
  body: string[] | string;
  description?: string;
  scope?: string;
}

export interface Snippet {
  [key: string]: SnippetItem;
}

export interface ExtraFields {
  tabstops: {
    [key: number]: string[];
  };
  customVar: Record<string, string | ((...args: any[]) => string)>;
}

export interface ExtraSnippetItem extends SnippetItem {
  body: string[];
  extra?: ExtraFields;
}

export interface ExtraSnippet {
  [key: string]: ExtraSnippetItem;
}

export type BodyRecord = Record<string, string[]>;

export type TabstopsRecord = Record<string, Record<number, number>>;

export type CustomVarRecord = ExtraFields['customVar'];
