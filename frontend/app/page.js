'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import EqualExperts from '../public/images/equal-experts.png'

export default function Home() {

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ item_name: '' });
  const [editItem, setEditItem] = useState(null);
  const [editedItem, setEditedItem] = useState({ item_name: '' });

    useEffect(() => {
      const fetchItems = async () => {
        const response = await axios.get('http://localhost:3333/');
        setItems(response.data);
      };
      fetchItems();
    }, []);
  
    const handleChange = (e) => {
      setNewItem({ ...newItem, [e.target.name]: e.target.value });
    };
  
    const handleEditChange = (e) => {
      setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3333/add-item', newItem);
        setItems([...items, response.data]);
        setNewItem({ item_name: '' });
      } catch (error) {
        console.error('Error adding item:', error);
      }
    };
  
    const handleToggle = async (id) => {
      try {
        const response = await axios.put(`http://localhost:3333/${id}`);
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, purchased: response.data.purchased } : item
          )
        );
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:3333/${id}`);
        setItems(items.filter((item) => item.id !== id));
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleEditClick = (item) => {
      setEditItem(item.id);
      setEditedItem({ item_name: item.item_name });
    };
  
    const handleSave = async (id) => {
      try {
        const response = await axios.put(`http://localhost:3333/edit/${id}`, editedItem);
        setItems(
          items.map((item) =>
            item.id === id ? { ...item, item_name: response.data.item_name } : item
          )
        );
        setEditItem(null);
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleKeyPress = (e, id) => {
      if (e.key === 'Enter') {
        handleSave(id);
      }
    };

  return (
    <div className="min-h-screen bg-gray-100">
     <header className="py-4">
      <div className="container flex">
        <div className="flex-col">
          <Image src={EqualExperts} alt="Logo" width={200} className="mr-2" />
          <div>
              <span className="text-4xl font-semibold">Grocery List</span>
          </div>
        </div>
      </div>
     </header>

     <main className="p-4">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              name="item_name"
              value={newItem.item_name}
              onChange={handleChange}
              placeholder="Apples"
              className="border rounded p-2 flex-grow"
              required
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-10">
              +
            </button>
          </div>
        </form>

        <ul>
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.purchased}
                  onChange={() => handleToggle(item.id)}
                  className="mr-2"
                />
                {editItem === item.id ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      name="item_name"
                      value={editedItem.item_name}
                      onChange={handleEditChange}
                      onBlur={() => handleSave(item.id)}
                      onKeyPress={(e) => handleKeyPress(e, item.id)}
                      className="border rounded p-2"
                      autoFocus
                    />
                  </div>
                ) : (
                  <span
                    onClick={() => handleEditClick(item)}
                    className={`cursor-pointer ${item.purchased ? 'line-through' : ''}`}
                  >
                    {item.item_name}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-500 text-white px-4 py-2 rounded w-10"
              >
                -
              </button>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}