import { Company, ServiceCall, Visit, AVCBService } from '../context/AppContext';

// Function to calculate next maintenance date
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
  }
  
  return date.toISOString().split('T')[0];
};

// Function to calculate days until expiration
const calculateDaysToExpire = (nextMaintenance: string): number => {
  const today = new Date();
  const expirationDate = new Date(nextMaintenance);
  const timeDifference = expirationDate.getTime() - today.getTime();
  return Math.ceil(timeDifference / (1000 * 3600 * 24));
};

// Generate mock data for the application
export const generateMockData = () => {
  const companies: Company[] = [
    {
      id: '1',
      area: 'Segurança contra incêndio',
      periodicity: 'Mensal',
      company: 'Segurança Total Ltda',
      observation: 'Manutenção de extintores e alarmes',
      lastMaintenance: '2025-05-10',
      nextMaintenance: '2025-06-10',
      technicalResponsible: 'Roberto Silva',
    },
    {
      id: '2',
      area: 'Ar condicionado',
      periodicity: 'Trimestral',
      company: 'ClimaSul Refrigeração',
      observation: 'Limpeza de filtros e verificação geral',
      lastMaintenance: '2025-04-15',
      nextMaintenance: '2025-07-15',
      technicalResponsible: 'Carlos Santos',
    },
    {
      id: '3',
      area: 'Elevadores',
      periodicity: 'Mensal',
      company: 'Elevadores Modernos S.A.',
      observation: 'Manutenção preventiva',
      lastMaintenance: '2025-05-05',
      nextMaintenance: '2025-06-05',
      technicalResponsible: 'Amanda Oliveira',
    },
  ];

  const serviceCalls: ServiceCall[] = [
    {
      id: '1',
      openingDate: '2025-05-12',
      protocol: 'SC20250512001',
      area: 'Hidráulica',
      problem: 'Vazamento no banheiro do 3º andar',
      status: 'Resolvido',
    },
    {
      id: '2',
      openingDate: '2025-05-14',
      protocol: 'SC20250514002',
      area: 'Elétrica',
      problem: 'Lâmpadas queimadas na recepção',
      status: 'Pendente',
    },
    {
      id: '3',
      openingDate: '2025-05-15',
      protocol: 'SC20250515003',
      area: 'Ar condicionado',
      problem: 'Ar condicionado com ruído estranho na sala 402',
      status: 'Análise',
    },
    {
      id: '4',
      openingDate: '2025-05-16',
      protocol: 'SC20250516004',
      area: 'Elevadores',
      problem: 'Elevador do bloco B parado no 5º andar',
      status: 'Resolvido',
    },
    {
      id: '5',
      openingDate: '2025-05-17',
      protocol: 'SC20250517005',
      area: 'Segurança',
      problem: 'Alarme disparando sem motivo aparente',
      status: 'Análise',
    },
  ];

  const visits: Visit[] = [
    {
      id: '1',
      date: '2025-05-10',
      time: '09:30',
      company: 'Segurança Total Ltda',
      description: 'Inspeção mensal de extintores e alarmes de incêndio',
      responsible: 'Roberto Silva',
    },
    {
      id: '2',
      date: '2025-05-12',
      time: '14:00',
      company: 'Dedetizadora EcoPest',
      description: 'Dedetização trimestral do edifício',
      responsible: 'Mariana Costa',
    },
    {
      id: '3',
      date: '2025-05-15',
      time: '10:15',
      company: 'Elevadores Modernos S.A.',
      description: 'Manutenção preventiva mensal dos elevadores',
      responsible: 'Amanda Oliveira',
    },
  ];

  // Generate AVCB services with calculated next maintenance and days to expire
  const avcbServicesBase = [
    {
      id: '1',
      service: 'Inspeção de extintores',
      periodicity: 'Mensal' as const,
      lastMaintenance: '2025-05-05',
    },
    {
      id: '2',
      service: 'Teste de mangueiras e hidrantes',
      periodicity: 'Trimestral' as const,
      lastMaintenance: '2025-04-10',
    },
    {
      id: '3',
      service: 'Manutenção de alarmes',
      periodicity: 'Mensal' as const,
      lastMaintenance: '2025-05-08',
    },
    {
      id: '4',
      service: 'Treinamento de brigada',
      periodicity: 'Semestral' as const,
      lastMaintenance: '2025-01-15',
    },
    {
      id: '5',
      service: 'Revisão do projeto de incêndio',
      periodicity: 'Anual' as const,
      lastMaintenance: '2024-08-20',
    },
  ];

  const avcbServices: AVCBService[] = avcbServicesBase.map(service => {
    const nextMaintenance = calculateNextMaintenance(service.lastMaintenance, service.periodicity);
    const daysToExpire = calculateDaysToExpire(nextMaintenance);
    
    return {
      ...service,
      nextMaintenance,
      daysToExpire,
    };
  });

  return {
    companies,
    serviceCalls,
    visits,
    avcbServices,
  };
};