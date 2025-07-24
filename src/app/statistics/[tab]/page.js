import RevenueTab from "@/components/tabs/statistics/revenueTab";
import OrderTab from "@/components/tabs/statistics/orderTab";
import TopItemsTab from "@/components/tabs/statistics/itemTab";
import CustomerTab from "@/components/tabs/statistics/customerTab";
export default function TabPage({ params }) {
    const { tab } = params;

    const renderTabContent = () => {
        switch (tab) {
            case "revenue":
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">
                            💰 Revenue Overview
                        </h2>
                        <RevenueTab/>
                    </div>
                );
            case "orders":
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">
                            📦 Order Statistics
                        </h2>
                        <OrderTab/>
                    </div>
                );
            case "items":
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">
                            🌟 Top Performing Items
                        </h2>
                        <TopItemsTab/>
                    </div>
                );
            case "customers":
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">
                            👥 Customer Insights
                        </h2>
                        <CustomerTab/>
                    </div>
                );
            case "vouchers":
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">
                            🎟️ Voucher Performance
                        </h2>
                        <p className="text-gray-500">
                            This area covers usage stats and how vouchers affect
                            your revenue.
                        </p>
                    </div>
                );
            default:
                return <p className="text-red-500">Invalid tab</p>;
        }
    };

    return <>{renderTabContent()}</>;
}
