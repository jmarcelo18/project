import React, { useState, FormEvent } from 'react';
import { ServiceCall } from '../../context/AppContext';

interface ServiceCallFormProps {
  serviceCall?: Omit<ServiceCall, 'id'>;
  onSubmit: (data: Omit<ServiceCall, 'id'>) => void;
  onCancel: () => void;
}

const ServiceCallForm: React.FC<ServiceCallFormProps> = ({
  serviceCall,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<ServiceCall, 'id'>>(
    serviceCall || {
      openingDate: new Date().toISOString().split('T')[0],
      protocol: '',
      area: '',
      problem: '',
      status: 'Pendente',
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-3">
          <label htmlFor="openingDate" className="block text-sm font-medium text-gray-700">
            Data de Abertura
          </label>
          <input
            type="date"
            name="openingDate"
            id="openingDate"
            required
            value={formData.openingDate}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="protocol" className="block text-sm font-medium text-gray-700">
            Protocolo
          </label>
          <input
            type="text"
            name="protocol"
            id="protocol"
            required
            value={formData.protocol}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="area" className="block text-sm font-medium text-gray-700">
            Área
          </label>
          <input
            type="text"
            name="area"
            id="area"
            required
            value={formData.area}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            required
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="Resolvido">Resolvido</option>
            <option value="Pendente">Pendente</option>
            <option value="Análise">Em Análise</option>
          </select>
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="problem" className="block text-sm font-medium text-gray-700">
            Problema
          </label>
          <textarea
            id="problem"
            name="problem"
            rows={3}
            required
            value={formData.problem}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default ServiceCallForm;