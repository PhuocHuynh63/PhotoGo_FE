import AdminLayoutClient from '@components/Templates/AdminLayout'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <AdminLayoutClient>
    {children}
    </AdminLayoutClient>
  )
}
