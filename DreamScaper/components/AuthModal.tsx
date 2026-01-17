import React, { useState } from 'react';
import { ArrowRight, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (u: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      onAuthSuccess({
        id: 'u1',
        email: 'pro@landscaper.com',
        name: 'John Doe',
        subscriptionStatus: 'NONE',
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create Pro Account</h2>
          <button onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="email"
            placeholder="Email"
            required
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              'Processing...'
            ) : (
              <>
                Start My Trial <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;

