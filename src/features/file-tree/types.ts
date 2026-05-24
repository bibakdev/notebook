export interface TreeNode {
  id: string;
  label: string;
  type: 'folder' | 'file';
  children?: TreeNode[];
  defaultOpen?: boolean;
}
