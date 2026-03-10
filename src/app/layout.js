export const metadata = {
  title: "NEHOMARR — Treatment Studio",
  description: "Complete creative system by BeDangerous / Facilitators",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
