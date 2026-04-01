import { motion } from 'framer-motion';

export default function OfferCard({ offer, onBook }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)" }}
      className="w-72 flex-shrink-0 rounded-2xl p-5 text-white bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 shadow-sm hover:shadow-lg relative overflow-hidden transition-all duration-300"
    >
      <div className="absolute top-0 right-0 bg-white/20 px-3 py-1 rounded-bl-xl font-bold text-xs backdrop-blur-sm">
        Limited Time
      </div>

      <div className="mb-4 mt-2">
        <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-black px-2.5 py-1 rounded-md mb-3 shadow-sm tracking-wide">
          {offer.discount}% OFF
        </span>
        <h3 className="text-xl font-bold font-sans tracking-tight leading-tight">{offer.title}</h3>
      </div>

      <p className="text-white/90 text-sm mb-6 line-clamp-2 min-h-[40px] leading-relaxed">
        {offer.description}
      </p>

      <button
        onClick={() => onBook(offer)}
        className="w-full bg-white text-indigo-600 font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500"
      >
        Book Now
      </button>
    </motion.div>
  );
}
