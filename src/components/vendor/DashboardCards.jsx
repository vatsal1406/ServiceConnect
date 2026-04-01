import {
  CheckCircle,
  Clock,
  Briefcase,
  CalendarCheck
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${bgClass} ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const DashboardCards = ({ stats }) => {
  // Assuming stats object like: { total: 0, pending: 0, ongoing: 0, completed: 0 }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      <StatCard
        title="Total Bookings"
        value={stats?.total || 0}
        icon={CalendarCheck}
        colorClass="text-indigo-600"
        bgClass="bg-indigo-50"
      />
      <StatCard
        title="Pending Requests"
        value={stats?.pending || 0}
        icon={Clock}
        colorClass="text-yellow-600"
        bgClass="bg-yellow-50"
      />
      <StatCard
        title="Ongoing Services"
        value={stats?.ongoing || 0}
        icon={Briefcase}
        colorClass="text-purple-600"
        bgClass="bg-purple-50"
      />
      <StatCard
        title="Completed Services"
        value={stats?.completed || 0}
        icon={CheckCircle}
        colorClass="text-green-600"
        bgClass="bg-green-50"
      />
    </div>
  );
};

export default DashboardCards;
