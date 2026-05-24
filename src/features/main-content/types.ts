export interface BoxData {
  id: string;
  title: string;
  content: string;
  direction: 'rtl' | 'ltr';
  mode?: 'text' | 'code';
}

export interface GroupData {
  id: string;
  title: string;
  collapsed: boolean;
  boxIds: string[];
}

export type RootItem =
  | { type: 'box'; id: string }
  | { type: 'group'; id: string };
