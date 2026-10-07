import { Metadata } from "next";
import NavigationBar from "./components/shared/NavigationBar";
import Searchbar from "./components/Searchbar";
import Sidebar from "./components/Sidebar";
import Footer from "./components/shared/Footer";

export const metadata: Metadata = {
  // Inherits the "%s · Tech Tips & Tricks Hub" template from the root layout;
  // assigning a bare string here discarded it for every route in this group.
  description:
    "Bite-size tech tips, tutorials, and premium deep-dives from engineers shipping in production.",
};

export default function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full overflow-x-clip">
      <Sidebar />
      <div className="w-full min-w-0 flex flex-col min-h-dvh">
        <NavigationBar />
        {/* Mobile search: the navbar search is hidden below sm */}
        <div className="sm:hidden px-4 py-2 border-b border-divider bg-background/80">
          <Searchbar />
        </div>
        <div className="w-full flex-1">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
