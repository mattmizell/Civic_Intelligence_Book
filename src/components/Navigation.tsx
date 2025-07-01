import React from 'react';
import { Book, Users, MapPin, Settings } from 'lucide-react';

interface NavigationProps {
  currentSection: string;
  setCurrentSection: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentSection, setCurrentSection }) => {
  const sections = [
    { id: 'cover', label: 'Cover', icon: Book },
    { id: 'characters', label: 'Characters', icon: Users },
    { id: 'settings', label: 'Settings', icon: MapPin },
    { id: 'chapters', label: 'Story', icon: Book },
  ];

  return (
    <nav className="flex space-x-1">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <button
            key={section.id}
            onClick={() => setCurrentSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              currentSection === section.id
                ? 'bg-green-600 text-white shadow-lg shadow-green-600/20'
                : 'text-green-300 hover:bg-gray-700 hover:text-green-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="font-medium">{section.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default Navigation;