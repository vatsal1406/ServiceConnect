import express from "express";
import { updateVendorLocation } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/location", protect, updateVendorLocation);
router.get("/search-location", async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.json([]);
        }

        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=5`,
            {
                headers: {
                    "User-Agent": "ServiceConnectApp",
                },
            }
        );

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Search failed" });
    }
});

export default router;