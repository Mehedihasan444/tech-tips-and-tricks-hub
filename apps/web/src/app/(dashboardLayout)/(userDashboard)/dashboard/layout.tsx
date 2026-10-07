import type { Metadata } from "next";
import { UserLayout } from "./layout/userLayout";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Create, manage and track your posts, drafts, analytics and payments.",
  robots: { index: false, follow: false },
};

export default function UserDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <UserLayout>{children}</UserLayout>
    </div>
  );
}
