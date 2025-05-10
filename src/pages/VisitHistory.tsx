import React, { useState } from 'react';
import { useAppContext, Visit } from '../context/AppContext';
import DataTable from '../components/ui/DataTable';
import VisitForm from '../components/forms/VisitForm';
import { Plus } from 'lucide-react';

const VisitHistory: React.FC = () => {
  const { visits, addVisit, updateVisit, deleteVisit } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVisit, setCurrentVisit] = useState<Omit<Visit, 'id'> | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const columns = [
    { header: 'Data', accessor: 'date' as keyof Visit },
    { header: 'Hora', accessor: 'time' as keyof Visit },
    { header: 'Empresa', accessor: 'company' as keyof Visit },
    { header: 'Responsável', accessor: 'responsible' as keyof Visit },
    { header: 'Descrição', accessor: 'description' as keyof Visit },
  ];

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentVisit(null);
  };

  const handleEdit = (visit: Visit) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentVisit({
      date: visit.date,
      time: visit.time,
      company: visit.company,
      description: visit.description,
      responsible: visit.responsible,
    });
    setCurrentId(visit.id);
  };

  const handleDelete = (visit: Visit) => {
    if (window.confirm('Tem certeza que deseja excluir este registro de visita?')) {
      deleteVisit(visit.id);
    }
  };

  const handleSubmit = (data: Omit<Visit, 'id'>) => {
    if (isEditing && currentId) {
      updateVisit(currentId, data);
    } else {
      addVisit(data);
    }
    setIsAdding(false);
    setIsEditing(false);
    setCurrentVisit(null);
    setCurrentId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentVisit(null);
    setCurrentId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Histórico de Visitas</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" /> Adicionar Visita
        </button>
      </div>

      {(isAdding || isEditing) ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isAdding ? 'Adicionar Nova Visita' : 'Editar Visita'}
          </h2>
          <VisitForm
            visit={currentVisit || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={visits}
          onEdit={handleEdit}
          onDelete={handleDelete}
          keyExtractor={(item) => item.id}
        />
      )}
    </div>
  );
};

export default VisitHistory;