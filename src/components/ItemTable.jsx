import React from "react";

const ItemTable = ({ items, onEdit, onDelete }) => {
    // Mengelompokkan item berdasarkan kategori
    const groupedItems = items.reduce((acc, item) => {
        const category = item.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(item);
        return acc;
    }, {});

    return (
        <div className="space-y-8">
            {Object.entries(groupedItems).map(([category, itemsInCategory]) => (
                <div key={category}>
                    <h2 className="text-xl font-bold mb-4">{category}</h2>
                    <table className="table-auto w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 px-4 py-2">Gambar</th>
                                <th className="border border-gray-300 px-4 py-2">Nama</th>
                                <th className="border border-gray-300 px-4 py-2">Harga</th>
                                <th className="border border-gray-300 px-4 py-2">Stok</th>
                                <th className="border border-gray-300 px-4 py-2">Ketersediaan</th>
                                <th className="border border-gray-300 px-4 py-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsInCategory.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-100">
                                    <td className="border border-gray-300 px-4 py-2">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover"
                                        />
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        Rp {item.price_per_night.toLocaleString()}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{item.stock}</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {item.availability ? "Tersedia" : "Tidak Tersedia"}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="bg-red-500 text-white py-1 px-2 rounded"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default ItemTable;
