import React from 'react';
import { useAppContext } from '../context/AppContext';
import DashboardCard from '../components/ui/DashboardCard';
import { 
  PhoneCall, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Building2,
  CalendarClock
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { serviceCalls, companies, avcbServices } = useAppContext();

  // Calculate service call stats
  const totalCalls = serviceCalls.length;
  const resolvedCalls = serviceCalls.filter(call => call.status === 'Resolvido').length;
  const pendingCalls = serviceCalls.filter(call => call.status === 'Pendente').length;
  const analyzingCalls = serviceCalls.filter(call => call.status === 'Análise').length;

  // Calculate active contracts (all companies are considered active)
  const activeContracts = companies.length;

  // Calculate services near expiration (less than 15 days)
  const nearExpirationServices = avcbServices.filter(service => service.daysToExpire <= 15).length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Total de Chamados"
          value={totalCalls}
          icon={<PhoneCall className="h-6 w-6 text-white" />}
          color="bg-blue-600"
        />
        <DashboardCard
          title="Chamados Resolvidos"
          value={resolvedCalls}
          icon={<CheckCircle className="h-6 w-6 text-white" />}
          color="bg-green-600"
        />
        <DashboardCard
          title="Chamados Pendentes"
          value={pendingCalls}
          icon={<Clock className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          title="Chamados em Análise"
          value={analyzingCalls}
          icon={<AlertCircle className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
        <DashboardCard
          title="Contratos Ativos"
          value={activeContracts}
          icon={<Building2 className="h-6 w-6 text-white" />}
          color="bg-indigo-600"
        />
        <DashboardCard
          title="Serviços Próximos ao Vencimento"
          value={nearExpirationServices}
          icon={<CalendarClock className="h-6 w-6 text-white" />}
          color="bg-red-600"
          description="Dentro de 15 dias"
        />
      </div>

      {/* Recent expiring services */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Serviços Próximos ao Vencimento</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {avcbServices
              .filter(service => service.daysToExpire <= 30)
              .sort((a, b) => a.daysToExpire - b.daysToExpire)
              .slice(0, 5)
              .map(service => (
                <li key={service.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">{service.service}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${service.daysToExpire <= 7 
                            ? 'bg-red-100 text-red-800' 
                            : service.daysToExpire <= 15 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'}`}>
                          {service.daysToExpire} dias
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Próxima manutenção: {service.nextMaintenance}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Periodicidade: {service.periodicity}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            {avcbServices.filter(service => service.daysToExpire <= 30).length === 0 && (
              <li className="px-4 py-4 sm:px-6 text-sm text-gray-500">
                Não há serviços próximos ao vencimento nos próximos 30 dias.
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Recent service calls */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Chamados Recentes</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {serviceCalls
              .sort((a, b) => new Date(b.openingDate).getTime() - new Date(a.openingDate).getTime())
              .slice(0, 5)
              .map(call => (
                <li key={call.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600 truncate">
                        {call.problem}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${call.status === 'Resolvido' 
                            ? 'bg-green-100 text-green-800' 
                            : call.status === 'Pendente' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'}`}>
                          {call.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Área: {call.area}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Protocolo: {call.protocol}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;