import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  BorderStyle,
  AlignmentType,
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
        }),
      ],
    })
  );

  // Contact info line
  const contactParts = [header.location, header.email, header.phone]
    .filter(Boolean)
    .join(' | ');

  const contactRuns = [new TextRun({ text: contactParts, size: 20, font: 'Arial' })];

  if (header.links && header.links.length > 0) {
    header.links.forEach((link) => {
      contactRuns.push(new TextRun({ text: ' | ', size: 20, font: 'Arial' }));
      contactRuns.push(
        new TextRun({
          text: link.label,
          size: 20,
          font: 'Arial',
          color: '0563C1',
          underline: {},
        })
      );
    });
  }

  children.push(new Paragraph({ children: contactRuns }));

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
  const fileName = `curriculo_${header.name.replace(/\s+/g, '_').toLowerCase() || 'documento'}.docx`;
  saveAs(blob, fileName);
}
