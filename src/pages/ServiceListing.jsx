import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getServicesByCategory } from '../services/api/serviceAPI';

import { getOffers } from '../services/api/offerAPI';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import InputField from '../components/InputField';
import { createBooking } from '../services/api/bookingAPI';

export default function ServiceListing() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState('form'); // form | success
  const [bookingData, setBookingData] = useState({ date: '', time: '', address: '', location: null });
  const [isBooking, setIsBooking] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, offersData] = await Promise.all([
          getServicesByCategory(categoryId),
          getOffers()
        ]);
        setServices(servicesData);
        setOffers(offersData);
      } catch (error) {
        console.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [categoryId]);

  const handleBookClick = (service) => {
    setSelectedService(service);
    setBookingStep('form');
    setIsModalOpen(true);

    setQuery("");        // ✅ reset input
    setSuggestions([]);  // ✅ clear dropdown
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedService(null);
      setBookingData({ date: '', time: '', address: '', location: null });
    }, 300); // Wait for smooth exit animation to vanish
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsBooking(true);

    try {
      await createBooking({
        serviceType: categoryId.toLowerCase().trim(),
        description: selectedService.desc,
        date: bookingData.date,
        address: bookingData.address,
        location: bookingData.location
      });

      setBookingStep('success');
    } catch (error) {
      console.error("Booking failed:", error.response?.data || error.message);
      alert("Booking failed. Please try again.");
    } finally {
      setIsBooking(false);
    }
  };

  const handleSearch = (value) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (value.length < 3) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:5000/api/users/search-location?q=${value}`
        );

        const text = await res.text();

        let data = [];
        try {
          data = JSON.parse(text);
        } catch (e) {
          console.error("JSON parse error:", e);
        }

        setSuggestions(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 600);
  };

  const handleSelect = (place) => {
    setBookingData({
      ...bookingData,
      address: place.display_name,
      location: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
      },
    });

    setQuery(place.display_name);
    setSuggestions([]);
  };

  const applicableOffer = offers.find(o => o.service === categoryId);

  const getDiscountedPrice = (price) => {
    if (!applicableOffer) return price;
    return Math.round(price - (price * applicableOffer.discount / 100));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button onClick={() => navigate('/home')} className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Back to Categories
        </button>

        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-10 capitalize pb-2">{categoryId.replace('-', ' ')} Services</h1>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-2/3 h-6 bg-gray-100 rounded"></div>
                  <div className="w-12 h-6 bg-gray-100 rounded-full"></div>
                </div>
                <div className="w-full h-8 bg-gray-100 rounded mb-4"></div>
                <div className="w-5/6 h-4 bg-gray-100 rounded mb-6"></div>
                <div className="h-11 bg-gray-100 rounded-lg w-full"></div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">No services found for this category.</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {services.map(service => (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col h-full transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight pr-2">{service.name}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 whitespace-nowrap">
                    ⭐ {service.rating}
                  </span>
                </div>

                {applicableOffer ? (
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm text-gray-400 line-through">₹{service.price}</p>
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded">
                        {applicableOffer.discount}% OFF
                      </span>
                    </div>
                    <p className="text-3xl font-black text-indigo-600 tracking-tight">₹{getDiscountedPrice(service.price)}</p>
                  </div>
                ) : (
                  <p className="text-3xl font-black text-gray-900 mb-4 tracking-tight">₹{service.price}</p>
                )}

                <p className="text-sm text-gray-500 flex-grow mb-6 leading-relaxed">{service.desc}</p>
                <Button onClick={() => handleBookClick(service)} className="w-full mt-auto">
                  Book Now
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Booking Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900 z-40"
              onClick={closeModal}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md overflow-hidden relative"
              >
                {bookingStep === 'form' ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Book Service</h2>
                      <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 rounded-full p-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>

                    <div className="mb-4 text-center">
                      <h3 className="font-semibold text-gray-800">{selectedService?.name}</h3>
                    </div>

                    <form onSubmit={handleBookingSubmit} className="space-y-4">
                      <InputField
                        label="Preferred Date"
                        type="date"
                        name="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        required
                      />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time Slot <span className="text-red-500">*</span></label>
                        <select
                          required
                          value={bookingData.time}
                          onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm transition-all focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 outline-none"
                        >
                          <option value="">Select a time</option>
                          <option value="morning">Morning (8 AM - 12 PM)</option>
                          <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                          <option value="evening">Evening (4 PM - 8 PM)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Address <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search your address"
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 shadow-sm focus:ring-1 focus:border-indigo-500 focus:ring-indigo-500 outline-none"
                          />

                          {suggestions.length > 0 && (
                            <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-xl mt-1 max-h-60 overflow-y-auto shadow-lg">
                              {suggestions.map((place, index) => (
                                <div
                                  key={index}
                                  onClick={() => handleSelect(place)}
                                  className="px-4 py-2 text-sm hover:bg-indigo-50 cursor-pointer"
                                >
                                  {place.display_name}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        {bookingData.location && (
                          <p className="mt-2 text-sm text-green-600 font-medium">Selected: {bookingData.address}</p>
                        )}
                      </div>

                      <div className="pt-4">
                        <Button type="submit" isLoading={isBooking} className="w-full py-3 text-lg font-bold">
                          Confirm Booking · ${selectedService ? getDiscountedPrice(selectedService.price) : 0}
                        </Button>
                      </div>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">Your professional is scheduled to arrive on <span className="font-semibold text-gray-700">{bookingData.date}</span> ({bookingData.time}).</p>
                    <Button onClick={closeModal} className="w-full py-2.5">
                      Done
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
