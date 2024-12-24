import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ItemForm = ({ item, onSave, onCancel }) => {
    const [name, setName] = useState(item?.name || "");
    const [pricePerNight, setPricePerNight] = useState(item?.price_per_night || "");
    const [description, setDescription] = useState(item?.description || "");
    const [category, setCategory] = useState(item?.category || "Tenda"); // Default kategori jika kosong
    const [stock, setStock] = useState(item?.stock || 0);
    const [availability, setAvailability] = useState(item?.stock > 0 ? true : false); // Tentukan availability berdasarkan stock
    const [imageFile, setImageFile] = useState(null); // Untuk file gambar
    const [imagePreview, setImagePreview] = useState(null); // Untuk pratinjau gambar
    const [isUploading, setIsUploading] = useState(false); // Status pengunggahan

    // Update availability ketika stock berubah
    useEffect(() => {
        setAvailability(stock >= 1); // Tersedia jika stock >= 1, Tidak Tersedia jika stock = 0
    }, [stock]);

    // Update pratinjau gambar saat file gambar dipilih
    useEffect(() => {
        if (imageFile) {
            setImagePreview(URL.createObjectURL(imageFile)); // Membuat URL sementara untuk pratinjau gambar
        } else {
            setImagePreview(null); // Hapus pratinjau jika tidak ada gambar
        }
    }, [imageFile]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let image_url = item?.image_url || ""; // Jika item sudah memiliki URL gambar

            // Unggah gambar ke Firebase Storage jika ada gambar baru
            if (imageFile) {
                const storage = getStorage();
                const normalizedCategory = category.toLowerCase();
                const storageRef = ref(storage, `barang/${normalizedCategory}/${imageFile.name}`);

                await uploadBytes(storageRef, imageFile);
                image_url = await getDownloadURL(storageRef);
            }

            // Membuat data item baru
            const updatedItem = {
                name,
                price_per_night: Number(pricePerNight),
                description,
                category,
                stock: Number(stock),
                availability, // Gunakan nilai availability yang sudah diatur
                image_url, // Tambahkan URL gambar
            };

            onSave(updatedItem); // Simpan item
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Terjadi kesalahan saat mengunggah gambar.");
        } finally {
            setIsUploading(false);
        }
    };

    // Fungsi untuk menangani perubahan pada stok dan memastikan nilainya tidak kurang dari 0
    const handleStockChange = (e) => {
        const value = Math.max(0, Number(e.target.value)); // Pastikan stok tidak kurang dari 0
        setStock(value);
    };

    return (
        <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">{item ? "Edit Barang" : "Tambah Barang"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-bold">Nama Barang:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold">Harga per Malam:</label>
                    <input
                        type="number"
                        value={pricePerNight}
                        onChange={(e) => setPricePerNight(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold">Deskripsi:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm font-bold">Kategori:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full p-2 border rounded"
                        required
                    >
                        <option value="Tenda">Tenda</option>
                        <option value="Tas">Tas</option>
                        <option value="Lampu">Lampu</option>
                        <option value="Pakaian">Pakaian</option>
                        <option value="Sepatu">Sepatu</option>
                        <option value="Alat Masak">Alat Masak</option>
                        <option value="Perlengkapan">Perlengkapan</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold">Stok:</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={handleStockChange} // Gunakan fungsi handleStockChange untuk memastikan stok tidak kurang dari 0
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                {/* Tampilkan status availability berdasarkan stock */}
                <div>
                    <label className="block text-sm font-bold">Ketersediaan:</label>
                    <input
                        type="text"
                        value={availability ? "Tersedia" : "Tidak Tersedia"}
                        readOnly
                        className="w-full p-2 border rounded bg-gray-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold">Unggah Gambar:</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full p-2 border rounded"
                    />
                    {/* Pratinjau Gambar */}
                    {imagePreview && (
                        <div className="mt-4">
                            <h3 className="text-sm font-bold">Pratinjau Gambar:</h3>
                            <img
                                src={imagePreview}
                                alt="Image Preview"
                                className="mt-2 w-full h-auto max-w-[300px] border rounded"
                            />
                        </div>
                    )}
                </div>
                {isUploading && <p className="text-blue-500">Mengunggah gambar...</p>}
                <div className="flex justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded"
                        disabled={isUploading}
                    >
                        Simpan
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="bg-gray-500 text-white py-2 px-4 rounded"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ItemForm;
