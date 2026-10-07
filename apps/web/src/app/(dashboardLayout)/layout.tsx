import DashboardShell from "./layout/dashboardLayout";

/**
 * Provides the off-canvas sidebar state for every dashboard route.
 * Must stay a Server Component so the page tree below it can still opt into RSC.
 */
export default function DashboardGroupLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <DashboardShell>{children}</DashboardShell>;
}
