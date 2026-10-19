import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Train, ShoppingBag, Globe2, X, Compass, GitCompare } from 'lucide-react';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';

interface SearchItem {
  id: string;
  name: string;
  category: 'district' | 'metro' | 'hub' | 'region';
  lat: number;
  lon: number;
  description: string;
}

const UZBEKISTAN_LOCATIONS: SearchItem[] = [
  // Metro Stations
  { id: 'm1', name: 'Amir Temur Xiyoboni', category: 'metro', lat: 41.3123, lon: 69.2797, description: "Chilonzor yo‘nalishi · Markaziy hab" },
  { id: 'm2', name: 'Oybek bekati', category: 'metro', lat: 41.2981, lon: 69.2783, description: "O‘zbekiston yo‘nalishi · Mirobod" },
  { id: 'm3', name: 'Chilonzor bekati', category: 'metro', lat: 41.2728, lon: 69.2062, description: "Chilonzor 9-mavze · Yuqori oqim" },
  { id: 'm4', name: 'Novza bekati', category: 'metro', lat: 41.2917, lon: 69.2273, description: "Bunyodkor shoh ko‘chasi" },
  { id: 'm5', name: 'Alisher Navoiy / Paxtakor', category: 'metro', lat: 41.3142, lon: 69.2528, description: "Markaziy peresadka tuguni" },
  { id: 'm6', name: 'Buyuk Ipak Yo‘li', category: 'metro', lat: 41.3262, lon: 69.3347, description: "Mirzo Ulug‘bek · Maksim Gorkiy" },
  { id: 'm7', name: 'Chorsu bekati', category: 'metro', lat: 41.3275, lon: 69.2359, description: "Eski Shahar · Maksimal savdo oqimi" },
  { id: 'm8', name: 'Yunusobod bekati', category: 'metro', lat: 41.3654, lon: 69.2907, description: "Yunusobod 11-mavze · Mega Planet" },
  { id: 'm9', name: 'Bodomzor bekati', category: 'metro', lat: 41.3364, lon: 69.2842, description: "Xalqaro biznes markazi va Ekspomarkaz" },
  { id: 'm10', name: 'Beruniy bekati', category: 'metro', lat: 41.3448, lon: 69.2065, description: "Talabalar shaharchasi · O‘zMU" },
  { id: 'm11', name: 'Toshkent (Shimoliy Vokzal)', category: 'metro', lat: 41.2923, lon: 69.2869, description: "Temiryo‘l va metro transport tuguni" },
  { id: 'm12', name: 'Qo‘yliq bekati', category: 'metro', lat: 41.2389, lon: 69.3274, description: "Yer usti halqa yo‘li · Compass" },

  // Commercial Hubs & Malls
  { id: 'h1', name: 'Tashkent City Mall & IBC', category: 'hub', lat: 41.3142, lon: 69.2483, description: "Botir Zokirov ko‘chasi · Premium biznes markaz" },
  { id: 'h2', name: 'Mirabad Avenue Residence', category: 'hub', lat: 41.2965, lon: 69.2721, description: "Mirobod tumani · Luxury restoran va butiklar" },
  { id: 'h3', name: 'Next Mall & Bobur ko‘chasi', category: 'hub', lat: 41.2989, lon: 69.2536, description: "Yakkasaroy tumani savdo koridori" },
  { id: 'h4', name: 'Samarqand Darvoza Mall', category: 'hub', lat: 41.3168, lon: 69.2274, description: "Qoratosh ko‘chasi · Oilaviy savdo markazi" },
  { id: 'h5', name: 'Magic City Park & Mall', category: 'hub', lat: 41.3041, lon: 69.2458, description: "Milliy bog‘ · Turistik va ko‘ngilochar markaz" },
  { id: 'h6', name: 'Chorsu Bozori', category: 'hub', lat: 41.3271, lon: 69.2346, description: "Markaziy ulgurji va chakana savdo bozori" },
  { id: 'h7', name: 'Oloy Bozori', category: 'hub', lat: 41.3204, lon: 69.2847, description: "Amir Temur shoh ko‘chasi · Markaz" },
  { id: 'h8', name: 'Riviera Mall', category: 'hub', lat: 41.3396, lon: 69.2534, description: "Nurafshon aylanma ko‘chasi · Sebzor" },
  { id: 'h9', name: 'Taras Shevchenko Gastronomik Ko‘chasi', category: 'hub', lat: 41.3031, lon: 69.2762, description: "24/7 HoReCa va kafe klasteri" },

  // Key Districts
  { id: 'd1', name: 'Chilonzor Savdo Markazi', category: 'district', lat: 41.2800, lon: 69.2150, description: "Aholi eng zich yashaydigan tuman" },
  { id: 'd2', name: 'Yunusobod 4-Mavze', category: 'district', lat: 41.3562, lon: 69.2891, description: "Ahmad Donish shoh ko‘chasi" },
  { id: 'd3', name: 'Mirobod va Nukus ko‘chasi', category: 'district', lat: 41.2950, lon: 69.2750, description: "Yuqori xarid qobiliyatli rezidentlar" },
  { id: 'd4', name: 'Sergeli Yangi Hayot', category: 'district', lat: 41.2248, lon: 69.2185, description: "Yangi ko‘p qavatli turar-joy massivlari" },

  // Regions of Uzbekistan
  { id: 'r1', name: 'Samarqand — Registon Markazi', category: 'region', lat: 39.6542, lon: 66.9758, description: "Samarqand shahri · Turistik va savdo markazi" },
  { id: 'r2', name: 'Buxoro — Labi Hovuz Markazi', category: 'region', lat: 39.7732, lon: 64.4215, description: "Buxoro shahri · Tarixiy va HoReCa markazi" },
  { id: 'r3', name: "Farg'ona — Al-Farg'oniy Markazi", category: 'region', lat: 40.3842, lon: 71.7843, description: "Farg'ona vodiysi markaziy habi" },
  { id: 'r4', name: 'Andijon — Yangi Bozor Markazi', category: 'region', lat: 40.7821, lon: 72.3442, description: "Andijon shahri Bobur shoh ko‘chasi" },
  { id: 'r5', name: 'Namangan — Chorsu Markazi', category: 'region', lat: 41.0011, lon: 71.6683, description: "Namangan shahri savdo koridori" },
];

function parseCoordinateQuery(q: string): { lat: number; lon: number } | null {
  const cleaned = q.trim().replace(/[[\]()°NE]/gi, '');
  const parts = cleaned.split(/[\s,;]+/).filter(Boolean);
  if (parts.length !== 2) return null;
  const lat = parseFloat(parts[0]);
  const lon = parseFloat(parts[1]);
  if (isNaN(lat) || isNaN(lon)) return null;
  if (lat >= 36 && lat <= 46 && lon >= 55 && lon <= 75) {
    return { lat, lon };
  }
  return null;
}

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'metro' | 'hub' | 'district' | 'region'>('all');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { setSelectedCoords, setCompareCoords, setActiveSidebarTab } = useAnalyticsStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const parsedCoord = parseCoordinateQuery(query);

  const filtered = UZBEKISTAN_LOCATIONS.filter((item) => {
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
    const matchesQuery =
      query.trim() === '' ||
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  }).slice(0, 9);

  // Reset highlighted index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query, activeFilter]);

  // Global Cmd+K / Ctrl+K or '/' shortcut to focus SearchBar instantly (no animation delay)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      } else if (!isEditing && e.key === '/') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPrimary = (lat: number, lon: number, label: string) => {
    setSelectedCoords({ latitude: lat, longitude: lon });
    setQuery(label);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleSelectCompare = (e: React.MouseEvent, lat: number, lon: number) => {
    e.stopPropagation();
    setCompareCoords({ latitude: lat, longitude: lon });
    setActiveSidebarTab('compare');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <label className="sr-only" htmlFor="makon-spatial-search">
        Manzil, metro, savdo markazi yoki GPS koordinata qidiruvi
      </label>
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-[#0E9F6E] absolute left-3.5 pointer-events-none" aria-hidden="true" />
        <input
          id="makon-spatial-search"
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="makon-search-listbox"
          aria-autocomplete="list"
          value={query}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setIsOpen(true);
              if (filtered.length > 0) {
                setActiveIndex((prev) => (prev + 1) % filtered.length);
              }
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setIsOpen(true);
              if (filtered.length > 0) {
                setActiveIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
              }
            } else if (e.key === 'Enter' && parsedCoord) {
              e.preventDefault();
              handleSelectPrimary(
                parsedCoord.lat,
                parsedCoord.lon,
                `${parsedCoord.lat.toFixed(4)}, ${parsedCoord.lon.toFixed(4)}`
              );
            } else if (e.key === 'Enter' && filtered.length > 0) {
              e.preventDefault();
              const chosen = filtered[activeIndex] || filtered[0];
              handleSelectPrimary(chosen.lat, chosen.lon, chosen.name);
            } else if (e.key === 'Escape') {
              setIsOpen(false);
              inputRef.current?.blur();
            }
          }}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Manzil, metro yoki GPS (41.312, 69.280)..."
          className="w-full h-[38px] bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.06] dark:hover:bg-white/[0.09] focus:bg-white/80 dark:focus:bg-[#1C1C1F]/90 border border-black/[0.06] dark:border-white/[0.1] focus:border-[#0E9F6E] dark:focus:border-[#0E9F6E] rounded-full pl-9 pr-14 text-base sm:text-xs text-[#111111] dark:text-[#FDFDFD] placeholder-[#7A807C] dark:placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/20 transition-[border-color,box-shadow,background-color] duration-150 font-medium"
        />
        {query ? (
          <button
            type="button"
            aria-label="Qidiruv maydonini tozalash"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 text-[#8A908C] hover:text-[#111111] dark:hover:text-white p-1 rounded-full press-scale cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-[#7A807C] dark:text-[#9CA3AF] bg-white/70 dark:bg-white/[0.08] border border-black/[0.06] dark:border-white/[0.1] rounded-md absolute right-2.5 pointer-events-none select-none">
            ⌘K
          </kbd>
        )}
      </div>

      {isOpen && (
        <div
          id="makon-search-listbox"
          role="listbox"
          className="popover-origin-tc apple-glass-dropdown absolute top-full mt-2.5 left-0 w-full sm:w-[430px] rounded-[24px] overflow-hidden z-50"
        >
          {/* Category Filter Pills */}
          <div className="px-3 py-2 border-b border-black/[0.06] dark:border-white/[0.06] flex items-center gap-1 overflow-x-auto no-scrollbar select-none">
            {[
              { id: 'all', label: 'Barchasi' },
              { id: 'metro', label: 'Metro' },
              { id: 'hub', label: 'Savdo Hab' },
              { id: 'district', label: 'Tumanlar' },
              { id: 'region', label: 'Viloyatlar' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`press-scale px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#111111] text-white dark:bg-white dark:text-[#111111]'
                    : 'bg-black/[0.04] dark:bg-white/[0.05] text-[#6E7470] dark:text-[#9CA3AF] hover:text-[#111111] dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-black/[0.04] dark:divide-white/[0.04]">
            {parsedCoord && (
              <button
                type="button"
                onClick={() =>
                  handleSelectPrimary(
                    parsedCoord.lat,
                    parsedCoord.lon,
                    `${parsedCoord.lat.toFixed(4)}, ${parsedCoord.lon.toFixed(4)}`
                  )
                }
                className="w-full px-3.5 py-2.5 text-left bg-[#0E9F6E]/[0.08] hover:bg-[#0E9F6E]/[0.14] flex items-center gap-2.5 transition-colors duration-150 cursor-pointer"
              >
                <div className="p-1.5 rounded-lg bg-[#0E9F6E] text-white">
                  <Compass className="w-3.5 h-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-[#0E9F6E] tabular-nums">
                    Koordinataga o‘tish: [{parsedCoord.lat.toFixed(4)}, {parsedCoord.lon.toFixed(4)}]
                  </div>
                  <div className="text-[10px] text-[#6E7470] dark:text-[#9CA3AF]">
                    Aniq GPS nuqtasi bo‘yicha MakonScore hisoblash
                  </div>
                </div>
              </button>
            )}

            {filtered.length === 0 && !parsedCoord ? (
              <div className="px-4 py-6 text-center text-xs text-[#7A807C]">
                Manzil topilmadi. Koordinata kiriting (masalan: 41.312, 69.280) yoki xaritadan bosing.
              </div>
            ) : (
              filtered.map((item, idx) => {
                const isHighlighted = idx === activeIndex;
                return (
                  <div
                    key={item.id}
                    role="option"
                    aria-selected={isHighlighted}
                    onMouseEnter={() => setActiveIndex(idx)}
                    onClick={() => handleSelectPrimary(item.lat, item.lon, item.name)}
                    className={`w-full px-3.5 py-2.5 text-left transition-colors duration-150 flex items-center justify-between gap-2 group cursor-pointer ${
                      isHighlighted
                        ? 'bg-black/[0.04] dark:bg-white/[0.06]'
                        : 'hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className="p-1.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.06] text-[#111111] dark:text-white mt-0.5 shrink-0">
                        {item.category === 'metro' ? (
                          <Train className="w-3.5 h-3.5 text-[#0E9F6E]" />
                        ) : item.category === 'hub' ? (
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />
                        ) : item.category === 'region' ? (
                          <Globe2 className="w-3.5 h-3.5 text-indigo-500" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-[#0E9F6E]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-[#111111] dark:text-[#FDFDFD] group-hover:text-[#0E9F6E] transition-colors duration-150 truncate">
                          {item.name}
                        </div>
                        <div className="text-[10px] text-[#7A807C] dark:text-[#9CA3AF] truncate">
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {/* Quick A/B Compare Action Button */}
                    <button
                      type="button"
                      onClick={(e) => handleSelectCompare(e, item.lat, item.lon)}
                      title="B nuqta sifatida solishtirish"
                      className={`press-scale px-2 py-1 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-mono font-semibold flex items-center gap-1 shrink-0 cursor-pointer ${
                        isHighlighted ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <GitCompare className="w-3 h-3" />
                      <span>B nuqta</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
