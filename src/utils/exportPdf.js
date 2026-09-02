export async function exportPdf() {
  const html2pdf = (await import('html2pdf.js')).default;
  const element = document.getElementById('resume-paper');
  if (!element) return;

  const opt = {
    margin: 0,
    filename: 'curriculo.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
  };

  await html2pdf().set(opt).from(element).save();
}
