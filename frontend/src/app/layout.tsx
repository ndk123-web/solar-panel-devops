import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar Plant Maintenance Portal | CI/CD DevOps MVP',
  description: 'Real-time Solar Plant Asset Maintenance Portal built with Spring Boot, Next.js, and SQLite for Jenkins CI/CD Tomcat deployment pipeline.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
