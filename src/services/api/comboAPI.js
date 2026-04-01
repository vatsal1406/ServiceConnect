import api from './axiosConfig';

export const getCombos = async () => {
  try {
    const response = await api.get('/combos');
    return response.data;
  } catch (error) {
    const mockCombos = [
      { id: 1, title: "Home Care Combo", services: ["Deep Cleaning", "Basic Plumbing Repair"], originalPrice: 600, discountedPrice: 500, isBestValue: true },
      { id: 2, title: "Appliance Overhaul", services: ["AC Servicing", "Washing Machine Repair"], originalPrice: 400, discountedPrice: 300, isBestValue: false },
      { id: 3, title: "Complete Move-in", services: ["Full Home Cleaning", "Pest Control", "Electrical Check"], originalPrice: 800, discountedPrice: 700, isBestValue: true }
    ];
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCombos), 800);
    });
  }
};
