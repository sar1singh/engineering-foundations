import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'EPAM B1 Software Architect Accelerator | Cox Automotive & AWS Edition',
  description: 'Full-session preparation accelerator for EPAM B1 Software Architect assessment: 38 competencies, 30 distributed systems flashcards, Cox Automotive SAD defense, and live HLD simulator.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <Navbar />
        <main className="flex-1 max-w-[1750px] mx-auto w-full px-4 sm:px-8 lg:px-12 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
