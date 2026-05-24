import type { TreeNode } from '../types';

/**
 * Check if `descendantId` is somewhere inside the subtree of `ancestorId`.
 */
export function isDescendant(
  nodes: TreeNode[],
  ancestorId: string,
  descendantId: string
): boolean {
  if (ancestorId === descendantId) return false;
  for (const node of nodes) {
    if (node.id === ancestorId) {
      return containsId(node.children, descendantId);
    }
    if (node.children && isDescendant(node.children, ancestorId, descendantId))
      return true;
  }
  return false;
}

function containsId(nodes: TreeNode[] | undefined, id: string): boolean {
  if (!nodes) return false;
  return nodes.some((n) => n.id === id || containsId(n.children, id));
}

/**
 * Find a node by its id.
 */
export function findNodeById(nodes: TreeNode[], id: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Immutably remove a node by id, returns the new tree and the removed node.
 */
export function removeNodeById(
  tree: TreeNode[],
  nodeId: string
): { newTree: TreeNode[]; removed: TreeNode | null } {
  let removed: TreeNode | null = null;

  const filterAndMap = (nodes: TreeNode[]): TreeNode[] => {
    const result: TreeNode[] = [];
    for (const node of nodes) {
      if (node.id === nodeId) {
        removed = node;
        continue;
      }
      if (node.children) {
        result.push({ ...node, children: filterAndMap(node.children) });
      } else {
        result.push(node);
      }
    }
    return result;
  };

  const newTree = filterAndMap(tree);
  return { newTree, removed };
}

/**
 * Immutably insert a node as a child of parentId (or root if null),
 * maintaining the order: folders first, then files.
 */
function insertIntoChildren(
  children: TreeNode[],
  newNode: TreeNode
): TreeNode[] {
  // Find the index of the first file
  const firstFileIndex = children.findIndex((child) => child.type === 'file');

  if (newNode.type === 'folder') {
    // Insert before the first file, or at the end if no files exist
    const insertIndex =
      firstFileIndex === -1 ? children.length : firstFileIndex;
    return [
      ...children.slice(0, insertIndex),
      newNode,
      ...children.slice(insertIndex)
    ];
  } else {
    // File: always insert at the end (after all folders and files)
    return [...children, newNode];
  }
}

export function insertNode(
  tree: TreeNode[],
  parentId: string | null,
  node: TreeNode
): TreeNode[] {
  // Insert at root level
  if (parentId === null) {
    return insertIntoChildren(tree, node);
  }

  // Recursively find parent and insert into its children
  return tree.map((n) => {
    if (n.id === parentId) {
      if (n.type !== 'folder') return n; // defensive: cannot insert into a file
      return {
        ...n,
        children: insertIntoChildren(n.children || [], node)
      };
    }
    if (n.children) {
      return { ...n, children: insertNode(n.children, parentId, node) };
    }
    return n;
  });
}
