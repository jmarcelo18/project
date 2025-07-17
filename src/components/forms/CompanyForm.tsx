import React, { useState, FormEvent } from 'react';
import { Company } from '../../context/AppContext';

interface CompanyFormProps {
  company?: Omit<Company, 'id'>;
  onSubmit: (data: Omit<Company, 'id'>) => void;
  onCancel: () => void;
}

const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<Omit<Company, 'id'>>(
    company || {
      area: '',
      periodicity: '',
      company: '',
      observation: '',
      lastMaintenance: '',
      nextMaintenance: '',
      technicalResponsible: '',
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
            className="mt-1 block w-full rounded-xl border-gray-200 shadow-card focus:border-primary focus:ring-primary sm:text-sm transition"
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
            className="mt-1 block w-full rounded-xl border-gray-200 shadow-card focus:border-primary focus:ring-primary sm:text-sm transition"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="periodicity" className="block text-sm font-medium text-gray-700">
            Periodicidade
          </label>
          <select
            id="periodicity"
            name="periodicity"
            required
            value={formData.periodicity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-200 shadow-card focus:border-primary focus:ring-primary sm:text-sm transition"
          >
            <option value="">Selecione</option>
            <option value="Mensal">Mensal</option>
            <option value="Trimestral">Trimestral</option>
            <option value="Semestral">Semestral</option>
            <option value="Anual">Anual</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="technicalResponsible" className="block text-sm font-medium text-gray-700">
            Responsável Técnico
          </label>
          <input
            type="text"
            name="technicalResponsible"
            id="technicalResponsible"
            required
            value={formData.technicalResponsible}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-200 shadow-card focus:border-primary focus:ring-primary sm:text-sm transition"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="lastMaintenance" className="block text-sm font-medium text-gray-700">
            Última Manutenção
          </label>
          <input
            type="date"
            name="lastMaintenance"
            id="lastMaintenance"
            required
            value={formData.lastMaintenance}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-200 shadow-card focus:border-primary focus:ring-primary sm:text-sm transition"
          />
        </div>

        <div className="sm:col-span-3">
          <label htmlFor="nextMaintenance" className="block text-sm font-medium text-gray-700">
            Próxima Manutenção
          </label>
          <input
            type="date"
            name="nextMaintenance"
            id="nextMaintenance"
            required
            value={formData.nextMaintenance}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-200 shadow-card focus:border-primary focus:ring-primary sm:text-sm transition"
          />
        </div>

        <div className="sm:col-span-6">
          <label htmlFor="observation" className="block text-sm font-medium text-gray-700">
            Observação
          </label>
          <textarea
            id="observation"
            name="observation"
            rows={3}
            value={formData.observation}
            onChange={handleChange}
            className="mt-1 block w-full rounded-xl border-gray-200 shadow-card focus:border-primary focus:ring-primary sm:text-sm transition"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl shadow-card hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-xl shadow-card hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default CompanyForm;