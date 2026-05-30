// src/features/app-shell/components/containers/FileSync.tsx
'use client';

import { useEffect } from 'react';
import { useTreeStore } from '@/features/file-tree/store/tree-store';
import { findNodeById } from '@/features/file-tree/lib/tree-utils';
import { usePromptStore } from '@/features/main-content/store/prompt-store';

export function FileSync() {
  const selectedNodeId = useTreeStore((s) => s.selectedNodeId);
  const treeData = useTreeStore((s) => s.treeData);
  const selectNode = useTreeStore((s) => s.selectNode);
  const currentFileId = usePromptStore((s) => s.currentFileId);
  const setCurrentFile = usePromptStore((s) => s.setCurrentFile);

  // ۱. فقط در صورتی فایل فعال را تغییر بده که گره انتخاب‌شده یک «فایل» باشد
  useEffect(() => {
    if (!selectedNodeId) return; // اگر کلیک روی سایدبار بود، فایل قبلی را حفظ کن

    const node = findNodeById(treeData, selectedNodeId);
    if (node && node.type === 'file') {
      setCurrentFile(node.id);
    }
    // اگر روی پوشه کلیک شد، کاری انجام نده تا فایل قبلی باز بماند
  }, [selectedNodeId, treeData, setCurrentFile]);

  // ۲. اگر فایل جاری از درخت فایل حذف شد (یا پوشه والد آن حذف شد)، صفحه را خالی کن
  useEffect(() => {
    if (currentFileId) {
      const node = findNodeById(treeData, currentFileId);
      if (!node || node.type !== 'file') {
        setCurrentFile(null);
      }
    }
  }, [treeData, currentFileId, setCurrentFile]);

  // ۳. بستن فایل فعال و خالی کردن صفحه با فشردن کلید Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;

      // اگر کاربر در حال تایپ در ورودی‌ها یا ویرایشگر متنی باشد، فایل بسته نشود
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      const isEditable =
        tag === 'input' ||
        tag === 'textarea' ||
        document.activeElement?.getAttribute('contenteditable') === 'true';

      if (isEditable) return;

      // اگر مدال‌های تایید حذف باز باشند، دکمه Escape ابتدا مدال را ببندد و فایل باز بماند
      const isTreeDeleteOpen = !!useTreeStore.getState().pendingDeleteNodeId;
      const isPromptDeleteOpen =
        !!usePromptStore.getState().pendingDeleteBoxId ||
        !!usePromptStore.getState().pendingDeleteGroupId;

      if (isTreeDeleteOpen || isPromptDeleteOpen) return;

      // پاک کردن وضعیت انتخاب سایدبار و بستن فایل فعال
      selectNode(null);
      setCurrentFile(null);
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectNode, setCurrentFile]);

  return null;
}
