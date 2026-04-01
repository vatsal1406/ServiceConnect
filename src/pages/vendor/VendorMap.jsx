import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import VendorLayout from "../../components/vendor/VendorLayout";
import { getBookingById, updateVendorLocation } from "../../services/api/bookingAPI";

import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    useMap
} from "react-leaflet";

import L from "leaflet";

// 🔥 Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// 🔄 Auto center map on vendor
const RecenterMap = ({ position }) => {
    const map = useMap();

    useEffect(() => {
        if (position) {
            map.setView(position, 15);
        }
    }, [position, map]);

    return null;
};

const VendorMap = () => {
    const { id } = useParams();

    const [booking, setBooking] = useState(null);
    const [vendorLocation, setVendorLocation] = useState(null);

    // 📍 Fetch booking (customer location)
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const data = await getBookingById(id);
                setBooking(data);
            } catch (err) {
                console.error("Error fetching booking:", err);
            }
        };

        fetchBooking();
    }, [id]);

    // 📍 Live vendor tracking + backend update
    useEffect(() => {
        let lastUpdateTime = 0;

        const watchId = navigator.geolocation.watchPosition(
            async (position) => {
                const now = Date.now();

                if (now - lastUpdateTime > 3000) {
                    lastUpdateTime = now;

                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    const newLocation = [lat, lng];

                    setVendorLocation(newLocation);

                    try {
                        await updateVendorLocation({ lat, lng });
                    } catch (err) {
                        console.error("Update location error:", err);
                    }
                }
            },
            (error) => console.error("Location error:", error),
            { enableHighAccuracy: true }
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    // ⏳ Loading states
    if (!booking) {
        return (
            <VendorLayout>
                <div className="p-10 text-center text-gray-500">
                    Loading booking...
                </div>
            </VendorLayout>
        );
    }

    if (!vendorLocation) {
        return (
            <VendorLayout>
                <div className="p-10 text-center text-gray-500">
                    Getting your location...
                </div>
            </VendorLayout>
        );
    }

    const lat = booking?.location?.lat;
    const lng = booking?.location?.lng;

    if (!lat || !lng) {
        return (
            <VendorLayout>
                <div className="p-10 text-center text-red-500">
                    Customer location not available
                </div>
            </VendorLayout>
        );
    }

    const customerLocation = [lat, lng];

    return (
        <VendorLayout>
            <div className="p-4">

                {/* 🗺️ Leaflet Map */}
                <MapContainer
                    center={vendorLocation}
                    zoom={15}
                    style={{ height: "70vh", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Auto center */}
                    <RecenterMap position={vendorLocation} />

                    {/* Vendor Marker */}
                    <Marker position={vendorLocation} />

                    {/* Customer Marker */}
                    <Marker position={customerLocation} />

                    {/* Simple route line */}
                    <Polyline positions={[vendorLocation, customerLocation]} />
                </MapContainer>

                {/* 🚗 Navigation Button */}
                <div className="mt-4 flex justify-center">
                    <button
                        onClick={() =>
                            window.open(
                                `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                            )
                        }
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                    >
                        Start Navigation
                    </button>
                </div>

            </div>
        </VendorLayout>
    );
};

export default VendorMap;