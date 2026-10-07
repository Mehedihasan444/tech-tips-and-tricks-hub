import type { Metadata } from "next";
import { AdminLayout } from "./layout/adminLayout";
export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Moderate users, posts, reports and platform activity.",
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <AdminLayout>{children}</AdminLayout>
    </div>
  );
}
