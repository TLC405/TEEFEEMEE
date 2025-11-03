import React, { useState } from 'react';
import { GalleryItem, CartoonVersion } from '../types';
import { GalleryDetailModal } from './GalleryDetailModal';

interface GalleryPanelProps {
  galleryItems: GalleryItem[];
  deleteGalleryItem: (itemId: string) => void;
  deleteVersion: (itemId: string, versionId: string) => void;
  onRecreate: (originalImage: string, prompt: string) => void;
  onClose: () => void;
}

interface SelectedVersionInfo {
  originalImage: string;
  version: CartoonVersion;
}

export const GalleryPanel: React.FC<GalleryPanelProps> = ({ 
  galleryItems, 
  deleteGalleryItem, 
  deleteVersion,
  onRecreate,
  onClose
}) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<SelectedVersionInfo | null>(null);

  const handleOpenModal = (originalImage: string, version: CartoonVersion) => {
    setSelectedVersion({ originalImage, version });
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedVersion(null);
  };

  const handleRecreate = (prompt: string) => {
    if (selectedVersion) {
      onRecreate(selectedVersion.originalImage, prompt);
      handleCloseDetailModal();
    }
  };

  return (
    <>
      {isDetailModalOpen && selectedVersion && (
        <GalleryDetailModal 
          originalImage={selectedVersion.originalImage}
          version={selectedVersion.version}
          onClose={handleCloseDetailModal}
          onRecreate={handleRecreate}
        />
      )}
      <div 
        className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div 
          className="bg-[#0d0d0d] w-full h-full max-w-7xl rounded-lg shadow-xl ring-1 ring-[var(--color-primary)]/20 flex flex-col p-4 sm:p-6 animate-slide-up"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-4 border-b border-gray-800 shrink-0">
            <h2 className="text-xl font-bold text-[var(--color-primary)] transition-colors duration-300 font-mono tracking-wider">G A L L E R Y _ A R C H I V E S</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors rounded-full p-1">
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          
          {galleryItems.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-center text-gray-500 font-mono">
              <p>&gt; NO DATA FOUND IN ARCHIVES...<br/>&gt; CREATE AND SAVE A CARTOON TO POPULATE.</p>
            </div>
          ) : (
            <div className="flex-grow overflow-y-auto pt-4 pr-2 -mr-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryItems.map((item) => (
                   <div key={item.id} className="bg-gray-900/50 p-3 rounded-lg ring-1 ring-gray-800 flex flex-col space-y-2">
                     <div className="relative aspect-square">
                        <img src={item.originalImage} alt="Original" className="w-full h-full object-cover rounded-md bg-gray-700" />
                        <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded font-mono">ORIGINAL</div>
                     </div>
                     <p className="text-xs text-gray-500 font-mono pl-1">Versions:</p>
                     <div className="flex-grow space-y-2">
                        {item.versions.map(version => (
                          <div key={version.id} className="bg-black/30 p-2 rounded-md flex items-center space-x-2">
                             <img src={version.cartoonImage} alt="Cartoon version" className="w-12 h-12 object-cover rounded flex-shrink-0 bg-gray-700" />
                            <div className="flex-grow text-xs text-gray-400 overflow-hidden font-mono">
                                <p className="truncate" title={version.prompt}>{version.prompt}</p>
                            </div>
                            <div className="flex items-center shrink-0">
                                <button onClick={() => handleOpenModal(item.originalImage, version)} className="p-1 text-gray-400 hover:text-[var(--color-primary)] transition-colors duration-300" title="Edit & Recreate">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"></path><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"></path></svg>
                                </button>
                                <button onClick={() => deleteVersion(item.id, version.id)} className="p-1 text-gray-400 hover:text-red-500" title="Delete this version">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                                </button>
                            </div>
                           </div>
                        ))}
                     </div>
                      <button 
                        onClick={() => deleteGalleryItem(item.id)}
                        className="w-full text-center text-gray-600 hover:text-red-500 text-xs font-mono transition-colors p-1 rounded bg-gray-800 hover:bg-red-900/50"
                      >
                       DELETE ORIGINAL & ALL VERSIONS
                      </button>
                   </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};