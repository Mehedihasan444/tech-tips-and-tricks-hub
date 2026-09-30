import type { Metadata } from "next";
import { AdminLayout } from "./layout/adminLayout";
export const metadata: Metadata = {
  title: "Dashboard - Tech Tips and Tricks",
  description: "Next Level Riding Sharing Service",
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
     <AdminLayout>
      {children}
     </AdminLayout>
    </div>
  );
}