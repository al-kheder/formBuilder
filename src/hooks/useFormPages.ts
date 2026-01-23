import { useState } from 'react';

export interface FormPage {
  id: string;
  type: 'authorized' | 'person' | 'wallet' | 'lynx' | 'scope';
  label: string;
}

export function useFormPages(initialPages: FormPage[]) {
  const [pages, setPages] = useState<FormPage[]>(initialPages);
  const [removedPages, setRemovedPages] = useState<FormPage[]>([]);

  const duplicatePage = (pageId: string) => {
    const pageIndex = pages.findIndex((p) => p.id === pageId);
    if (pageIndex === -1) return;

    const pageToDuplicate = pages[pageIndex];
    const sameTypePages = pages.filter((p) => p.type === pageToDuplicate.type);
    const newId = `${pageToDuplicate.type}-${Date.now()}`;
    
    // Generate a smart label based on the type
    let newLabel: string;
    if (pageToDuplicate.type === 'authorized' || pageToDuplicate.type === 'person') {
      const personNumber = sameTypePages.length + 1;
      newLabel = pageToDuplicate.type === 'authorized' 
        ? `Authorized Person ${personNumber}`
        : `Person ${personNumber}`;
    } else {
      newLabel = `${pageToDuplicate.label} (Copy)`;
    }

    const newPage: FormPage = {
      id: newId,
      type: pageToDuplicate.type,
      label: newLabel,
    };

    // Insert after the duplicated page
    const newPages = [...pages];
    newPages.splice(pageIndex + 1, 0, newPage);
    setPages(newPages);
  };

  const removePage = (pageId: string) => {
    // Keep at least one form
    if (pages.length <= 1) {
      alert('You must keep at least one form page.');
      return;
    }
    const removedPage = pages.find((p) => p.id === pageId);
    if (removedPage) {
      setRemovedPages([...removedPages, removedPage]);
    }
    setPages((prev) => prev.filter((p) => p.id !== pageId));
  };

  const restorePage = (pageId: string) => {
    const restoredPage = removedPages.find((p) => p.id === pageId);
    if (restoredPage) {
      setPages([...pages, restoredPage]);
      setRemovedPages(removedPages.filter((p) => p.id !== pageId));
    }
  };

  return {
    pages,
    removedPages,
    duplicatePage,
    removePage,
    restorePage,
  };
}
