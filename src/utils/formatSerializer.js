/**
 * Serializes DOM nodes from an editable element into a clean string
 * preserving only <b>...</b> tags for bold formatting and \n for line breaks,
 * while stripping all other tags (spans, fonts, inline styles, etc.).
 */
export function htmlToCleanContent(elementOrHtml) {
  if (!elementOrHtml) return '';

  let root;
  if (typeof elementOrHtml === 'string') {
    root = document.createElement('div');
    root.innerHTML = elementOrHtml;
  } else {
    root = elementOrHtml;
  }

  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.nodeValue || '';
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const tag = node.tagName.toLowerCase();

    if (tag === 'br') {
      return '\n';
    }

    // Process children
    let text = '';
    for (let i = 0; i < node.childNodes.length; i++) {
      text += processNode(node.childNodes[i]);
    }

    if (tag === 'b' || tag === 'strong') {
      if (!text) return '';
      if (!text.trim()) return text;
      return text
        .split('\n')
        .map((part) => (part.trim() ? `<b>${part}</b>` : part))
        .join('\n');
    }

    if (tag === 'div' || tag === 'p') {
      // If the only child is a <br>, it represents a blank line
      if (
        node.childNodes.length === 1 &&
        node.firstChild.nodeName.toLowerCase() === 'br'
      ) {
        return '\n';
      }
      return '\n' + text;
    }

    return text;
  }

  let result = '';
  for (let i = 0; i < root.childNodes.length; i++) {
    const child = root.childNodes[i];
    // If the first child is a block element, do not prepend an extra newline
    if (
      i === 0 &&
      (child.tagName?.toLowerCase() === 'div' || child.tagName?.toLowerCase() === 'p')
    ) {
      if (
        child.childNodes.length === 1 &&
        child.firstChild.nodeName.toLowerCase() === 'br'
      ) {
        result += '\n';
      } else {
        let childText = '';
        for (let j = 0; j < child.childNodes.length; j++) {
          childText += processNode(child.childNodes[j]);
        }
        result += childText;
      }
    } else {
      result += processNode(child);
    }
  }

  // Normalize line endings
  result = result.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  return result;
}
