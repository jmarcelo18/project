import React, { useState, FormEvent } from 'react';
import { Visit } from '../../context/AppContext';

interface VisitFormProps {
  visit?: Omit<Visit, 'id'>;
  onSubmit: (data: Omit<Visit, 'id'>) => void;
  onCancel: () => void;
}

const VisitForm: React.FC<VisitFormProps> = ({
  visit,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Visit, 'id'>>(
    visit || {
      date: new Date().toISOString().split('T')[0],
      time: '',
      company: '',
      description: '',
      responsible: '',
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Data
          </label>
          <input
            type="date"
            name="date"
            id="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">
            Hora
          </label>
          <input
            type="time"
            name="time"
            id="time"
            required
            value={formData.time}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Empresa
          </label>
          <input
            type="text"
            name="company"
            id="company"
            required
            value={formData.company}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="responsible" className="block text-sm font-medium text-gray-700">
            Responsável
          </label>
          <input
            type="text"
            name="responsible"
            id="responsible"
            required
            value={formData.responsible}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            value={formData.description}
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

export default VisitForm;