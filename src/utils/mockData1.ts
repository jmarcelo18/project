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