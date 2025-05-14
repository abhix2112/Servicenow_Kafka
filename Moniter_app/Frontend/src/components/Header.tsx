import React from 'react';
import { Activity, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onRefresh: () => void;
  lastUpdated: Date;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, lastUpdated }) => {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Activity size={28} className="text-white" />
          <h1 className="text-2xl font-bold">Kafka Pipeline Monitor</h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm opacity-80">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button
            onClick={onRefresh}
            className="flex items-center space-x-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;