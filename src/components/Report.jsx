import React from "react";

const Report = ({ data }) => {
    return (
        <div>
            <h3 className="text-lg font-bold mb-4">Report</h3>
            <div className="bg-white p-4 shadow rounded">
                <h4>Total Orders: {data.totalOrders}</h4>
                <h4>Total Revenue: ${data.totalRevenue}</h4>
            </div>
        </div>
    );
};

export default Report;
