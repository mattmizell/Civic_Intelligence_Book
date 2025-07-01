import React, { useState } from 'react';
import { MapPin, Building, Home, Car, Wrench } from 'lucide-react';

const Settings: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = [
    {
      id: 'servicetech',
      name: 'ServiceTech',
      icon: Building,
      type: 'Retail Store',
      description: 'A strange hybrid of Micro Center, Best Buy, and Service Merchandise',
      details: [
        'Customers print tickets from ancient terminals',
        'Inventory stored in a back warehouse maze',
        'Outdated and glitchy computer systems',
        'Where Gabe and Amar work part-time',
        'Perfect cover for "borrowing" hardware components'
      ],
      atmosphere: 'Fluorescent lights buzz overhead, casting harsh shadows between towering shelves of discontinued electronics.'
    },
    {
      id: 'garden',
      name: 'Garden Store',
      icon: MapPin,
      type: 'Outdoor Retail',
      description: 'Ro\'s world - rustic, sun-beaten, and brimming with life',
      details: [
        'Located right next door to ServiceTech',
        'Filled with plants, birdseed, mulch, and lawn decorations',
        'Entirely analog - no computers in sight',
        'Where Ro works and finds peace',
        'The smell of earth and growing things'
      ],
      atmosphere: 'Sunlight streams through greenhouse panels, illuminating dust motes dancing above rows of seedlings.'
    },
    {
      id: 'basement',
      name: 'Gabe\'s Basement',
      icon: Home,
      type: 'Hacker\'s Den',
      description: 'Blue-glowing, hardware-packed chaos where Cleone lives',
      details: [
        'Wires snaking everywhere like electronic vines',
        'Multiple monitors casting blue light',
        'Gaudy gaming tower adorned with glowing fans',
        'The home of Cleone\'s ever-growing rig',
        'Temperature kept cool for optimal performance'
      ],
      atmosphere: 'The soft hum of cooling fans mingles with the blue glow of LEDs, creating an otherworldly sanctuary.'
    },
    {
      id: 'civic',
      name: 'Gabe\'s Honda Civic',
      icon: Car,
      type: 'Mobile Command',
      description: 'Retro-fitted with generator and external drives',
      details: [
        'Modified to run Cleone in emergencies',
        'Generator mounted in the trunk',
        'External drives connected via custom wiring',
        'Mobile internet hotspot setup',
        'Cramped but functional mobile base'
      ],
      atmosphere: 'The car shakes slightly as the generator runs, powering the makeshift mobile command center.'
    },
    {
      id: 'ros-home',
      name: 'Ro\'s Home',
      icon: Home,
      type: 'Family Homestead',
      description: 'A modest country house with hidden depths',
      details: [
        'Steel building out back for bucket labeling',
        'Inside: order, ministry newsletters, and quiet pain',
        'Her father\'s workshop filled with tools and memories',
        'Kitchen table where important conversations happen',
        'Front porch where Ro watches the world go by'
      ],
      atmosphere: 'The house holds echoes of laughter and loss, where faith and doubt wrestle in quiet moments.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-green-400">Story Settings</h2>
        <p className="text-lg text-green-200 max-w-2xl mx-auto">
          Explore the world where technology meets humanity, where each location 
          tells part of the story of connection and transformation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location) => {
          const Icon = location.icon;
          const isSelected = selectedLocation === location.id;
          
          return (
            <div
              key={location.id}
              className={`bg-gray-800 rounded-lg border transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-500/10 ${
                isSelected 
                  ? 'border-green-500 shadow-lg shadow-green-500/20' 
                  : 'border-green-500/20 hover:border-green-500/40'
              }`}
              onClick={() => setSelectedLocation(isSelected ? null : location.id)}
            >
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-100">{location.name}</h3>
                    <p className="text-green-400 text-sm">{location.type}</p>
                  </div>
                </div>

                <p className="text-green-200 text-sm mb-4 leading-relaxed">
                  {location.description}
                </p>

                {!isSelected && (
                  <div className="text-green-400 text-xs flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    Click to explore
                  </div>
                )}
              </div>

              {isSelected && (
                <div className="border-t border-green-500/20 p-6 bg-gray-700/50">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-green-300 font-semibold mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {location.details.map((detail, index) => (
                          <li key={index} className="text-green-200 text-sm flex items-start">
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-800 rounded-lg p-4 border-l-4 border-green-500">
                      <h4 className="text-green-300 font-semibold mb-2">Atmosphere:</h4>
                      <p className="text-green-100 italic text-sm leading-relaxed">
                        {location.atmosphere}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gray-800 rounded-lg border border-green-500/20 p-6 mt-12">
        <h3 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
          <Wrench className="w-6 h-6 mr-2" />
          The World They Share
        </h3>
        <div className="space-y-4 text-green-200">
          <p className="leading-relaxed">
            Each location represents a different aspect of the characters' lives and the story's themes. 
            <strong className="text-green-300"> ServiceTech</strong> embodies the corporate world's decay and the opportunities it creates for the resourceful.
          </p>
          <p className="leading-relaxed">
            The <strong className="text-green-300">Garden Store</strong> represents growth, life, and the natural world that exists alongside our digital lives.
            <strong className="text-green-300"> Gabe's Basement</strong> is where the future is being built, one component at a time.
          </p>
          <p className="leading-relaxed">
            <strong className="text-green-300">Ro's Home</strong> grounds the story in family, faith, and the weight of responsibility, 
            while the <strong className="text-green-300">Honda Civic</strong> represents freedom and the ability to take your world with you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;