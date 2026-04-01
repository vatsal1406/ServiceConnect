import Service from '../models/Service.js';

// Get all services
export const getServices = async (req, res) => {
    try {
        const services = await Service.find();

        // Optional: calculate final price
        const updatedServices = services.map(service => {
            let finalPrice = service.basePrice;

            if (
                service.isOfferActive &&
                service.validTill &&
                new Date(service.validTill) > new Date()
            ) {
                finalPrice = service.basePrice -
                    (service.basePrice * service.discount) / 100;
            }

            return {
                ...service._doc,
                finalPrice
            };
        });

        res.json(updatedServices);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const serviceObj = service.toObject();
        const now = new Date();

        let finalPrice = serviceObj.basePrice;

        if (
            serviceObj.isOfferActive &&
            serviceObj.validTill &&
            new Date(serviceObj.validTill) > now
        ) {
            finalPrice =
                serviceObj.basePrice -
                (serviceObj.basePrice * serviceObj.discount) / 100;
        }

        res.json({
            ...serviceObj,
            finalPrice
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};