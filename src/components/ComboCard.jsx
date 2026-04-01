import { motion } from 'framer-motion';

export default function ComboCard({ combo, onBook }) {
  const savings = combo.originalPrice - combo.discountedPrice;

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-6 flex flex-col h-full relative transition-shadow duration-300">
      {combo.isBestValue && (
        <div className="absolute -top-3 left-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-black px-3 py-1 rounded-full shadow-sm tracking-wide uppercase">
          Best Value
        </div>
      )}

      <div className="mb-4 mt-2">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">{combo.title}</h3>
      </div>

      <div className="flex-grow mb-6">
        <p className="text-sm font-semibold text-gray-800 mb-3">Included Services:</p>
        <ul className="space-y-2.5">
          {combo.services.map((service, idx) => (
            <li key={idx} className="flex items-start text-sm text-gray-600 font-medium">
              <svg className="w-4 h-4 text-emerald-500 mr-2.5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              {service}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-gray-100 pt-5 mb-5 flex items-end justify-between">
        <div>
          <span className="text-sm text-gray-400 line-through block mb-0.5">₹{combo.originalPrice}</span>
          <span className="text-3xl font-black text-indigo-600 tracking-tight">₹{combo.discountedPrice}</span>
        </div>
        <div className="text-sm font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
          Save ₹{savings}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onBook(combo)}
        className="w-full bg-indigo-50 text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Book Combo
      </motion.button>
    </div>
  );
}
