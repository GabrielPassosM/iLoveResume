import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
  Packer,
  ExternalHyperlink,
} from 'docx';
import { saveAs } from 'file-saver';

function parseContentToRuns(content) {
  const runs = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Parse bold tags
    const boldRegex = /<b>(.*?)<\/b>/g;
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        runs.push(new TextRun({ text: line.substring(lastIndex, match.index), size: 22 }));
      }
      runs.push(new TextRun({ text: match[1], bold: true, size: 22 }));
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      const remaining = line.substring(lastIndex);
      // Check for bullet points
      if (remaining.startsWith('• ') || remaining.startsWith('- ')) {
        runs.push(new TextRun({ text: remaining, size: 22 }));
      } else {
        runs.push(new TextRun({ text: remaining, size: 22 }));
      }
    }

    if (i < lines.length - 1) {
      runs.push(new TextRun({ break: 1 }));
    }
  }

  return runs;
}

function formatUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export async function exportDocx(resume) {
  const { header, sections } = resume;

  const children = [];

  // Name
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: header.name.toUpperCase(),
          bold: true,
          size: 36,
          font: 'Arial',
          color: '000000',
        }),
      ],
    })
  );

  // Job title
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: header.jobTitle,
          size: 22,
          font: 'Arial',
          color: '333333',
        }),
      ],
    })
  );

  // Contact info line
  const contactRuns = [];

  const addSeparatorIfNeeded = () => {
    if (contactRuns.length > 0) {
      contactRuns.push(new TextRun({ text: ' | ', size: 20, font: 'Arial' }));
    }
  };

  if (header.location && header.location.trim()) {
    contactRuns.push(
      new TextRun({
        text: header.location.trim(),
        size: 20,
        font: 'Arial',
      })
    );
  }

  if (header.email && header.email.trim()) {
    addSeparatorIfNeeded();
    const email = header.email.trim();
    contactRuns.push(
      new ExternalHyperlink({
        children: [
          new TextRun({
            text: email,
            style: 'Hyperlink',
            size: 20,
            font: 'Arial',
            color: '0563C1',
            underline: {},
          }),
        ],
        link: email.startsWith('mailto:') ? email : `mailto:${email}`,
      })
    );
  }

  if (header.phone && header.phone.trim()) {
    addSeparatorIfNeeded();
    contactRuns.push(
      new TextRun({
        text: header.phone.trim(),
        size: 20,
        font: 'Arial',
      })
    );
  }

  if (header.links && header.links.length > 0) {
    header.links.forEach((link) => {
      const label = (link.label || '').trim();
      const rawUrl = (link.url || '').trim();
      const displayText = label || rawUrl;
      if (!displayText) return;

      addSeparatorIfNeeded();

      const formattedUrl = formatUrl(rawUrl);
      if (formattedUrl) {
        contactRuns.push(
          new ExternalHyperlink({
            children: [
              new TextRun({
                text: displayText,
                style: 'Hyperlink',
                size: 20,
                font: 'Arial',
                color: '0563C1',
                underline: {},
              }),
            ],
            link: formattedUrl,
          })
        );
      } else {
        contactRuns.push(
          new TextRun({
            text: displayText,
            size: 20,
            font: 'Arial',
          })
        );
      }
    });
  }

  if (contactRuns.length > 0) {
    children.push(new Paragraph({ children: contactRuns }));
  }

  // Sections
  sections.forEach((section) => {
    // Section title with bottom border
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: section.title,
            size: 28,
            font: 'Arial',
            color: '000000',
          }),
        ],
        heading: HeadingLevel.HEADING_2,
        border: {
          bottom: {
            color: '000000',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { before: 240, after: 120 },
      })
    );

    // Section content
    const contentRuns = parseContentToRuns(section.content);
    children.push(
      new Paragraph({
        children: contentRuns,
        spacing: { after: 80 },
      })
    );
  });

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: 'Heading2',
          name: 'Heading 2',
          basedOn: 'Normal',
          next: 'Normal',
          quickFormat: true,
          run: {
            color: '000000',
            font: 'Arial',
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = (header.name || '').trim().replace(/\s+/g, '_').toLowerCase() || 'documento';
  const fileName = `curriculo_${safeName}.docx`;
  saveAs(blob, fileName);
}
