'use client';

import NavBar from "../../../components/NavBar";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import LabelWithIcon from "../../../components/LableWithIcon";
import Modal from "../../../components/Modal";
import {
    useGetAllCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} from "../../../redux/features/category/categoryApi";
import { useDispatch } from "react-redux";

const Page = () => {
    const dispatch = useDispatch();
    const storeData = localStorage.getItem("store");
    const storeId = JSON.parse(storeData)?._id;

    const { data: categoryData, isLoading, error, refetch } = useGetAllCategoriesQuery({ storeId });
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (categoryData?.data) {
            setCategories(categoryData.data);
        }
    }, [categoryData]);

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        try {
            await createCategory({ storeId, name: categoryName }).unwrap();
            setIsModalOpen(false);
            setCategoryName("");
            await refetch();
        } catch (err) {
            console.error("Failed to create category:", err);
        }
    };

    const handleUpdateCategory = async () => {
        if (!categoryName.trim() || !selectedCategory) return;

        try {
            await updateCategory({ categoryId: selectedCategory._id, name: categoryName }).unwrap();
            setIsModalOpen(false);
            setCategoryName("");
            setSelectedCategory(null);
            await refetch();
        } catch (err) {
            console.error("Failed to update category:", err);
        }
    };

    const handleDeleteCategory = async () => {
        if (!selectedCategory) return;

        try {
            await deleteCategory({ categoryId: selectedCategory._id }).unwrap();
            setIsDeleteModalOpen(false);
            setSelectedCategory(null);
            await refetch();
        } catch (err) {
            console.error("Failed to delete category:", err);
        }
    };

    return (
        <>
            <Modal
                open={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedCategory(null);
                }}
                onConfirm={selectedCategory ? handleUpdateCategory : handleCreateCategory}
                title={selectedCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
                confirmTitle={isCreating || isUpdating ? "Đang lưu..." : "Lưu"}
                closeTitle="Hủy"
            >
                <form onSubmit={selectedCategory ? handleUpdateCategory : handleCreateCategory}>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Nhập tên danh mục"
                        className="w-full p-2 border rounded-md mb-4"
                        required
                    />
                </form>
            </Modal>

            <Modal
                open={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteCategory}
                title="Xác nhận xóa"
                confirmTitle={isDeleting ? "Đang xóa..." : "Xóa"}
                closeTitle="Hủy"
            >
                <p>Bạn có chắc chắn muốn xóa danh mục này?</p>
            </Modal>

            <Header title="Chỉnh sửa danh mục" goBack={true} />
            <div className="flex justify-between items-center border-b pb-2 mx-4 mt-24">
                <LabelWithIcon title="Thêm" iconPath="/assets/plus.png" onClick={() => setIsModalOpen(true)} />
            </div>
            <div className="pt-4 pb-4 bg-gray-100 mt-4 h-full">
                {isLoading ? (
                    <p className="text-center text-gray-500">Đang tải danh mục...</p>
                ) : error ? (
                    <p className="text-center text-red-500">Lỗi khi tải danh mục</p>
                ) : (
                    <div className="bg-white rounded-md p-2">
                        {categories.map((item) => (
                            <CategoryItem key={item._id} item={item} onEdit={() => {
                                setSelectedCategory(item);
                                setCategoryName(item.name);
                                setIsModalOpen(true);
                            }} onDelete={() => {
                                setSelectedCategory(item);
                                setIsDeleteModalOpen(true);
                            }} />
                        ))}
                    </div>
                )}
            </div>
            <NavBar page="" />
        </>
    );
};

const CategoryItem = ({ item, onEdit, onDelete }) => {
    return (
        <div className="flex items-center justify-between bg-white p-3 rounded-md shadow-md my-2">
            <p className="font-semibold">{item.name}</p>
            <div className="flex space-x-2">
                <button onClick={onEdit} className="text-blue-500">✏️</button>
                <button onClick={onDelete} className="text-red-500">🗑️</button>
            </div>
        </div>
    );
};

export default Page;
