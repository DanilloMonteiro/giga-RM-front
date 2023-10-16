import { TesteProvider } from '../../../context/TesteContext'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TesteProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </TesteProvider>
  )
}
