import React, { useEffect, useState } from "react";
import { db } from "../index";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedProofUrl, setSelectedProofUrl] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const ordersData = [];

                // Loop through all users and fetch their orders
                for (const userDoc of usersSnapshot.docs) {
                    const userData = userDoc.data();
                    const ordersRef = collection(userDoc.ref, "orders");
                    const ordersSnapshot = await getDocs(ordersRef);

                    ordersSnapshot.forEach((orderDoc) => {
                        ordersData.push({
                            id: orderDoc.id,
                            username: userData.username || "Unknown",
                            userId: userDoc.id,
                            ref: orderDoc.ref,
                            ...orderDoc.data(),
                        });
                    });
                }

                // Sort orders by timestamp (newest first)
                ordersData.sort((a, b) => b.timestamp - a.timestamp);
                setOrders(ordersData);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, []);

    const handleProofClick = (proofUrl) => {
        setSelectedProofUrl(proofUrl);
    };

    // Tutup modal
    const closeModal = () => {
        setSelectedProofUrl(null);
    };

    const navigateToDashboard = () => navigate("/");

    const navigateToUserOrders = () => navigate("/users");

    return (
        <div className="flex justify-center px-12 items-center bg-blue-950 min-h-screen">
            <div className="w-full my-12 bg-white rounded-lg shadow-lg">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Kelola Pesanan (Terbaru)</h1>
                        <div className="flex gap-4">
                            <button
                                onClick={navigateToDashboard}
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                Kembali ke Dashboard
                            </button>
                            <button
                                onClick={navigateToUserOrders}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                            >
                                Kelola Berdasarkan Pengguna
                            </button>
                        </div>
                    </div>
                    {orders.length === 0 ? (
                        <p className="text-center text-gray-600">Tidak ada pesanan saat ini.</p>
                    ) : (
                        <table className="w-full table-auto border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border border-gray-300 px-4 py-2">Username</th>
                                    <th className="border border-gray-300 px-4 py-2">Item Name</th>
                                    <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                    <th className="border border-gray-300 px-4 py-2">Duration</th>
                                    <th className="border border-gray-300 px-4 py-2">Price/Night</th>
                                    <th className="border border-gray-300 px-4 py-2">Total Price</th>
                                    <th className="border border-gray-300 px-4 py-2">Start Date</th>
                                    <th className="border border-gray-300 px-4 py-2">End Date</th>
                                    <th className="border border-gray-300 px-4 py-2">Waktu Pesan</th>
                                    <th className="border border-gray-300 px-4 py-2">Status</th>
                                    <th className="border border-gray-300 px-4 py-2">Bukti TF</th>
                                    <th className="border border-gray-300 px-4 py-2">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-100">
                                        <td className="border border-gray-300 px-4 py-2">{order.username}</td>
                                        <td className="border border-gray-300 px-4 py-2">{order.itemName}</td>
                                        <td className="border border-gray-300 px-4 py-2">{order.quantity}</td>
                                        <td className="border border-gray-300 px-4 py-2">{order.duration} Malam</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            Rp{order.price_per_night.toLocaleString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            Rp{order.totalPrice.toLocaleString()}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {new Date(order.startDate).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {new Date(order.endDate).toLocaleDateString("id-ID")}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {new Date(order.timestamp).toLocaleString("id-ID")}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <img
                                                src={order.proofUrl}
                                                alt="Bukti TF"
                                                className="w-24 h-24 object-cover cursor-pointer"
                                                onClick={() => handleProofClick(order.proofUrl)}
                                            />
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            <button
                                                onClick={() => navigate(`/users/${order.userId}`)}
                                                className="bg-blue-500 text-white px-4 py-2 rounded"
                                            >
                                                Periksa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {selectedProofUrl && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
                    <div className="relative">
                        <button
                            className="absolute top-2 right-2 bg-white text-black rounded-full px-4 py-2"
                            onClick={closeModal}
                        >
                            ×
                        </button>
                        <img
                            src={selectedProofUrl}
                            alt="Gambar besar"
                            className="max-w-full max-h-screen rounded"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
