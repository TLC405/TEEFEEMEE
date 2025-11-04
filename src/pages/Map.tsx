import React, { useState, useEffect, useMemo } from 'react';
import { mapMarkers, MapMarker } from '../data/seed';

const fetchMarkers = (): Promise<MapMarker[]> => 
  new Promise(resolve => setTimeout(() => resolve(mapMarkers), 1500));

const SkeletonMap: React.FC = () => (
  <div className="w-full h-96 bg-panel rounded-lg border border-panel-border animate-pulse flex items-center justify-center">
    <div className="w-1/2 h-8 bg-panel-border/50 rounded"></div>
  </div>
);

type FilterType = 'All' | 'Hub' | 'Data Center';

export const Map: React.FC = () => {
  const [allMarkers, setAllMarkers] = useState<MapMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');

  useEffect(() => {
    fetchMarkers().then(data => {
      setAllMarkers(data);
      setIsLoading(false);
    });
  }, []);

  const filteredMarkers = useMemo(() => {
    if (activeFilter === 'All') {
      return allMarkers;
    }
    return allMarkers.filter(marker => marker.type === activeFilter);
  }, [allMarkers, activeFilter]);
  
  return (
    <div className="animate-slide-in-up">
      {/* Hidden SVG definitions for reuse */}
      <svg width="0" height="0" className="absolute">
        <symbol id="map-marker-symbol" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.1.4-.27.61-.473A10.5 10.5 0 0014 15.553V8.75a4 4 0 00-8 0v6.803a10.5 10.5 0 003.122 6.474c.21.203.424.373.61.473a5.741 5.741 0 00.28.14l.018.008.006.003zM10 11.25a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
        </symbol>
      </svg>

      <h1 className="text-3xl font-bold text-text-primary mb-4">Map</h1>
      <p className="text-text-secondary mb-2">Visualizing AI Hub and Data Center locations.</p>
      
      <div className="flex items-center space-x-2 mb-4">
        {(['All', 'Hub', 'Data Center'] as FilterType[]).map(filter => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
              activeFilter === filter 
                ? 'bg-accent text-background' 
                : 'bg-panel-border text-text-secondary hover:bg-panel-border/50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {isLoading ? <SkeletonMap /> : filteredMarkers.length === 0 && !isLoading ? (
        <div className="w-full h-96 bg-panel rounded-lg border border-panel-border flex items-center justify-center">
          <p className="text-text-secondary">No map data available for this filter.</p>
        </div>
      ) : (
        <div className="relative w-full h-96 bg-panel rounded-lg border border-panel-border overflow-hidden">
          <p className="absolute top-4 left-4 text-sm text-text-secondary z-10">Faux Map View</p>
          
          <div className="absolute bottom-4 left-4 bg-background/80 p-3 rounded-lg border border-panel-border z-10 text-sm backdrop-blur-sm">
            <h4 className="font-bold mb-2 text-text-primary">Legend</h4>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-accent"><use href="#map-marker-symbol" /></svg>
              <span className="text-text-primary">Hub</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <svg className="w-5 h-5 text-blue-400"><use href="#map-marker-symbol" /></svg>
              <span className="text-text-primary">Data Center</span>
            </div>
          </div>

          {filteredMarkers.map(marker => {
            // Convert longitude (-180 to 180) to a 0-100 percentage for 'left' CSS property.
            const leftPercent = (marker.lng + 180) / 3.6;
            // Convert latitude (-90 to 90) to a 0-100 percentage for 'top' CSS property.
            // We flip the latitude so north is up.
            const topPercent = (-marker.lat + 90) / 1.8;
            
            return (
              <div 
                key={marker.id} 
                className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 group"
                style={{ 
                  left: `${leftPercent}%`,
                  top: `${topPercent}%` 
                }}
              >
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max px-2 py-1 bg-background text-text-primary text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-lg">{marker.label}</span>
                <svg fill="currentColor" className={`w-6 h-6 drop-shadow-lg animate-marker-pulse ${marker.type === 'Hub' ? 'text-accent' : 'text-blue-400'}`}>
                  <use href="#map-marker-symbol" />
                </svg>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};
