import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getCategories } from '../services/api/serviceAPI';
import { getOffers } from '../services/api/offerAPI';
import { getCombos } from '../services/api/comboAPI';
import Navbar from '../components/Navbar';
import OfferCard from '../components/OfferCard';
import ComboCard from '../components/ComboCard';
import { TypeAnimation } from 'react-type-animation';

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [offers, setOffers] = useState([]);
  const [combos, setCombos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsData, offersData, combosData] = await Promise.all([
          getCategories(),
          getOffers(),
          getCombos()
        ]);
        setCategories(catsData);
        setOffers(offersData);
        setCombos(combosData);
      } catch (error) {
        console.error("Failed to fetch home data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOfferBook = (offer) => {
    navigate(`/services/${offer.service}`);
  };

  const handleComboBook = (combo) => {
    alert(`Booking capability for ${combo.title} is coming soon!`);
  };

  const filteredCategories = categories.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">

        {/* Header & Search */}
        <div className="text-center flex flex-col items-center gap-6 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 pb-2 bg-[length:200%_auto] animate-pulse cursor-default">
              Discover Services
            </h1>
            <div className="mt-4 text-lg sm:text-xl text-gray-600 font-medium h-8">
              <TypeAnimation
                sequence={[
                  'Find trusted professionals for your daily needs.',
                  4000,
                  'Book expert cleaners, plumbers, and more.',
                  4000,
                ]}
                wrapper="span"
                cursor={true}
                speed={50}
                repeat={Infinity}
              />
            </div>
          </motion.div>

          <div className="w-full max-w-lg relative">
            <input
              type="text"
              placeholder="Search for a service category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-base"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Today's Offers */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Today's Offers
            </h2>
          </div>

          <div className="flex overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 gap-6 snap-x" style={{ scrollbarWidth: 'none' }}>
            {isLoading ? (
              [1, 2, 3].map(n => (
                <div key={n} className="w-72 flex-shrink-0 bg-gray-200 rounded-2xl h-48 animate-pulse snap-start"></div>
              ))
            ) : offers.length > 0 ? (
              offers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="snap-start"
                >
                  <OfferCard offer={offer} onBook={handleOfferBook} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No offers available today.</p>
            )}
          </div>
        </section>

        {/* Combos / Packages */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Value Combos
            </h2>
            <p className="text-gray-500 mt-1">Book multiple services together and save more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map(n => (
                <div key={n} className="bg-white border border-gray-100 rounded-2xl h-64 animate-pulse"></div>
              ))
            ) : combos.length > 0 ? (
              combos.map((combo, index) => (
                <motion.div
                  key={combo.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ComboCard combo={combo} onBook={handleComboBook} />
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">No combos available at the moment.</p>
            )}
          </div>
        </section>

        {/* Categories Grid */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Categories</h2>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center animate-pulse">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mb-4"></div>
                  <div className="w-24 h-5 bg-gray-100 rounded mb-2"></div>
                  <div className="w-32 h-4 bg-gray-100 rounded"></div>
                </div>
              ))}
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
              <p className="text-gray-500">No categories match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <Link key={category.id} to={`/services/${category.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-gray-100 flex flex-col items-center text-center transition-shadow cursor-pointer h-full"
                  >
                    <div className="text-4xl mb-4 bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center">
                      {category.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{category.title}</h3>
                    <p className="text-sm text-gray-500">{category.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}
