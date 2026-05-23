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
      <body style={{ background: 'linear-gradient(...)' }} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
