import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../index";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const UserOrders = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]); // Semua pengguna
    const [selectedUser, setSelectedUser] = useState(null); // Pengguna yang dipilih
    const [orders, setOrders] = useState([]); // Pesanan dari pengguna terpilih
    const [editingStatus, setEditingStatus] = useState({}); // Status sedang diubah
    const [selectedImage, setSelectedImage] = useState(null); // Gambar untuk modal

    // Ambil daftar pengguna dari Firestore
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersData = usersSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    // Ambil pesanan dari pengguna berdasarkan ID
    const fetchOrdersByUser = async (userId) => {
        try {
            const ordersRef = collection(db, "users", userId, "orders");
            const ordersSnapshot = await getDocs(ordersRef);
            const ordersData = ordersSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setOrders(ordersData);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };

    // Pilih pengguna dan ambil pesanan mereka
    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchOrdersByUser(user.id);
    };

    // Ubah status pesanan secara lokal
    const handleStatusChange = (orderId, newStatus) => {
        setEditingStatus((prev) => ({
            ...prev,
            [orderId]: newStatus,
        }));
    };

    // Simpan status pesanan ke Firestore
    const handleSaveStatus = async (orderId) => {
        const newStatus = editingStatus[orderId];
        if (!newStatus) return;

        try {
            const orderRef = doc(db, "users", selectedUser.id, "orders", orderId);
            await updateDoc(orderRef, { status: newStatus });

            setOrders((prev) =>
                prev.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            alert("Status berhasil diperbarui!");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Terjadi kesalahan saat memperbarui status.");
        }
    };

    // Buka modal dengan gambar
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
    };

    // Tutup modal
    const closeModal = () => {
        setSelectedImage(null);
    };

    return (
        <div className="flex justify-center px-12 items-center bg-blue-950 min-h-screen">
            <div className="w-full my-12 bg-white rounded-lg">
                <div className="container p-8">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold mb-4">Pesanan Pengguna</h1>
                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate("/orders")}
                                className="bg-red-500 text-white px-4 py-2 rounded mb-4"
                            >
                                Kembali ke Kelola Pesanan
                            </button>
                        </div>
                    </div>

                    {!selectedUser ? (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Daftar Pengguna</h2>
                            <table className="w-full table-auto border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border border-gray-300 px-4 py-2">User ID</th>
                                        <th className="border border-gray-300 px-4 py-2">Username</th>
                                        <th className="border border-gray-300 px-4 py-2">Email</th>
                                        <th className="border border-gray-300 px-4 py-2">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-100">
                                            <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                                            <td className="border border-gray-300 px-4 py-2">{user.username || "Unknown"}</td>
                                            <td className="border border-gray-300 px-4 py-2">{user.email || "Unknown"}</td>
                                            <td className="border border-gray-300 px-4 py-2">
                                                <button
                                                    onClick={() => handleUserClick(user)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                                >
                                                    Pilih
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Pesanan dari {selectedUser.username || "Unknown"} ({selectedUser.id})
                            </h2>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
                            >
                                Kembali ke Daftar Pengguna
                            </button>

                            {orders.length === 0 ? (
                                <p>Tidak ada pesanan untuk pengguna ini.</p>
                            ) : (
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-200">
                                            <th className="border border-gray-300 px-4 py-2">Gambar</th>
                                            <th className="border border-gray-300 px-4 py-2">Item Name</th>
                                            <th className="border border-gray-300 px-4 py-2">Quantity</th>
                                            <th className="border border-gray-300 px-4 py-2">Duration</th>
                                            <th className="border border-gray-300 px-4 py-2">Price/Night</th>
                                            <th className="border border-gray-300 px-4 py-2">Total Price</th>
                                            <th className="border border-gray-300 px-4 py-2">Start Date</th>
                                            <th className="border border-gray-300 px-4 py-2">End Date</th>
                                            <th className="border border-gray-300 px-4 py-2">Waktu Pesan</th>
                                            <th className="border border-gray-300 px-4 py-2">Status</th>
                                            <th className="border border-gray-300 px-4 py-2">Aksi</th>
                                            <th className="border border-gray-300 px-4 py-2">Bukti TF</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-100">
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <img
                                                        src={order.imageUrl}
                                                        alt={order.name}
                                                        className="w-24 h-24 object-cover"
                                                    />
                                                </td>
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
                                                    {new Date(order.timestamp).toLocaleDateString("id-ID")}
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <select
                                                        value={editingStatus[order.id] || order.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                        className="border border-gray-300 rounded px-2 py-1"
                                                    >
                                                        <option value="Pembayaran Diperiksa">Pembayaran Diperiksa</option>
                                                        <option value="Pesanan Diproses">Pesanan Diproses</option>
                                                        <option value="Pengembalian Dana">Pengembalian Dana</option>
                                                        <option value="Pesanan Selesai">Pesanan Selesai</option>
                                                    </select>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <button
                                                        onClick={() => handleSaveStatus(order.id)}
                                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                                    >
                                                        Simpan
                                                    </button>
                                                </td>
                                                <td className="border border-gray-300 px-4 py-2">
                                                    <img
                                                        src={order.proofUrl}
                                                        alt="Bukti Transfer"
                                                        className="w-24 h-24 object-cover cursor-pointer"
                                                        onClick={() => handleImageClick(order.proofUrl)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}

                    {/* Modal untuk gambar besar */}
                    {selectedImage && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
                            <div className="relative">
                                <button
                                    className="absolute top-2 right-2 bg-white text-black rounded-full px-4 py-2"
                                    onClick={closeModal}
                                >
                                    ×
                                </button>
                                <img
                                    src={selectedImage}
                                    alt="Gambar besar"
                                    className="max-w-full max-h-screen rounded"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserOrders;
