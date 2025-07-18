'use client';

import NavBar from "../../../../components/NavBar";
import React, { useState, useEffect } from "react";
import Header from "../../../../components/Header";
import LabelWithIcon from "../../../../components/LableWithIcon";
import Modal from "../../../../components/Modal";
import { useParams } from "next/navigation";
import {
    useGetToppingQuery,
    useAddToppingToGroupMutation,
    useRemoveToppingFromGroupMutation,
    useUpdateToppingMutation,
} from "../../../../redux/features/topping/toppingApi";

const Page = () => {
    const { id: groupId } = useParams(); // Get groupId from URL
    const { data, isLoading, refetch } = useGetToppingQuery({ groupId });

    const [addTopping] = useAddToppingToGroupMutation();
    const [removeTopping] = useRemoveToppingFromGroupMutation();
    const [updateTopping] = useUpdateToppingMutation();

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddToppingModalOpen, setIsAddToppingModalOpen] = useState(false);
    const [selectedTopping, setSelectedTopping] = useState(null);

    const [newToppingName, setNewToppingName] = useState("");
    const [newToppingPrice, setNewToppingPrice] = useState("");

    const [toppingGroup, setToppingGroup] = useState(null);

    useEffect(() => {
        if (data?.data) {
            setToppingGroup(data.data);
        }
    }, [data]);

    // Open Edit Modal (for name & price)
    const openEditModal = (topping) => {
        setSelectedTopping(topping);
        setNewToppingName(topping.name);
        setNewToppingPrice(topping.price.toString());
        setIsEditModalOpen(true);
    };

    // Update topping (name & price)
    const handleUpdateTopping = async () => {
        if (selectedTopping && newToppingName.trim() && newToppingPrice.trim()) {
            await updateTopping({
                groupId,
                toppingId: selectedTopping._id,
                name: newToppingName,
                price: parseFloat(newToppingPrice),
            });
            setIsEditModalOpen(false);
            refetch();
        }
    };

    // Add new topping
    const handleAddTopping = async () => {
        if (!newToppingName.trim() || !String(newToppingPrice).trim()) return;
        await addTopping({ groupId, name: newToppingName, price: parseFloat(newToppingPrice) });
        refetch();
        setIsAddToppingModalOpen(false);
        setNewToppingName("");
        setNewToppingPrice("");
    };

    // Remove topping
    const handleRemoveTopping = async (toppingId) => {
        await removeTopping({ groupId, toppingId });
        refetch();
    };

    if (isLoading || !toppingGroup) return <div>Loading...</div>;

    return (
        <>
            {/* Edit Topping Modal (for both name & price) */}
            <Modal
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onConfirm={handleUpdateTopping}
                title="Chỉnh sửa Topping"
                confirmTitle="Lưu"
                closeTitle="Hủy"
            >
                <input
                    type="text"
                    value={newToppingName}
                    onChange={(e) => setNewToppingName(e.target.value)}
                    placeholder="Nhập tên mới"
                    className="w-full p-2 border rounded-md mb-4"
                    required
                />
                <input
                    type="number"
                    value={newToppingPrice}
                    onChange={(e) => setNewToppingPrice(e.target.value)}
                    placeholder="Nhập giá mới"
                    className="w-full p-2 border rounded-md"
                    required
                />
            </Modal>

            {/* Add New Topping Modal */}
            <Modal
                open={isAddToppingModalOpen}
                onClose={() => setIsAddToppingModalOpen(false)}
                onConfirm={handleAddTopping}
                title="Thêm Topping Mới"
                confirmTitle="Thêm"
                closeTitle="Hủy"
            >
                <input
                    type="text"
                    value={newToppingName}
                    onChange={(e) => setNewToppingName(e.target.value)}
                    placeholder="Nhập tên topping"
                    className="w-full p-2 border rounded-md mb-4"
                    required
                />
                <input
                    type="number"
                    value={newToppingPrice}
                    onChange={(e) => setNewToppingPrice(e.target.value)}
                    placeholder="Nhập giá topping"
                    className="w-full p-2 border rounded-md"
                    required
                />
            </Modal>

            <Header title={toppingGroup.name || "Nhóm Topping"} goBack={true} />

            <div className="flex space-x-2 mt-24 items-center justify-between mx-4">
                <LabelWithIcon title="Thêm" iconPath="/assets/plus.png" onClick={() => setIsAddToppingModalOpen(true)} />
            </div>

            <div className="pt-2 pb-2 bg-gray-100 mt-4">
                <div className="bg-white rounded-md p-2">
                    {toppingGroup.toppings.map((topping) => (
                        <ToppingItem key={topping._id} item={topping} openEditModal={openEditModal} onRemove={handleRemoveTopping} />
                    ))}
                </div>
            </div>

            <NavBar page="orders" />
        </>
    );
};

const ToppingItem = ({ item, openEditModal, onRemove }) => {
    return (
        <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-md my-2">
            <p className="font-semibold">{item.name}</p>
            <div className="flex items-center space-x-3">
                <p className="text-gray-500 mr-4">{item.price}đ</p>
                <button onClick={() => openEditModal(item)} className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">Sửa</button>
                <button onClick={() => onRemove(item._id)} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm">Xóa</button>
            </div>
        </div>
    );
};

export default Page;
