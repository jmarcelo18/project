import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Mock data types
export interface Company {
  id: string;
  area: string;
  periodicity: string;
  company: string;
  observation: string;
  lastMaintenance: string;
  nextMaintenance: string;
  technicalResponsible: string;
}

export interface ServiceCall {
  id: string;
  openingDate: string;
  protocol: string;
  area: string;
  problem: string;
  status: 'Resolvido' | 'Pendente' | 'Análise';
}

export interface Visit {
  id: string;
  date: string;
  time: string;
  company: string;
  description: string;
  responsible: string;
}

export interface AVCBService {
  id: string;
  service: string;
  periodicity: 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual';
  lastMaintenance: string;
  nextMaintenance: string;
  daysToExpire: number;
}

export interface AppContextType {
  companies: Company[];
  serviceCalls: ServiceCall[];
  visits: Visit[];
  avcbServices: AVCBService[];
  addCompany: (company: Omit<Company, 'id'>) => Promise<void>;
  updateCompany: (id: string, company: Omit<Company, 'id'>) => Promise<void>;
  deleteCompany: (id: string) => Promise<void>;
  addServiceCall: (call: Omit<ServiceCall, 'id'>) => Promise<void>;
  updateServiceCall: (id: string, call: Omit<ServiceCall, 'id'>) => Promise<void>;
  deleteServiceCall: (id: string) => Promise<void>;
  addVisit: (visit: Omit<Visit, 'id'>) => Promise<void>;
  updateVisit: (id: string, visit: Omit<Visit, 'id'>) => Promise<void>;
  deleteVisit: (id: string) => Promise<void>;
  addAVCBService: (service: Omit<AVCBService, 'id' | 'nextMaintenance' | 'daysToExpire'>) => Promise<void>;
  updateAVCBService: (id: string, service: Omit<AVCBService, 'id' | 'nextMaintenance' | 'daysToExpire'>) => Promise<void>;
  deleteAVCBService: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializar com arrays vazios
  const [companies, setCompanies] = useState<Company[]>([]);
  const [serviceCalls, setServiceCalls] = useState<ServiceCall[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [avcbServices, setAVCBServices] = useState<AVCBService[]>([]);

  // Carregar dados do Supabase quando o componente montar
  useEffect(() => {
    const loadData = async () => {
      try {
        // Carregar companies
        const { data: companiesData, error: companiesError } = await supabase
          .from('companies')
          .select('*');
        
        if (companiesError) {
          console.error('Erro ao carregar companies:', companiesError);
        } else if (companiesData) {
          const convertedCompanies = companiesData.map(company => ({
            id: company.id,
            area: company.area,
            periodicity: company.periodicity,
            company: company.company,
            observation: company.observation,
            lastMaintenance: company.last_maintenance,
            nextMaintenance: company.next_maintenance,
            technicalResponsible: company.technical_responsible
          }));
          setCompanies(convertedCompanies);
        }

        // Carregar service_calls
        const { data: serviceCallsData, error: serviceCallsError } = await supabase
          .from('service_calls')
          .select('*');
        
        if (serviceCallsError) {
          console.error('Erro ao carregar service_calls:', serviceCallsError);
        } else if (serviceCallsData) {
          const convertedServiceCalls = serviceCallsData.map(call => ({
            id: call.id,
            openingDate: call.opening_date,
            protocol: call.protocol,
            area: call.area,
            problem: call.problem,
            status: call.status
          }));
          setServiceCalls(convertedServiceCalls);
        }

        // Carregar visits
        const { data: visitsData, error: visitsError } = await supabase
          .from('visits')
          .select('*');
        
        if (visitsError) {
          console.error('Erro ao carregar visits:', visitsError);
        } else if (visitsData) {
          setVisits(visitsData);
        }

        // Carregar avcb_services
        const { data: avcbServicesData, error: avcbServicesError } = await supabase
          .from('avcb_services')
          .select('*');
        
        if (avcbServicesError) {
          console.error('Erro ao carregar avcb_services:', avcbServicesError);
        } else if (avcbServicesData) {
          const convertedAVCBServices = avcbServicesData.map(service => ({
            id: service.id,
            service: service.service,
            periodicity: service.periodicity,
            lastMaintenance: service.last_maintenance,
            nextMaintenance: service.next_maintenance,
            daysToExpire: service.days_to_expire
          }));
          setAVCBServices(convertedAVCBServices);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    loadData();
  }, []);

  // Function to calculate next maintenance date based on periodicity
  const calculateNextMaintenance = (lastMaintenance: string, periodicity: string): string => {
    const date = new Date(lastMaintenance);
    
    switch (periodicity) {
      case 'Mensal':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'Trimestral':
        date.setMonth(date.getMonth() + 3);
        break;
      case 'Semestral':
        date.setMonth(date.getMonth() + 6);
        break;
      case 'Anual':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1); // Default to monthly if unknown
    }
    
    return date.toISOString().split('T')[0];
  };

  // Function to calculate days until expiration
  const calculateDaysToExpire = (nextMaintenance: string): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time part to get accurate day difference
    const expirationDate = new Date(nextMaintenance);
    expirationDate.setHours(0, 0, 0, 0);
    const timeDifference = expirationDate.getTime() - today.getTime();
    return Math.ceil(timeDifference / (1000 * 3600 * 24));
  };

  // Funções CRUD atualizadas para usar Supabase
  const addCompany = async (company: Omit<Company, 'id'>) => {
    try {
      console.log('1. Dados recebidos do formulário:', company);

      // Converter os nomes dos campos para o formato do banco de dados (snake_case)
      const companyData = {
        area: company.area,
        periodicity: company.periodicity,
        company: company.company,
        observation: company.observation || null,
        last_maintenance: company.lastMaintenance,
        next_maintenance: company.nextMaintenance,
        technical_responsible: company.technicalResponsible
      };

      console.log('2. Dados convertidos para o formato do Supabase:', companyData);

      // Fazer a inserção
      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select();

      console.log('3. Resposta da inserção:', { data, error });

      if (error) {
        console.error('4. Erro detalhado:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      if (data && data[0]) {
        // Converter os dados de volta para o formato da interface (camelCase)
        const convertedData = {
          id: data[0].id,
          area: data[0].area,
          periodicity: data[0].periodicity,
          company: data[0].company,
          observation: data[0].observation,
          lastMaintenance: data[0].last_maintenance,
          nextMaintenance: data[0].next_maintenance,
          technicalResponsible: data[0].technical_responsible
        };
        console.log('5. Dados convertidos de volta:', convertedData);
        setCompanies([...companies, convertedData]);
      }
    } catch (error) {
      console.error('6. Erro na operação:', error);
      throw error;
    }
  };

  const updateCompany = async (id: string, company: Omit<Company, 'id'>) => {
    const { data, error } = await supabase
      .from('companies')
      .update(company)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setCompanies(companies.map((c) => (c.id === id ? data : c)));
    }
  };

  const deleteCompany = async (id: string) => {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setCompanies(companies.filter((company) => company.id !== id));
  };

  const addServiceCall = async (call: Omit<ServiceCall, 'id'>) => {
    try {
      console.log('1. Dados recebidos do formulário:', call);

      // Converter os nomes dos campos para o formato do banco de dados (snake_case)
      const serviceCallData = {
        opening_date: call.openingDate,
        protocol: call.protocol,
        area: call.area,
        problem: call.problem,
        status: call.status
      };

      console.log('2. Dados convertidos para o formato do Supabase:', serviceCallData);

      // Fazer a inserção
      const { data, error } = await supabase
        .from('service_calls')
        .insert([serviceCallData])
        .select();

      console.log('3. Resposta da inserção:', { data, error });

      if (error) {
        console.error('4. Erro detalhado:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      if (data && data[0]) {
        // Converter os dados de volta para o formato da interface (camelCase)
        const convertedData = {
          id: data[0].id,
          openingDate: data[0].opening_date,
          protocol: data[0].protocol,
          area: data[0].area,
          problem: data[0].problem,
          status: data[0].status
        };
        console.log('5. Dados convertidos de volta:', convertedData);
        setServiceCalls([...serviceCalls, convertedData]);
      }
    } catch (error) {
      console.error('6. Erro na operação:', error);
      throw error;
    }
  };

  const updateServiceCall = async (id: string, call: Omit<ServiceCall, 'id'>) => {
    try {
      // Converter os nomes dos campos para o formato do banco de dados (snake_case)
      const serviceCallData = {
        opening_date: call.openingDate,
        protocol: call.protocol,
        area: call.area,
        problem: call.problem,
        status: call.status
      };

      const { data, error } = await supabase
        .from('service_calls')
        .update(serviceCallData)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data && data[0]) {
        // Converter os dados de volta para o formato da interface (camelCase)
        const convertedData = {
          id: data[0].id,
          openingDate: data[0].opening_date,
          protocol: data[0].protocol,
          area: data[0].area,
          problem: data[0].problem,
          status: data[0].status
        };
        setServiceCalls(serviceCalls.map((c) => (c.id === id ? convertedData : c)));
      }
    } catch (error) {
      console.error('Erro ao atualizar chamada de serviço:', error);
      throw error;
    }
  };

  const deleteServiceCall = async (id: string) => {
    try {
      const { error } = await supabase
        .from('service_calls')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setServiceCalls(serviceCalls.filter((call) => call.id !== id));
    } catch (error) {
      console.error('Erro ao deletar chamada de serviço:', error);
      throw error;
    }
  };

  const addVisit = async (visit: Omit<Visit, 'id'>) => {
    const { data, error } = await supabase
      .from('visits')
      .insert([visit])
      .select()
      .single();

    if (error) throw error;
    if (data) setVisits([...visits, data]);
  };

  const updateVisit = async (id: string, visit: Omit<Visit, 'id'>) => {
    const { data, error } = await supabase
      .from('visits')
      .update(visit)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (data) {
      setVisits(visits.map((v) => (v.id === id ? data : v)));
    }
  };

  const deleteVisit = async (id: string) => {
    const { error } = await supabase
      .from('visits')
      .delete()
      .eq('id', id);

    if (error) throw error;
    setVisits(visits.filter((visit) => visit.id !== id));
  };

  const addAVCBService = async (service: Omit<AVCBService, 'id' | 'nextMaintenance' | 'daysToExpire'>) => {
    try {
      console.log('1. Dados recebidos do formulário:', service);

      const nextMaintenance = calculateNextMaintenance(service.lastMaintenance, service.periodicity);
      const daysToExpire = calculateDaysToExpire(nextMaintenance);

      // Converter os nomes dos campos para o formato do banco de dados (snake_case)
      const serviceData = {
        service: service.service,
        periodicity: service.periodicity,
        last_maintenance: service.lastMaintenance,
        next_maintenance: nextMaintenance,
        days_to_expire: daysToExpire
      };

      console.log('2. Dados convertidos para o formato do Supabase:', serviceData);

      // Fazer a inserção
      const { data, error } = await supabase
        .from('avcb_services')
        .insert([serviceData])
        .select();

      console.log('3. Resposta da inserção:', { data, error });

      if (error) {
        console.error('4. Erro detalhado:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      if (data && data[0]) {
        // Converter os dados de volta para o formato da interface (camelCase)
        const convertedData = {
          id: data[0].id,
          service: data[0].service,
          periodicity: data[0].periodicity,
          lastMaintenance: data[0].last_maintenance,
          nextMaintenance: data[0].next_maintenance,
          daysToExpire: data[0].days_to_expire
        };
        console.log('5. Dados convertidos de volta:', convertedData);
        setAVCBServices([...avcbServices, convertedData]);
      }
    } catch (error) {
      console.error('6. Erro na operação:', error);
      throw error;
    }
  };

  const updateAVCBService = async (id: string, service: Omit<AVCBService, 'id' | 'nextMaintenance' | 'daysToExpire'>) => {
    try {
      const nextMaintenance = calculateNextMaintenance(service.lastMaintenance, service.periodicity);
      const daysToExpire = calculateDaysToExpire(nextMaintenance);

      // Converter os nomes dos campos para o formato do banco de dados (snake_case)
      const serviceData = {
        service: service.service,
        periodicity: service.periodicity,
        last_maintenance: service.lastMaintenance,
        next_maintenance: nextMaintenance,
        days_to_expire: daysToExpire
      };

      const { data, error } = await supabase
        .from('avcb_services')
        .update(serviceData)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (data && data[0]) {
        // Converter os dados de volta para o formato da interface (camelCase)
        const convertedData = {
          id: data[0].id,
          service: data[0].service,
          periodicity: data[0].periodicity,
          lastMaintenance: data[0].last_maintenance,
          nextMaintenance: data[0].next_maintenance,
          daysToExpire: data[0].days_to_expire
        };
        setAVCBServices(avcbServices.map((s) => (s.id === id ? convertedData : s)));
      }
    } catch (error) {
      console.error('Erro ao atualizar serviço AVCB:', error);
      throw error;
    }
  };

  const deleteAVCBService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('avcb_services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setAVCBServices(avcbServices.filter((service) => service.id !== id));
    } catch (error) {
      console.error('Erro ao deletar serviço AVCB:', error);
      throw error;
    }
  };

  const contextValue: AppContextType = {
    companies,
    serviceCalls,
    visits,
    avcbServices,
    addCompany,
    updateCompany,
    deleteCompany,
    addServiceCall,
    updateServiceCall,
    deleteServiceCall,
    addVisit,
    updateVisit,
    deleteVisit,
    addAVCBService,
    updateAVCBService,
    deleteAVCBService,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};