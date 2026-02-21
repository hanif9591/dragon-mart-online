import "./globals.css";

export const metadata = {
  title: "Dragon Mart Online",
  description: "Dragon Mart Online marketplace",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

