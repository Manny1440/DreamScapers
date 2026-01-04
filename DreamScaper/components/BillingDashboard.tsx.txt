
import React from 'react';
import { User } from '../types';
import { CreditCard, Calendar, ShieldCheck } from 'lucide-react';

export const BillingDashboard: React.FC<{ user: User }> = ({ user }) => (
  <div className="max-w-2xl mx-auto py-12">
    <h2 className="text-3xl font-bold mb-8">Billing & Plan</h2>
    <div className="bg-white p-6 rounded-2xl border shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-slate-500">Current Status</p>
          <h3 className="text-2xl font-bold text-emerald-700">Pro Trial Active</h3>
        </div>
        <ShieldCheck size={40} className="text-emerald-600" />
      </div>
      <div className="border-t py-4 text-sm text-slate-600 space-y-2">
        <div className="flex items-center gap-2"><Calendar size={16}/> Trial Ends: Oct 2025</div>
        <div className="flex items-center gap-2"><CreditCard size={16}/> Price: $49/mo</div>
      </div>
      <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl font-bold">Manage on Stripe</button>
    </div>
  </div>
);
