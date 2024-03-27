export const metadata = {
  title: "gringott",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
