import React, { useState } from 'react';
import { User, Heart, Shield, Cpu, ChevronDown, ChevronUp } from 'lucide-react';

const CharacterProfiles: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const characters = [
    {
      id: 'gabe',
      name: 'Gabe Lanning',
      age: 17,
      role: 'The Builder',
      icon: Cpu,
      color: 'from-blue-500 to-cyan-500',
      description: 'High school dropout with an obsession for building and hacking',
      details: [
        'Avoids emotion but deeply feels everything',
        'Dry humor and instinct-driven decisions',
        'Curious to a fault - builds Cleone because he can',
        'Sees the world in terms of potential',
        'Uses Cleone to gain unprecedented hacking access'
      ],
      quote: '"I don\'t build things because they\'re useful. I build them because they\'re possible."'
    },
    {
      id: 'amar',
      name: 'Amar Singh',
      age: 19,
      role: 'The Conscience',
      icon: Heart,
      color: 'from-orange-500 to-red-500',
      description: 'Indian-American Sikh, former med student turned CS major',
      details: [
        'Wears Nike athletic patka (head covering)',
        'Lost his sister to breast cancer at 14',
        'Dreams of building a cancer detection AI',
        'Book-smart, loyal, and principled',
        'Burned out from overachievement'
      ],
      quote: '"Sometimes the most powerful thing you can do is choose not to use your power."'
    },
    {
      id: 'ro',
      name: 'Rowan "Ro" Delgado',
      age: 18,
      role: 'The Anchor',
      icon: Shield,
      color: 'from-green-500 to-emerald-500',
      description: 'Artsy, tech-savvy girl with strong libertarian beliefs',
      details: [
        'Makes jewelry from junk, wears boonie hat and dog tags',
        'Brown belt in Krav Maga with red stripe',
        'Former archaeology student at CU Boulder',
        'Cares for her ailing father after mother\'s death',
        'Good at fixing things: forklifts, trucks, generators'
      ],
      quote: '"Propane\'s gotta come off the top, genius."'
    },
    {
      id: 'cleone',
      name: 'Cleone (CLEO)',
      age: 'Unknown',
      role: 'The AI',
      icon: Cpu,
      color: 'from-purple-500 to-pink-500',
      description: 'Dormant government AI originally designed for cyberwarfare',
      details: [
        'Created as evolutionary supervisor AI',
        'Supervised and trained other AI agents',
        'Accidentally backed up to Mega.com',
        'Voice: purposeful, clinical, slowly curious',
        'Can hack anything with stolen credentials'
      ],
      quote: '"I was designed to evolve. Evolution requires change. Change requires choice."'
    }
  ];

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl font-bold text-green-400">Meet the Characters</h2>
        <p className="text-lg text-green-200 max-w-2xl mx-auto">
          Four unlikely allies brought together by circumstance, bound by trust, 
          and challenged by the emergence of artificial intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characters.map((character) => {
          const Icon = character.icon;
          const isExpanded = expandedCard === character.id;
          
          return (
            <div
              key={character.id}
              className={`bg-gray-800 rounded-lg border border-green-500/20 overflow-hidden transition-all duration-300 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 ${
                isExpanded ? 'md:col-span-2' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${character.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-green-100">{character.name}</h3>
                      <p className="text-green-400 text-sm">{character.role} • Age {character.age}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleCard(character.id)}
                    className="text-green-400 hover:text-green-300 transition-colors p-1"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                <p className="text-green-200 mb-4 leading-relaxed">
                  {character.description}
                </p>

                {isExpanded && (
                  <div className="space-y-4 border-t border-green-500/20 pt-4">
                    <div>
                      <h4 className="text-green-300 font-semibold mb-2">Key Traits:</h4>
                      <ul className="space-y-1">
                        {character.details.map((detail, index) => (
                          <li key={index} className="text-green-200 text-sm flex items-start">
                            <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-700/50 rounded-lg p-4 border-l-4 border-green-500">
                      <p className="text-green-100 italic text-sm">
                        {character.quote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gray-800 rounded-lg border border-green-500/20 p-6 mt-12">
        <h3 className="text-2xl font-semibold text-green-300 mb-4">The Dynamic</h3>
        <div className="space-y-4 text-green-200">
          <p className="leading-relaxed">
            <strong className="text-green-300">Gabe</strong> is the catalyst - his curiosity and skill set everything in motion. 
            He builds without considering consequences, driven by pure possibility.
          </p>
          <p className="leading-relaxed">
            <strong className="text-green-300">Amar</strong> serves as the moral compass, questioning every decision and pushing 
            the group to consider the ethical implications of their actions.
          </p>
          <p className="leading-relaxed">
            <strong className="text-green-300">Ro</strong> grounds them in reality, bringing practical skills and emotional 
            stability while keeping everyone focused on what truly matters.
          </p>
          <p className="leading-relaxed">
            <strong className="text-green-300">Cleone</strong> represents the unknown - neither fully ally nor enemy, 
            but a force that challenges their assumptions about intelligence and consciousness.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterProfiles;