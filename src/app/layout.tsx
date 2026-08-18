import type { Metadata } from 'next';
import './globals.css';
import { GuardProvider } from '@/context/GuardContext';
import { Navbar } from '@/components/layout/Navbar';

export const metadata: Metadata = {
  title: 'GuardAgent – Parameter-Efficient Runtime Safety for Tool-Using LLMs',
  description:
    'A low-latency runtime safety interception proxy and adaptive Human-in-the-Loop oversight platform for autonomous tool-using AI agents. PES University PI Labs research.',
  keywords: [
    'GuardAgent',
    'AI Safety',
    'Tool Use Safety',
    'Human in the Loop',
    'Prompt Injection',
    'Next.js',
    'TypeScript',
    'LLM Security',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-black">
        <GuardProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
        </GuardProvider>
      </body>
    </html>
  );
}
