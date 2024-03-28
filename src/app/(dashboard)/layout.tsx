import "@app/utils/globals.css";

export const metadata = {
  title: "gringott",
};

export default function Layout({ children }) {
  return (
    <html lang="pl">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
