"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetOrderQuery } from "../../../redux/features/order/orderApi";
import Header from "../../../components/Header";
import NavBar from "../../../components/NavBar";
import LatestOrder from "../../../components/fragment/LatestOrder";
import ConfirmedOrder from "../../../components/fragment/ConfirmedOrder";
import HistoryOrder from "../../../components/fragment/HistoryOrder";

const OrderDetailsPage = () => {
    const { id } = useParams();
    const { data, isLoading, error } = useGetOrderQuery({ orderId: id , refetchOnMountOrArgChange: true,});

    if (!id) return <p>Invalid Order ID</p>;
    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading order details</p>;

    const order = data?.data;

    // Xác định component dựa vào trạng thái đơn hàng
    const getOrderComponent = () => {
        switch (order?.status) {
            case "pending":
                return <LatestOrder order={order} />;
            case "confirmed":
            case "finished":
                return <ConfirmedOrder order={order} />;
            case "delivered": 
            case "cancelled":
                return <HistoryOrder order={order} />;
            default:
                return <p>Không xác định trạng thái đơn hàng</p>;
        }
    };

    return (
        <>
            <Header title="Chi tiết đơn hàng" goBack={true} />
            {getOrderComponent()}
            <NavBar page="orders" />
        </>
    );
};

export default OrderDetailsPage;
