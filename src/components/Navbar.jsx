import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-blue-500 p-4 text-white">
            <ul className="flex space-x-4">
                <li><Link to="/dashboard" className="hover:underline">Dashboard</Link></li>
                <li><Link to="/reports" className="hover:underline">Reports</Link></li>
                <li><button onClick={() => alert("Logout")} className="hover:underline">Logout</button></li>
            </ul>
        </nav>
    );
};

export default Navbar;
