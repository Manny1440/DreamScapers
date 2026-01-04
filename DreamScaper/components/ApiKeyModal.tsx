
import React from 'react';
import { KeyRound, ExternalLink } from 'lucide-react';

export const ApiKeyModal: React.FC<{ onKeySelected: () => void }> = ({ onKeySelected }) => {
  const select = async () => {
    if ((window as any).aistudio) {
      // Fix: Trigger key selection dialog and immediately proceed per race condition guidelines
      await (window as any).aistudio.openSelectKey();
      onKeySelected();
    }
  };
  return (
    <div className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-2xl">
        <KeyRound size={48} className="mx-auto text-emerald-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Required</h2>
        <p className="text-slate-600 mb-4">This professional tool requires a paid API key for high-quality 2K generation.</p>
        
        {/* Fix: Mandatory link to billing documentation for paid project keys */}
        <div className="mb-6">
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-emerald-600 hover:underline text-sm flex items-center justify-center gap-1"
          >
            Billing documentation <ExternalLink size={14} />
          </a>
        </div>

        <button onClick={select} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2">
          Select API Key <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
};
