import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Company } from '../context/AppContext';

export const exportToPDF = (companies: Company[]) => {
  const doc = new jsPDF();

  // Add title
  doc.setFontSize(16);
  doc.text('Relatório de Empresas Especializadas', 14, 15);

  // Add date
  doc.setFontSize(10);
  doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 25);

  // Define the columns
  const columns = [
    'Empresa',
    'Área',
    'Periodicidade',
    'Última Manutenção',
    'Próxima Manutenção',
    'Responsável',
  ];

  // Prepare the data
  const data = companies.map((company) => [
    company.company,
    company.area,
    company.periodicity,
    company.lastMaintenance,
    company.nextMaintenance,
    company.technicalResponsible,
  ]);

  // Generate the table
  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  // Save the PDF
  doc.save('relatorio-empresas.pdf');
};