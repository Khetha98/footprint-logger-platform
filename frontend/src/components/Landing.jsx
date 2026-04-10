import React from 'react';

export default function Landing({ onGetStarted }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Track Your Impact. <span className="text-green-600">Save the Planet.</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Join a community of eco-conscious citizens in Soweto and beyond. 
          Log your daily activities, visualize your carbon footprint, and get 
          personalized tips to reduce your environmental impact.
        </p>
        <button 
          onClick={onGetStarted}
          className="bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-green-700 transition shadow-lg"
        >
          Get Started for Free
        </button>
      </div>
    </div>
  );
}