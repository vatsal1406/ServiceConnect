import User from "../models/User.js";

export const updateVendorLocation = async (req, res) => {
    try {
        const { lat, lng } = req.body;

        if (lat == null || lng == null) {
            return res.status(400).json({ message: "Invalid coordinates" });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                location: {
                    type: "Point",
                    coordinates: [lng, lat],
                },
            },
            { new: true }
        );

        res.json({ message: "Location updated", location: user.location });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};