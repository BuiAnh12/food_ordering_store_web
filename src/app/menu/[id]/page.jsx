"use client";

import NavBar from "../../../components/NavBar";
import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import { useRouter } from "next/navigation";
import { useGetDishQuery, useGetToppingFromDishQuery, useUpdateDishMutation } from "../../../redux/features/dish/dishApi";
import { useGetAllToppingQuery } from "../../../redux/features/topping/toppingApi";
import { useGetAllCategoriesQuery } from "../../../redux/features/category/categoryApi";
import { useParams } from "next/navigation";
import { useUploadImagesMutation, useDeleteFileMutation } from "../../../redux/features/upload/uploadApi"

const Page = () => {
    const { id } = useParams();
    const storeData = localStorage.getItem("store");
    const storeId = JSON.parse(storeData)._id;
    const { data, isLoading, error } = useGetDishQuery(id);
    const { data: toppingData } = useGetToppingFromDishQuery(id);
    const { data: allToppingData } = useGetAllToppingQuery({ storeId });
    const { data: categoryData } = useGetAllCategoriesQuery({ storeId });
    const [updateDish] = useUpdateDishMutation();

    const dish = data?.data || {};
    const allToppings = allToppingData?.data || [];
    const categories = categoryData?.data || [];
    const toppings = toppingData?.data || [];
    const router = useRouter();
    const [uploadImages] = useUploadImagesMutation();
    const [deleteFile] = useDeleteFileMutation();

    const [image, setImage] = useState(dish?.image?.url || null);
    const [selectedToppings, setSelectedToppings] = useState(new Set(dish?.toppingGroups || []));
    const [selectedCategory, setSelectedCategory] = useState(dish?.category?._id || "");
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        description: "",
    });
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (dish) {
            console.log(dish)
            setImage(dish.image?.url || null);
            setFormData({
                name: dish.name || "",
                price: dish.price || "",
                description: dish.description || "",
            });
            setSelectedToppings(new Set(dish.toppingGroups || []));
            // setSelectedCategory(dish?.category.name || "");
            setSelectedCategory(dish?.category?._id || "");
        }
    }, [dish]);

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        console.log(selectedCategory)
    },[selectedCategory])

    const handleToppingToggle = (toppingId) => {
        setSelectedToppings((prev) => {
            const updatedSet = new Set(prev);
            if (updatedSet.has(toppingId)) {
                updatedSet.delete(toppingId);
            } else {
                updatedSet.add(toppingId);
            }
            return updatedSet;
        });
    };

    const handleSave = async () => {
        setShowModal(true);
    };

    const confirmSave = async () => {
        setShowModal(false);

        let uploadedImage = { filePath: "", url: image };

        // If image is changed (not an existing URL)
        if (image && !image.startsWith("http")) {
            try {
                const fileInput = document.getElementById("imageUpload");
                if (!fileInput.files.length) {
                    console.error("No file selected");
                    return;
                }

                const formData = new FormData();
                formData.append("file", fileInput.files[0]);

                // Step 1: Delete the previous image if exists
                if (dish.image?.url) {
                    await deleteFile(dish.image.url);
                }

                // Step 2: Upload new image
                const uploadResponse = await uploadImages(formData).unwrap();
                uploadedImage = {
                    filePath: uploadResponse[0].filePath,
                    url: uploadResponse[0].url,
                };
            } catch (error) {
                console.error("Image upload failed", error);
                return;
            }
        }

        // Step 3: Update dish with new image
        const updatedData = {
            name: formData.name,
            price: Number(formData.price),
            description: formData.description,
            image: uploadedImage,
            toppingGroups: Array.from(selectedToppings),
            category: selectedCategory,
        };

        await updateDish({ dishId: id, updatedData });
        router.back();
    };


    return (
        <>
            <Header title="Chi tiết món ăn" goBack={true} />
            <div className="w-full px-5 py-6 mt-12 mb-24">
                <div className="flex-1 overflow-auto space-y-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <label className="block text-sm font-semibold text-gray-700">Hình ảnh</label>
                        <div className="relative mt-3 w-24 h-24 rounded-md border flex items-center justify-center bg-gray-100">
                            {image ? (
                                <img src={image} alt="Uploaded" className="w-full h-full rounded-md object-cover" />
                            ) : (
                                <span className="text-gray-400">Chưa có ảnh</span>
                            )}
                            <input type="file" id="imageUpload" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            <button
                                onClick={() => document.getElementById("imageUpload").click()}
                                className="absolute top-1 right-1 bg-gray-700 text-white text-xs px-2 py-1 rounded-md shadow-md hover:bg-gray-900 transition"
                            >
                                Sửa
                            </button>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                        {[{ label: "Tên*", name: "name", type: "text" },
                        { label: "Giá*", name: "price", type: "number" },
                        { label: "Mô tả", name: "description", type: "text" },
                        ].map((field, index) => (
                            <div key={index} className="border-b pb-2">
                                <label className="block text-sm font-semibold text-gray-700">{field.label}</label>
                                <input
                                    type={field.type}
                                    name={field.name}
                                    value={formData[field.name]}
                                    onChange={handleChange}
                                    className="w-full p-2 ring-1 ring-gray-300 my-2 rounded-md outline-none focus:ring-[#fc6011]"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                        <label className="block text-sm font-semibold text-gray-700">Danh mục*</label>
                        <select
                            className="w-full p-2 ring-1 ring-gray-300 my-2 rounded-md outline-none focus:ring-[#fc6011]"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Topping của cửa hàng</h3>
                        {allToppings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {allToppings.map((topping) => (
                                    <label key={topping._id} className="flex items-center gap-3 p-2 border rounded-md shadow-sm hover:bg-gray-100">
                                        <input
                                            type="checkbox"
                                            checked={selectedToppings.has(topping._id)}
                                            onChange={() => handleToppingToggle(topping._id)}
                                        />
                                        {topping.name}
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Không có topping nào</p>
                        )}
                    </div>
                    <div className="flex justify-end w-full items-center">
                        <button onClick={handleSave} className="text-white p-3 px-10 text-md font-semibold rounded-lg bg-[#fc6011]">
                            Lưu
                        </button>
                    </div>
                    {showModal && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowModal(false)}>
                            <div className="bg-white p-5 rounded-lg shadow-lg p-10" onClick={(e) => e.stopPropagation()}>
                                <p>Bạn có chắc chắn muốn lưu?</p>
                                <div className="flex justify-end gap-3 mt-4">
                                    <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Đóng</button>
                                    <button onClick={confirmSave} className="bg-green-500 text-white px-4 py-2 rounded">Xác nhận</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <NavBar page="" />
        </>
    );
};

export default Page;
