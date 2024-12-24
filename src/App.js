import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Index from "./components/Index";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Report from "./components/Report";
import OrderList from "./components/OrderList";
import ItemForm from "./components/ItemForm";
import UserOrders from "./components/UserOrders";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Dashboard />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="/report" element={<Report />} />
                <Route exact path="/itemForm" element={<ItemForm />} />
                <Route exact path="/orders" element={<OrderList />} />
                <Route exact path="/users" element={<UserOrders/>} />
                <Route exact path="/users/:userId" element={<UserOrders/>} />
                <Route exact path="/orders/:userId" element={<OrderList />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
