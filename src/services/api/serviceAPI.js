import api from './axiosConfig';

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([
        { id: 'cleaning', title: 'Cleaning', icon: '🧹', desc: 'Home & Office spaces' },
        { id: 'plumbing', title: 'Plumbing', icon: '🔧', desc: 'Pipes & Leaks repair' },
        { id: 'electrician', title: 'Electrician', icon: '⚡', desc: 'Wiring & Fixes' },
        { id: 'ac-repair', title: 'AC Repair', icon: '❄️', desc: 'Cooling systems' },
        { id: 'painting', title: 'Painting', icon: '🎨', desc: 'Interior & Exterior painting' },
        { id: 'carpentry', title: 'Carpentry', icon: '🪚', desc: 'Furniture & Woodwork' },
        { id: 'appliance-repair', title: 'Appliance Repair', icon: '🛠️', desc: 'Home appliances fixing' },
        { id: 'pest-control', title: 'Pest Control', icon: '🐜', desc: 'Termite & insect removal' }
      ]), 800);
    });
  }
};

export const getServicesByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/services/${categoryId}`);
    return response.data;
  } catch (error) {
    const mockDB = {
      cleaning: [
        { id: 'c1', name: 'Deep Home Cleaning', price: 400, rating: 4.8, desc: 'Complete deep cleaning of all rooms and tiles.' },
        { id: 'c2', name: 'Sofa Cleaning', price: 200, rating: 4.5, desc: 'Professional fabric cleaning and stain removal.' },
        { id: 'c3', name: 'Sofa Cleaning', price: 200, rating: 4.5, desc: 'Professional fabric cleaning and stain removal.' }
      ],
      plumbing: [
        { id: 'p1', name: 'Leak Fixing', price: 250, rating: 4.9, desc: 'Fixing leaking pipes, faucets, and showers.' },
        { id: 'p2', name: 'Drain Unblocking', price: 300, rating: 4.6, desc: 'High-pressure unblocking of bathroom drains.' }
      ],
      electrician: [
        { id: 'e1', name: 'Wiring Check', price: 225, rating: 4.7, desc: 'Complete house wiring inspection and fault detection.' },
        { id: 'e2', name: 'Fan Installation', price: 150, rating: 4.8, desc: 'Ceiling or wall fan mounting and wiring.' }
      ],
      'ac-repair': [
        { id: 'a1', name: 'AC Servicing', price: 200, rating: 4.8, desc: 'General cleaning and gas check for Split/Window AC.' },
        { id: 'a2', name: 'PCB Repair', price: 350, rating: 4.5, desc: 'Complex motherboard component repairs for AC units.' }
      ],
      painting: [
        { id: 'pt1', name: 'Wall Painting', price: 500, rating: 4.7, desc: 'Interior and exterior wall painting services.' },
        { id: 'pt2', name: 'Texture Painting', price: 700, rating: 4.6, desc: 'Stylish textured wall finishes for modern homes.' }
      ],

      carpentry: [
        { id: 'cp1', name: 'Furniture Repair', price: 300, rating: 4.8, desc: 'Repair and polishing of wooden furniture.' },
        { id: 'cp2', name: 'Custom Shelves', price: 600, rating: 4.7, desc: 'Design and installation of wooden shelves.' }
      ],

      'appliance-repair': [
        { id: 'ar1', name: 'Washing Machine Repair', price: 350, rating: 4.6, desc: 'Fixing motor, drainage, and spin issues.' },
        { id: 'ar2', name: 'Refrigerator Repair', price: 400, rating: 4.7, desc: 'Cooling and compressor issue resolution.' }
      ],

      'pest-control': [
        { id: 'pc1', name: 'Termite Control', price: 800, rating: 4.8, desc: 'Complete termite treatment for home protection.' },
        { id: 'pc2', name: 'Cockroach Removal', price: 300, rating: 4.5, desc: 'Safe and effective pest elimination service.' }
      ]
    };
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockDB[categoryId] || []), 1000);
    });
  }
};
