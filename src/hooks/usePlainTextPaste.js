import { useEffect } from 'react';

/**
 * Hook to ensure that any content pasted or dropped into contenteditable elements
 * across the application is treated as pure plain text, completely stripping any
 * copied formatting (styles, fonts, colors, HTML tags), and adopting the container's
 * default formatting and placeholder structure.
 */
export function usePlainTextPaste() {
  useEffect(() => {
    const handlePaste = (e) => {
      const target = e.target;
      const editable = target?.closest?.('[contenteditable]');

      // Only intercept if pasting inside an active contenteditable element
      if (!editable || editable.getAttribute('contenteditable') === 'false') {
        return;
      }

      e.preventDefault();

      const clipboardData = e.clipboardData || window.clipboardData;
      let text = clipboardData ? clipboardData.getData('text/plain') : '';

      if (!text) return;

      const isMultiLine =
        editable.classList.contains('section-content') ||
        editable.dataset.multiline === 'true';

      if (!isMultiLine) {
        // Flatten multi-line text to single line for single-line fields
        text = text.replace(/^[\r\n]+|[\r\n]+$/g, '').replace(/[\r\n]+/g, ' ');
      } else {
        // Normalize line breaks to \n
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      }

      let inserted = false;
      try {
        inserted = document.execCommand('insertText', false, text);
      } catch {
        inserted = false;
      }

      if (!inserted) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          const textNode = document.createTextNode(text);
          range.insertNode(textNode);
          range.setStartAfter(textNode);
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }

      editable.dispatchEvent(new Event('input', { bubbles: true }));
    };

    const handleDrop = (e) => {
      const target = e.target;
      const editable = target?.closest?.('[contenteditable]');

      if (!editable || editable.getAttribute('contenteditable') === 'false') {
        return;
      }

      const text = e.dataTransfer?.getData('text/plain');
      if (text) {
        e.preventDefault();
        const isMultiLine =
          editable.classList.contains('section-content') ||
          editable.dataset.multiline === 'true';

        const cleanText = isMultiLine
          ? text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
          : text.replace(/^[\r\n]+|[\r\n]+$/g, '').replace(/[\r\n]+/g, ' ');

        editable.focus();
        let inserted = false;
        try {
          inserted = document.execCommand('insertText', false, cleanText);
        } catch {
          inserted = false;
        }

        if (!inserted) {
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            const textNode = document.createTextNode(cleanText);
            range.insertNode(textNode);
            range.setStartAfter(textNode);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }
        }

        editable.dispatchEvent(new Event('input', { bubbles: true }));
      }
    };

    const handleKeyDown = (e) => {
      const isMac =
        typeof navigator !== 'undefined' &&
        /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (isCmdOrCtrl && e.key.toLowerCase() === 'b') {
        const activeEl = document.activeElement;
        const tag = activeEl?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;

        if (activeEl?.isContentEditable) {
          e.preventDefault();
          document.execCommand('bold', false, null);
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    document.addEventListener('drop', handleDrop);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('drop', handleDrop);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
