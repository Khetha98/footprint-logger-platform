import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import axios from 'axios';

const EMISSION_FACTORS = {
  transport: [
    { name: 'Petrol Car (10km)', value: 1.92 },
    { name: 'Bus Trip', value: 0.8 },
    { name: 'Flight (Short)', value: 150.0 }
  ],
  food: [
    { name: 'Beef Meal', value: 6.5 },
    { name: 'Chicken Meal', value: 1.3 },
    { name: 'Vegan Meal', value: 0.4 }
  ],
  energy: [
    { name: 'AC (1hr)', value: 1.5 },
    { name: 'Laundry Load', value: 0.6 },
    { name: 'Daily Grid Avg', value: 4.5 }
  ]
};

const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

export default function Dashboard() {
  // Change 1: Start with an empty array, NOT localStorage
  const [activities, setActivities] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [communityAvg, setCommunityAvg] = useState(0);
  const [filter, setFilter] = useState('all');
  

  // Change 2: Fetch data from MongoDB on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://127.0.0.1:5001/api/activities', {
          headers: { 'x-auth-token': token }
        });
        setActivities(res.data.activities);
        setCommunityAvg(res.data.communityAvg);
      } catch (err) {
        console.error("Error fetching user activities:", err);
      }
    };
    fetchUserData();
  }, []);

  // Simple logic to add to your fetchUserData
  // eslint-disable-next-line no-unused-vars
  const calculateStreak = (logs) => {
    // Logic to count consecutive days... for now, a simple count of unique days works!
    const uniqueDays = new Set(logs.map(a => new Date(a.date).toLocaleDateString())).size;
    return uniqueDays;
  };
  // Change 3: Update addActivity to save to the DATABASE
  const addActivity = async (cat, name, val) => {
    const token = localStorage.getItem('token');
    const activityData = {
      category: cat,
      activityName: name, // Matches your Schema
      co2Value: val
    };

    try {
      const res = await axios.post('http://127.0.0.1:5001/api/activities', activityData, {
        headers: { 'x-auth-token': token }
      });
      // Add the response from the server (which includes the userId and _id) to state
      setActivities([res.data, ...activities]);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      console.error("Failed to save activity to database");
    }
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('footprint_logs', JSON.stringify(activities));
  }, [activities]);

  // Logic: Derived Data for Insights & Charts
  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(a => a.category === filter);

  const totalEmissions = activities.reduce((sum, act) => sum + act.co2Value, 0);

  const chartData = ['food', 'transport', 'energy'].map(cat => ({
    name: cat.toUpperCase(),
    value: activities.filter(a => a.category === cat).reduce((sum, a) => sum + a.co2Value, 0)
  })).filter(d => d.value > 0);

  // Insight Engine Logic
  const getTopCategory = () => {
    if (chartData.length === 0) return null;
    return chartData.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  };

  const topCat = getTopCategory();


  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      {/* 1. Header & Summary Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
        <h3 className="text-gray-500 text-sm font-medium">Total Footprint</h3>
        <p className="text-4xl font-bold text-green-600">{totalEmissions.toFixed(2)} kg</p>
        <p className="text-xs text-gray-400 mt-2">
          Community Average: <span className="font-bold">{communityAvg.toFixed(2)} kg</span>
        </p>
      </div>

      {/* Add this near your Total Footprint card */}
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
      <h3 className="text-gray-500 text-sm font-medium">Activity Streak</h3>
      <p className="text-4xl font-bold text-blue-600">{calculateStreak(activities)} <span className="text-lg text-gray-400">Days</span></p>
    </div>
            
        {/* Insight Engine Tip */}
        <div className="md:col-span-2 bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="text-green-800 font-bold mb-2">🌱 Personalized Tip</h3>
          <p className="text-green-700">
            {topCat 
              ? `Your highest emissions come from ${topCat.name}. Try reducing usage in this area to hit your weekly goal!`
              : "Start logging your daily activities to get personalized reduction tips."}
          </p>
        </div>

        {/* Inside the Insight Engine section */}
      <div className="mt-4">
        <div className="flex justify-between text-xs font-bold mb-1">
          <span>Weekly Goal Progress</span>
          <span>{((totalEmissions / 100) * 100).toFixed(0)}% of 100kg limit</span>
        </div>
        <div className="w-full bg-green-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${totalEmissions > 100 ? 'bg-red-500' : 'bg-green-600'}`} 
            style={{ width: `${Math.min((totalEmissions / 100) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 2. Activity Logging Form */}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Log Activity</h2>
          <div className="space-y-4">
            {Object.keys(EMISSION_FACTORS).map(cat => (
              <div key={cat} className="space-y-2">
                <label className="text-sm font-semibold capitalize text-gray-600">{cat}</label>
                <div className="flex flex-wrap gap-2">
                  {EMISSION_FACTORS[cat].map(item => (
                    <button
                      key={item.name}
                      onClick={() => addActivity(cat, item.name, item.value)}
                      className="text-xs bg-gray-50 hover:bg-green-100 border border-gray-200 py-2 px-3 rounded-lg transition"
                    >
                      + {item.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Visual Summary (Charts) */}
        <section className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
          <h2 className="text-xl font-bold mb-4">Emission Breakdown</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 italic">No data yet</div>
          )}
        </section>
      </div>

      {/* 4. Filterable Logs Table */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold">Activity Logs</h2>
          <select 
            className="border rounded-md px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-green-500"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="transport">Transport</option>
            <option value="food">Food</option>
            <option value="energy">Energy</option>
          </select>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3">Activity</th>
              <th className="px-6 py-3 text-right">CO2 (kg)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredActivities.map(act => (
              <tr key={act.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-500">{act.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    act.category === 'transport' ? 'bg-blue-100 text-blue-700' : 
                    act.category === 'food' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {act.category}
                  </span>
                </td>
                <td className="px-6 py-4 font-medium">{act.name}</td>
                <td className="px-6 py-4 text-right font-mono font-bold">{act.co2Value.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}