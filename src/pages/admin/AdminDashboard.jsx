import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getAdminStats, getVendors, approveVendor, rejectVendor, createService, updateServicePricing } from '../../services/api/adminAPI';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, totalVendors: 0, pendingVendors: 0 });
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [serviceForm, setServiceForm] = useState({
    name: '',
    category: '',
    desc: '',
    basePrice: '',
    discount: '',
    isOfferActive: false,
    validTill: ''
  });

  const [updateForm, setUpdateForm] = useState({
    name: '',
    basePrice: '',
    discount: '',
    isOfferActive: false,
    validTill: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, vendorsData] = await Promise.all([
        getAdminStats(),
        getVendors()
      ]);
      setStats(statsData);
      setVendors(vendorsData);
    } catch (err) {
      setError('Failed to load admin data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await approveVendor(id);
      fetchData(); // Refresh list to reflect changes visually
    } catch (err) {
      alert('Error approving vendor');
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectVendor(id);
      fetchData(); // Refresh list to reflect changes
    } catch (err) {
      alert('Error rejecting vendor');
    }
  };

  const handleCreateService = async () => {
    try {
      await createService(serviceForm);
      alert("Service Created ✅");
      setServiceForm({
        name: '', category: '', basePrice: '',
        discount: '', isOfferActive: false, validTill: ''
      });
    } catch {
      alert("Error creating service ❌");
    }
  };

  const handleUpdateService = async () => {
    try {
      await updateServicePricing(updateForm);
      alert("Service Updated ✅");
    } catch {
      alert("Error updating service ❌");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full shadow-sm"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Admin Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            SC
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">ServiceConnect <span className="text-indigo-600 text-sm font-semibold ml-2 bg-indigo-50 px-2 py-1 rounded">Admin</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">Admin: {user?.name}</span>
          <button
            onClick={logout}
            className="text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard title="Total Customers" value={stats.totalUsers} icon="👥" color="bg-blue-50 text-blue-600" />
          <StatCard title="Total Vendors" value={stats.totalVendors} icon="🏪" color="bg-green-50 text-green-600" />
          <StatCard title="Pending Approvals" value={stats.pendingVendors} icon="⏳" color="bg-yellow-50 text-yellow-600" />
        </div>

        {/* Vendor Management Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Vendor Management</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                <tr>
                  <th scope="col" className="px-6 py-4">Vendor Name</th>
                  <th scope="col" className="px-6 py-4">Email</th>
                  <th scope="col" className="px-6 py-4">Status</th>
                  <th scope="col" className="px-6 py-4">Date Joined</th>
                  <th scope="col" className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No vendors found.</td>
                  </tr>
                ) : (
                  vendors.map((vendor) => (
                    <motion.tr
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      key={vendor._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">{vendor.name}</td>
                      <td className="px-6 py-4 text-gray-600">{vendor.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border
                          ${vendor.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                          ${vendor.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                          ${vendor.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                        `}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(vendor.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {vendor.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(vendor._id)}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(vendor._id)}
                              className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 hover:border-red-300 font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {/* Service Management Section */}
        <div className="grid md:grid-cols-2 gap-6 mt-10">

          {/* CREATE SERVICE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
          >
            <h2 className="text-lg font-bold mb-4">Create Service</h2>

            <div className="space-y-3">
              <input placeholder="Name" className="input"
                value={serviceForm.name}
                onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })}
              />

              <input placeholder="Category" className="input"
                value={serviceForm.category}
                onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })}
              />

              <textarea
                placeholder="Description"
                className="input"
                value={serviceForm.desc}
                onChange={e => setServiceForm({ ...serviceForm, desc: e.target.value })}
              />

              {/* ✅ NEW ICON INPUT */}
              <input
                placeholder="Icon (e.g. ac, cleaning, repair)"
                className="input"
                value={serviceForm.icon}
                onChange={e => setServiceForm({ ...serviceForm, icon: e.target.value })}
              />

              <input type="number" placeholder="Base Price" className="input"
                value={serviceForm.basePrice}
                onChange={e => setServiceForm({ ...serviceForm, basePrice: e.target.value })}
              />
              <input type="number" placeholder="Discount %" className="input"
                value={serviceForm.discount}
                onChange={e => setServiceForm({ ...serviceForm, discount: e.target.value })}
              />

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox"
                  checked={serviceForm.isOfferActive}
                  onChange={e => setServiceForm({ ...serviceForm, isOfferActive: e.target.checked })}
                />
                Offer Active
              </label>

              <button
                onClick={handleCreateService}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Create Service
              </button>
            </div>
          </motion.div>

          {/* UPDATE SERVICE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200"
          >
            <h2 className="text-lg font-bold mb-4">Update Service Pricing</h2>

            <div className="space-y-3">
              <input
                placeholder="Service Name"
                className="input"
                value={updateForm.name}
                onChange={e => setUpdateForm({ ...updateForm, name: e.target.value })}
              />
              <input type="number" placeholder="New Base Price" className="input"
                value={updateForm.basePrice}
                onChange={e => setUpdateForm({ ...updateForm, basePrice: e.target.value })}
              />
              <input type="number" placeholder="Discount %" className="input"
                value={updateForm.discount}
                onChange={e => setUpdateForm({ ...updateForm, discount: e.target.value })}
              />

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox"
                  checked={updateForm.isOfferActive}
                  onChange={e => setUpdateForm({ ...updateForm, isOfferActive: e.target.checked })}
                />
                Offer Active
              </label>

              <input type="date" className="input"
                value={updateForm.validTill}
                min={new Date().toISOString().split("T")[0]}
                onChange={e => setUpdateForm({ ...updateForm, validTill: e.target.value })}
              />

              <button
                onClick={handleUpdateService}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Update Service
              </button>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}

// Simple internal stat card component
function StatCard({ title, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}
