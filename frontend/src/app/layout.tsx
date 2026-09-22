import React from 'react';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export const metadata = {
  title: 'Nova5 AI CRM - Intelligent Customer Operating System',
  description: 'Enterprise AI-native CRM platform for omnichannel conversations, lead scoring, and sales intelligence.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="light">
      <body className="bg-slate-50 text-slate-900 flex min-h-screen font-sans antialiased selection:bg-brand-500/20 selection:text-brand-700">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
          <Header />
          <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
