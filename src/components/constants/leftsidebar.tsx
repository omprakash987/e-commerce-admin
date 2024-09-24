"use client"



import React from 'react';
import Link from 'next/link';
import { FiHome, FiShoppingCart, FiBox, FiUsers } from 'react-icons/fi';

const menuItems = [
  { name: 'Dashboard', icon: FiHome, path: '/dashboard' },
  {name:"Categories",icon:FiBox,path:"/category"},
  { name: 'Orders', icon: FiShoppingCart, path: '/orders' },
  { name: 'Products', icon: FiBox, path: '/products' },
  { name: 'Customers', icon: FiUsers, path: '/customers' },
];

const LeftSidebar: React.FC = () => {
  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <ul>
        {menuItems.map((item) => (
          <li key={item.name} className="mb-4">
            <Link href={item.path}>
              
                <item.icon className="mr-3" />
                <span>{item.name}</span>
           
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LeftSidebar;