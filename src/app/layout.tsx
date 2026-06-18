import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { AIChatWindow } from '@/components/chat/AIChatWindow';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI采购管理系统',
    template: '%s | AI采购管理系统',
  },
  description:
    '基于Hermes Agent的AI驱动采购管理系统，实现从需求到付款的全流程智能化管理。',
  keywords: [
    'AI采购',
    '采购管理',
    'Hermes Agent',
    '智能采购',
    '供应商管理',
    'PO管理',
  ],
  authors: [{ name: 'AI采购系统团队' }],
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="en">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        <AuthProvider>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </AuthProvider>
        <AIChatWindow />
      </body>
    </html>
  );
}
