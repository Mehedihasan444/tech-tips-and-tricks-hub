

import { Metadata } from "next";
import NavigationBar from "./components/shared/NavigationBar";
import Sidebar from "./components/Sidebar";


export const metadata: Metadata = {
  title: "Tech Tips And Tricks Hub",
  description: "",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (

    <div className="flex  w-full">
      <Sidebar />
      <div className="w-full">
        <NavigationBar />
        <div className="w-full">

          {children}
        </div>
      </div>


    </div>
  );
}
