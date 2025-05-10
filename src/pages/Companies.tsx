import React, { useState } from 'react';
import { useAppContext, Company } from '../context/AppContext';
import DataTable from '../components/ui/DataTable';
import CompanyForm from '../components/forms/CompanyForm';
import { Plus, FileText, Download } from 'lucide-react';
import { exportToPDF } from '../components/PDFExport';

const Companies: React.FC = () => {
  const { companies, addCompany, updateCompany, deleteCompany } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Omit<Company, 'id'> | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const columns = [
    { header: 'Empresa', accessor: 'company' as keyof Company },
    { header: 'Área', accessor: 'area' as keyof Company },
    { header: 'Periodicidade', accessor: 'periodicity' as keyof Company },
    { 
      header: 'Última Manutenção', 
      accessor: 'lastMaintenance' as keyof Company,
    },
    { 
      header: 'Próxima Manutenção', 
      accessor: 'nextMaintenance' as keyof Company,
    },
    { header: 'Responsável Técnico', accessor: 'technicalResponsible' as keyof Company },
  ];

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentCompany(null);
  };

  const handleEdit = (company: Company) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentCompany({
      area: company.area,
      periodicity: company.periodicity,
      company: company.company,
      observation: company.observation,
      lastMaintenance: company.lastMaintenance,
      nextMaintenance: company.nextMaintenance,
      technicalResponsible: company.technicalResponsible,
    });
    setCurrentId(company.id);
  };

  const handleDelete = (company: Company) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      deleteCompany(company.id);
    }
  };

  const handleSubmit = (data: Omit<Company, 'id'>) => {
    if (isEditing && currentId) {
      updateCompany(currentId, data);
    } else {
      addCompany(data);
    }
    setIsAdding(false);
    setIsEditing(false);
    setCurrentCompany(null);
    setCurrentId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentCompany(null);
    setCurrentId(null);
  };

  const handleExportPDF = () => {
    exportToPDF(companies);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Empresas Especializadas</h1>
        <div className="flex space-x-2">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Download size={16} className="mr-2" /> Exportar PDF
          </button>
          <button
            onClick={handleAdd}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-2" /> Adicionar Empresa
          </button>
        </div>
      </div>

      {(isAdding || isEditing) ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isAdding ? 'Adicionar Nova Empresa' : 'Editar Empresa'}
          </h2>
          <CompanyForm 
            company={currentCompany || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={companies}
          onEdit={handleEdit}
          onDelete={handleDelete}
          keyExtractor={(item) => item.id}
        />
      )}
    </div>
  );
};

export default Companies;