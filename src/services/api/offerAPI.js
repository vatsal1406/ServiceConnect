import api from './axiosConfig';

export const getOffers = async () => {
  try {
    const response = await api.get('/offers');
    return response.data;
  } catch (error) {
    const mockOffers = [
      { id: 1, service: "cleaning", discount: 20, title: "20% OFF Cleaning", description: "Get your home sparkling clean this weekend." },
      { id: 2, service: "ac-repair", discount: 15, title: "15% OFF AC Repair", description: "Prepare for summer with discounted AC repair services." }
    ];
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockOffers), 800);
    });
  }
};
