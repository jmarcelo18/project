import React, { useState } from 'react';
import { useAppContext, ServiceCall } from '../context/AppContext';
import DataTable from '../components/ui/DataTable';
import ServiceCallForm from '../components/forms/ServiceCallForm';
import { Plus, FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ServiceCalls: React.FC = () => {
  const { serviceCalls, addServiceCall, updateServiceCall, deleteServiceCall } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCall, setCurrentCall] = useState<Omit<ServiceCall, 'id'> | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('Todos');

  const columns = [
    { header: 'Data de Abertura', accessor: 'openingDate' as keyof ServiceCall },
    { header: 'Protocolo', accessor: 'protocol' as keyof ServiceCall },
    { header: 'Área', accessor: 'area' as keyof ServiceCall },
    { header: 'Problema', accessor: 'problem' as keyof ServiceCall },
    { 
      header: 'Status', 
      accessor: 'status' as keyof ServiceCall,
      render: (value: string) => {
        const statusColors = {
          'Resolvido': 'bg-green-100 text-green-800',
          'Pendente': 'bg-yellow-100 text-yellow-800',
          'Análise': 'bg-blue-100 text-blue-800',
        };
        
        const color = statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
            {value}
          </span>
        );
      },
    },
  ];

  const filteredCalls = statusFilter === 'Todos' 
    ? serviceCalls 
    : serviceCalls.filter(call => call.status === statusFilter);

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentCall(null);
  };

  const handleEdit = (call: ServiceCall) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentCall({
      openingDate: call.openingDate,
      protocol: call.protocol,
      area: call.area,
      problem: call.problem,
      status: call.status,
    });
    setCurrentId(call.id);
  };

  const handleDelete = (call: ServiceCall) => {
    if (window.confirm('Tem certeza que deseja excluir este chamado?')) {
      deleteServiceCall(call.id);
    }
  };

  const handleSubmit = (data: Omit<ServiceCall, 'id'>) => {
    if (isEditing && currentId) {
      updateServiceCall(currentId, data);
    } else {
      addServiceCall(data);
    }
    setIsAdding(false);
    setIsEditing(false);
    setCurrentCall(null);
    setCurrentId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentCall(null);
    setCurrentId(null);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Título do relatório
    doc.setFontSize(16);
    doc.text('Relatório de Chamados', 14, 15);
    
    // Data de geração
    doc.setFontSize(10);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 22);

    // Configurar a tabela
    const tableColumn = ['Data', 'Protocolo', 'Área', 'Problema', 'Status'];
    const tableRows = filteredCalls.map(call => [
      new Date(call.openingDate).toLocaleDateString(),
      call.protocol,
      call.area,
      call.problem,
      call.status
    ]);

    // Adicionar a tabela ao PDF
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [66, 139, 202],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    // Salvar o PDF
    doc.save('relatorio-chamados.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Chamados Sinco</h1>
        <div className="flex space-x-3">
          <button
            onClick={generatePDF}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <FileDown size={16} className="mr-2" /> Gerar PDF
          </button>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" /> Adicionar Chamado
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
        >
          <option value="Todos">Todos os Status</option>
          <option value="Pendente">Pendente</option>
          <option value="Análise">Em Análise</option>
          <option value="Resolvido">Resolvido</option>
        </select>
      </div>

      {(isAdding || isEditing) ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isAdding ? 'Adicionar Novo Chamado' : 'Editar Chamado'}
          </h2>
          <ServiceCallForm
            serviceCall={currentCall || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredCalls}
          onEdit={handleEdit}
          onDelete={handleDelete}
          keyExtractor={(item) => item.id}
        />
      )}
    </div>
  );
};

export default ServiceCalls;