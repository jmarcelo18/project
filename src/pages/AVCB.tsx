import React, { useState } from 'react';
import { useAppContext, AVCBService } from '../context/AppContext';
import DataTable from '../components/ui/DataTable';
import AVCBForm from '../components/forms/AVCBForm';
import { Plus } from 'lucide-react';

const AVCB: React.FC = () => {
  const { avcbServices, addAVCBService, updateAVCBService, deleteAVCBService } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Omit<AVCBService, 'id' | 'nextMaintenance' | 'daysToExpire'> | null>(null);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const columns = [
    { header: 'Serviço', accessor: 'service' as keyof AVCBService },
    { header: 'Periodicidade', accessor: 'periodicity' as keyof AVCBService },
    { header: 'Última Manutenção', accessor: 'lastMaintenance' as keyof AVCBService },
    { header: 'Próxima Manutenção', accessor: 'nextMaintenance' as keyof AVCBService },
    { 
      header: 'Dias para Vencer', 
      accessor: 'daysToExpire' as keyof AVCBService,
      render: (value: number) => {
        let colorClass = '';
        
        if (value <= 7) {
          colorClass = 'bg-red-100 text-red-800';
        } else if (value <= 15) {
          colorClass = 'bg-yellow-100 text-yellow-800';
        } else if (value <= 30) {
          colorClass = 'bg-green-100 text-green-800';
        } else {
          colorClass = 'bg-blue-100 text-blue-800';
        }
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`}>
            {value} dias
          </span>
        );
      },
    },
  ];

  const handleAdd = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentService(null);
  };

  const handleEdit = (service: AVCBService) => {
    setIsEditing(true);
    setIsAdding(false);
    setCurrentService({
      service: service.service,
      periodicity: service.periodicity,
      lastMaintenance: service.lastMaintenance,
    });
    setCurrentId(service.id);
  };

  const handleDelete = (service: AVCBService) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      deleteAVCBService(service.id);
    }
  };

  const handleSubmit = (data: Omit<AVCBService, 'id' | 'nextMaintenance' | 'daysToExpire'>) => {
    if (isEditing && currentId) {
      updateAVCBService(currentId, data);
    } else {
      addAVCBService(data);
    }
    setIsAdding(false);
    setIsEditing(false);
    setCurrentService(null);
    setCurrentId(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentService(null);
    setCurrentId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">AVCB</h1>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={16} className="mr-2" /> Adicionar Serviço
        </button>
      </div>

      {(isAdding || isEditing) ? (
        <div className="bg-white shadow sm:rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {isAdding ? 'Adicionar Novo Serviço' : 'Editar Serviço'}
          </h2>
          <AVCBForm
            avcbService={currentService || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={avcbServices}
          onEdit={handleEdit}
          onDelete={handleDelete}
          keyExtractor={(item) => item.id}
        />
      )}
    </div>
  );
};

export default AVCB;