import React, { useState, useEffect } from 'react';
import { FileText, Upload, X, Edit, Trash2, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Document {
  id: string;
  name: string;
  file: File;
}

interface BudgetDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

interface Budget {
  id: string;
  description: string;
  created_at: string;
  budget_documents: BudgetDocument[];
}

const Budgets: React.FC = () => {
  const [description, setDescription] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const { user } = useAuth();

  // Carregar orçamentos ao montar o componente
  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select(`
          *,
          budget_documents (
            id,
            file_name,
            file_path,
            file_type,
            file_size
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao carregar orçamentos:', error);
        throw error;
      }

      console.log('Orçamentos carregados:', data);
      setBudgets(data || []);
    } catch (err) {
      console.error('Erro ao carregar orçamentos:', err);
      setError('Erro ao carregar orçamentos');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments = Array.from(files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        file: file,
      }));
      setDocuments([...documents, ...newDocuments]);
    }
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleDownload = async (docFile: BudgetDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('budget-documents')
        .download(docFile.file_path);

      if (error) throw error;

      // Criar um link para download
      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = docFile.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar documento:', err);
      setError('Erro ao baixar documento');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Iniciando salvamento do orçamento...');
      console.log('Dados do orçamento:', {
        description,
        user_id: user.id,
      });

      // Insert budget
      const { data: budget, error: budgetError } = await supabase
        .from('budgets')
        .insert([
          {
            description,
            user_id: user.id,
          },
        ])
        .select()
        .single();

      if (budgetError) {
        console.error('Erro ao salvar orçamento:', budgetError);
        throw new Error(`Erro ao salvar orçamento: ${budgetError.message}`);
      }

      if (!budget) {
        throw new Error('Não foi possível criar o orçamento');
      }

      console.log('Orçamento salvo com sucesso:', budget);

      // Upload documents
      if (documents.length > 0) {
        await uploadDocuments(budget.id, documents);
      }

      // Reset form
      setDescription('');
      setDocuments([]);
      setEditingBudget(null);
      await loadBudgets();
      alert('Orçamento salvo com sucesso!');
    } catch (err) {
      console.error('Erro completo:', err);
      setError(err instanceof Error ? err.message : 'Erro ao salvar orçamento');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocuments = async (budgetId: string, docs: Document[]) => {
    console.log('Iniciando upload de documentos...');
    
    for (const doc of docs) {
      try {
        console.log('Processando documento:', doc.name);
        
        const fileExt = doc.file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user?.id}/${budgetId}/${fileName}`;

        console.log('Uploading file to path:', filePath);

        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('budget-documents')
          .upload(filePath, doc.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erro ao fazer upload do arquivo:', uploadError);
          throw new Error(`Erro ao fazer upload do arquivo: ${uploadError.message}`);
        }

        console.log('Arquivo enviado com sucesso:', uploadData);

        // Insert document record
        const { data: docData, error: docError } = await supabase
          .from('budget_documents')
          .insert([
            {
              budget_id: budgetId,
              file_name: doc.file.name,
              file_path: filePath,
              file_type: doc.file.type,
              file_size: doc.file.size,
              user_id: user?.id,
            },
          ])
          .select()
          .single();

        if (docError) {
          console.error('Erro ao salvar registro do documento:', docError);
          throw new Error(`Erro ao salvar registro do documento: ${docError.message}`);
        }

        console.log('Registro do documento salvo com sucesso:', docData);
      } catch (docError) {
        console.error('Erro ao processar documento:', docError);
        continue;
      }
    }
  };

  const handleEdit = async (budget: Budget) => {
    setEditingBudget(budget);
    setDescription(budget.description);
    setDocuments([]); // Limpar documentos atuais
  };

  const handleUpdateDocuments = async (budgetId: string) => {
    if (!user || documents.length === 0) return;

    try {
      await uploadDocuments(budgetId, documents);
      await loadBudgets();
      setDocuments([]);
      alert('Documentos atualizados com sucesso!');
    } catch (err) {
      console.error('Erro ao atualizar documentos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar documentos');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este orçamento?')) return;

    try {
      // Primeiro, excluir os documentos associados
      const { error: docError } = await supabase
        .from('budget_documents')
        .delete()
        .eq('budget_id', id);

      if (docError) throw docError;

      // Depois, excluir o orçamento
      const { error: budgetError } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (budgetError) throw budgetError;

      await loadBudgets(); // Recarregar a lista
      alert('Orçamento excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir orçamento:', err);
      setError('Erro ao excluir orçamento');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Orçamentos</h1>
      
      {/* Formulário de cadastro/edição */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 mb-8">
        {error && (
          <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Descrição do Orçamento
          </label>
          <textarea
            id="description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Digite a descrição do orçamento..."
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Documentos Anexados
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                >
                  <span>Fazer upload de arquivos</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileUpload}
                  />
                </label>
                <p className="pl-1">ou arraste e solte</p>
              </div>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX até 10MB</p>
            </div>
          </div>
        </div>

        {documents.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Arquivos anexados:</h3>
            <ul className="divide-y divide-gray-200">
              {documents.map((doc) => (
                <li key={doc.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-700">{doc.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDocument(doc.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              isLoading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Salvando...' : editingBudget ? 'Atualizar Orçamento' : 'Salvar Orçamento'}
          </button>
          
          {editingBudget && documents.length > 0 && (
            <button
              type="button"
              onClick={() => handleUpdateDocuments(editingBudget.id)}
              className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Adicionar Documentos
            </button>
          )}
        </div>
      </form>

      {/* Tabela de orçamentos */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documentos
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {budgets.map((budget) => (
              <tr key={budget.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(budget.created_at)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {budget.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {budget.budget_documents?.length || 0} documento(s)
                  {budget.budget_documents && budget.budget_documents.length > 0 && (
                    <div className="mt-1">
                      {budget.budget_documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {doc.file_name}
                          </div>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Budgets; 