// src/shared/db/database.ts
import Dexie, { type Table } from 'dexie';
import type { FileContent } from '@/features/main-content/store/prompt-store';

export interface AppSettings {
  id: 'app';
  treeData: any[]; // در عمل TreeNode[] اما برای سادگی any
  expandedFolders: Record<string, boolean>;
  selectedNodeId: string | null;
}

export class AppDatabase extends Dexie {
  settings!: Table<AppSettings, 'app'>;
  fileContent!: Table<FileContent & { fileId: string }, string>;

  constructor() {
    super('NotebookDB');
    this.version(1).stores({
      settings: 'id',
      fileContent: 'fileId'
    });
  }
}

export const db = new AppDatabase();
