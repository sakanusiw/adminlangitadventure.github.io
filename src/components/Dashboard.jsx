import React, { useState, useEffect } from "react";
import { db } from "../index";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ItemTable from "./ItemTable";
import ItemForm from "./ItemForm";

const Dashboard = () => {
    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    // Proteksi Halaman Dashboard
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                navigate("/login");
            } else {
                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists() && userDoc.data().role === "admin") {
                        fetchItems();
                    } else {
                        alert("Akses ditolak. Anda bukan admin.");
                        await signOut(auth);
                        navigate("/login");
                    }
                } catch (error) {
                    console.error("Error saat memeriksa role pengguna:", error);
                    navigate("/login");
                }
            }
        });

        return unsubscribe;
    }, [auth, navigate]);

    // Fetch items from Firestore
    const fetchItems = async () => {
        try {
            const itemsCollection = collection(db, "items");
            const snapshot = await getDocs(itemsCollection);
            const fetchedItems = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setItems(fetchedItems);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleSave = async (item) => {
        try {
            if (currentItem) {
                const itemRef = doc(db, "items", currentItem.id);
                await updateDoc(itemRef, item);
            } else {
                const itemsCollection = collection(db, "items");
                await addDoc(itemsCollection, item);
            }
            setIsEditing(false);
            setCurrentItem(null);
            fetchItems();
        } catch (error) {
            console.error("Error saving item:", error);
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const handleDelete = async (itemId) => {
        const confirmDelete = window.confirm("Hapus Barang?");
        if (!confirmDelete) {
            return;
        }

        try {
            const itemDoc = doc(db, "items", itemId);
            await deleteDoc(itemDoc);
            fetchItems();
        } catch (error) {
            console.error("Error menghapus barang:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error saat logout:", error);
        }
    };

    return (
        <body className="flex justify-center px-12 items-center bg-blue-950 min-h-screen">
            <div className="w-full my-12 bg-white rounded-lg">
                <div className="container p-8">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-3xl font-bold">Dashboard Admin Langit Adventure</h1>
                        <button
                            onClick={handleLogout}
                            className="bg-red-500 text-white py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>

                    <div className="flex justify-start gap-4 mb-4">
                        <button
                            onClick={() => navigate("/orders")}
                            className="bg-green-500 text-white py-2 px-4 rounded"
                        >
                            Kelola Pesanan
                        </button>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Tambah Barang
                        </button>
                    </div>

                    {isEditing ? (
                        <ItemForm
                            item={currentItem}
                            onSave={handleSave}
                            onCancel={() => {
                                setIsEditing(false);
                                setCurrentItem(null);
                            }}
                        />
                    ) : (
                        <ItemTable items={items} onEdit={handleEdit} onDelete={handleDelete} />
                    )}
                </div>
            </div>
        </body>
    );
};

export default Dashboard;
