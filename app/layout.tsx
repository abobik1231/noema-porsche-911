import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "NOEMA | Porsche 911 в деталях",
  description: "Porsche 911 Targa 4S в 3D. Рассмотрите кузов, интерьер и колёса, исследуйте авторский концепт двигателя F6 Boxer.",
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru"><body>{children}</body></html>;
}
