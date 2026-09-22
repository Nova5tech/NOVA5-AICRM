'use client';

import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import { Contact } from '@/lib/types';
import { CustomerProfileModal } from '@/components/crm/CustomerProfileModal';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    api.getContacts().then(setContacts).catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-fade-in relative z-10">
      <div className="pb-4 border-b border-white/60">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
          <Users className="w-6 h-6 text-purple-600" /> Customer & Contact Intelligence
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-0.5">Complete 360-degree customer profile aggregation across channels.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {contacts.map((c) => (
          <div
            key={c.id}
            onClick={() => setSelectedContact(c)}
            className="p-5 rounded-2xl light-glass-card hover:scale-[1.02] cursor-pointer transition-all duration-75 space-y-4 shadow-sky-glass"
          >
            <div className="flex items-center gap-3.5">
              <img
                src={c.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={c.first_name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-sky-400/40 shadow-sm"
              />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">{c.first_name} {c.last_name}</h3>
                <p className="text-xs text-slate-600 font-medium">{c.title || 'Executive'}</p>
                <p className="text-[11px] text-sky-800 font-extrabold">{c.company?.name || 'Enterprise'}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 font-medium pt-3 border-t border-sky-100">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sky-600" /> {c.email}
              </div>
              {c.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sky-600" /> {c.phone}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <CustomerProfileModal
        contact={selectedContact}
        isOpen={!!selectedContact}
        onClose={() => setSelectedContact(null)}
      />
    </div>
  );
}
