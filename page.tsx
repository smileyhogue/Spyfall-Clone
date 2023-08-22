import React from 'react';

const Page: React.FC = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      <header className="bg-blue-500 text-white p-4">
        <h1>Spyfall Clone</h1>
      </header>
      <main className="flex-grow p-4">
        {children}
      </main>
      <footer className="bg-gray-800 text-white p-4">
        <p>&copy; 2023 Spyfall Clone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Page;
