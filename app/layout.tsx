import "./globals.css";
export const metadata = {
  title: "OBGYN",
  description: "My App Description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    
    <html lang="en">
      <body style={{ background: 'linear-gradient(160deg, #fdf6f0 0%, #fef0f5 40%, #f5f0fe 100%)' }}>{children}</body>
    </html>
  );
}
