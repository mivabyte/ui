import type { Metadata } from "next"
import type { ReactNode } from "react"

import "@mivama-digital/ui/styles.css"

export const metadata: Metadata = {
  title: "Mivabyte UI Next App Router fixture",
  description: "Packed-package App Router compatibility fixture",
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
