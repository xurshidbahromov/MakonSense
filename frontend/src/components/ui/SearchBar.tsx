import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Train, Building2, ShoppingBag, X } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

interface SearchItem {
  id: string;
  name: string;
  category: 'district' | 'metro' | 'hub';
  lat: number;
  lon: number;
  description: string;
}

const TASHKENT_LOCATIONS: SearchItem[] = [
  // Metro Stations
  { id: 'm1', name: 'Amir Temur Xiyoboni', category: 'metro', lat: 41.3123, lon: 69.2797, description: "Chilonzor yo'nalishi (Markaz)" },
  { id: 'm2', name: 'Oybek bekati', category: 'metro', lat: 41.2981, lon: 69.2783, description: "O'zbekiston yo'nalishi (Mirobod)" },
  { id: 'm3', name: 'Chilonzor bekati', category: 'metro', lat: 41.2728, lon: 69.2062, description: "Chilonzor 9-mavze" },
  { id: 'm4', name: 'Novza bekati', category: 'metro', lat: 41.2917, lon: 69.2273, description: "Bunyodkor shoh ko'chasi" },
  { id: 'm5', name: 'Alisher Navoiy / Paxtakor', category: 'metro', lat: 41.3142, lon: 69.2528, description: "Peresadka markazi" },
  { id: 'm6', name: 'Buyuk Ipak Yo\'li', category: 'metro', lat: 41.3262, lon: 69.3347, description: "Mirzo Ulug'bek tumani" },
  { id: 'm7', name: 'Chorsu bekati', category: 'metro', lat: 41.3275, lon: 69.2359, description: "Eski Shahar va Bozor" },
  { id: 'm8', name: 'Yunusobod bekati', category: 'metro', lat: 41.3654, lon: 69.2907, description: "Yunusobod 11-mavze" },
  { id: 'm9', name: 'Bodomzor bekati', category: 'metro', lat: 41.3364, lon: 69.2842, description: "TV Tower va Akvapark yonida" },

  // Commercial Hubs & Malls
  { id: 'h1', name: 'Tashkent City Mall', category: 'hub', lat: 41.3142, lon: 69.2483, description: "Botir Zokirov ko'chasi, Shayxontohur" },
  { id: 'h2', name: 'Mirabad Avenue', category: 'hub', lat: 41.2965, lon: 69.2721, description: "Mirobod tumani premium rezidensiya" },
  { id: 'h3', name: 'Next Mall', category: 'hub', lat: 41.2989, lon: 69.2536, description: "Bobur ko'chasi, Yakkasaroy" },
  { id: 'h4', name: 'Samarqand Darvoza', category: 'hub', lat: 41.3168, lon: 69.2274, description: "Qoratosh ko'chasi" },
  { id: 'h5', name: 'Compass Mall', category: 'hub', lat: 41.2427, lon: 69.3371, description: "Qo'yliq aylanma yo'li" },
  { id: 'h6', name: 'Chorsu Bozori', category: 'hub', lat: 41.3271, lon: 69.2346, description: "Markaziy oziq-ovqat va kiyim bozori" },
  { id: 'h7', name: 'Oloy Bozori', category: 'hub', lat: 41.3204, lon: 69.2847, description: "Amir Temur shoh ko'chasi" },

  // Key Districts
  { id: 'd1', name: 'Chilonzor Tumani', category: 'district', lat: 41.2800, lon: 69.2150, description: "Aholi zich yashaydigan savdo zonasi" },
  { id: 'd2', name: 'Yunusobod 4-Mavze', category: 'district', lat: 41.3562, lon: 69.2891, description: "Ahmad Donish ko'chasi" },
  { id: 'd3', name: 'Mirobod Tumani', category: 'district', lat: 41.2950, lon: 69.2750, description: "Nukus va Oybek ko'chalari" },
  { id: 'd4', name: 'Sergeli Markaz', category: 'district', lat: 41.2235, lon: 69.2195, description: "Yangi ko'p qavatli massivlar" },
];

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { setSelectedCoords } = useAnalyticsStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim() === ''
    ? TASHKENT_LOCATIONS.slice(0, 5)
    : TASHKENT_LOCATIONS.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchItem) => {
    setSelectedCoords({ latitude: item.lat, longitude: item.lon });
    setQuery(item.name);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xs sm:max-w-sm">
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Toshkent: ko'cha, metro, savdo markazi..."
          className="w-full bg-[#13151D] border border-[#222735] focus:border-emerald-500/50 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all font-medium"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 text-gray-400 hover:text-white p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1.5 left-0 w-full bg-[#0D0F17]/95 backdrop-blur-xl border border-[#222735] rounded-xl shadow-2xl overflow-hidden z-50 py-1 max-h-72 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 tracking-wider flex items-center justify-between border-b border-[#222735]/60">
            <span>Toshkent Manzillari</span>
            <span className="font-mono text-[9px] text-emerald-400">Tezkor Skanerlash</span>
          </div>
          {filtered.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-gray-400">Manzil topilmadi</div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full px-3 py-2 text-left hover:bg-[#1A1E2C] transition-colors flex items-start gap-2.5 group"
              >
                <div className="p-1.5 rounded-lg bg-[#161925] border border-[#222735] text-gray-400 group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-all mt-0.5">
                  {item.category === 'metro' ? (
                    <Train className="w-3.5 h-3.5 text-cyan-400" />
                  ) : item.category === 'hub' ? (
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-gray-400 truncate">{item.description}</div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};
