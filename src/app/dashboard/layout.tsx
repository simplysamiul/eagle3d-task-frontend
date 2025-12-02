"use client";

import { useState, useEffect } from "react";
import { Menu, X, BarChart3, Table, LogOut } from "lucide-react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "../store/slices/authSlice";

const Sidebar = ({ onLogout }: { onLogout: () => void }) => (
  <motion.aside
    initial={{ x: -40, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{
      type: "spring",
      stiffness: 110,
      damping: 14,
    }}
    className="h-full w-64 bg-white/20 backdrop-blur-xl shadow-xl 
               border-r border-white/30 p-6 flex flex-col rounded-r-3xl"
  >
    <h2 className="text-2xl font-bold mb-10 text-white tracking-wide">
      Dashboard
    </h2>

    <nav className="flex flex-col gap-4 text-white font-medium flex-1">
      <Link
        href="/dashboard/analytics"
        className="flex items-center gap-3 p-3 rounded-xl 
                   hover:bg-white/20 transition"
      >
        <BarChart3 size={20} /> Analytics
      </Link>

      <Link
        href="/dashboard/products-list"
        className="flex items-center gap-3 p-3 rounded-xl 
                   hover:bg-white/20 transition"
      >
        <Table size={20} /> Product List
      </Link>
    </nav>

    {/* LOGOUT BUTTON */}
    <button
      onClick={onLogout}
      className="mt-auto flex items-center gap-3 p-3 rounded-xl 
               bg-red-500/80 hover:bg-red-600 transition text-white"
    >
      <LogOut size={20} /> Logout
    </button>
  </motion.aside>
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // AUTO-REDIRECT to analytics page when user enters /dashboard
  useEffect(() => {
    if (pathname === "/dashboard") {
      router.replace("/dashboard/analytics");
    }
  }, [pathname, router]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");

    router.replace("/login");
  };

  return (
    <div
      className="
        min-h-screen w-full 
        bg-gradient-to-br
        from-purple-700 via-fuchsia-600 to-indigo-700 
        p-0
      "
    >
      {/* MOBILE HEADER */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white/10 backdrop-blur-xl shadow-lg">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button>
              <Menu size={30} className="text-white" />
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="p-0 w-64 bg-transparent border-none"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 text-white"
            >
              <X size={26} />
            </button>

            <Sidebar onLogout={handleLogout} />
          </SheetContent>
        </Sheet>

        <h1 className="text-xl font-bold text-white">Dashboard</h1>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex w-full">

        {/* DESKTOP SIDEBAR */}
        <div className="hidden lg:block">
          <Sidebar onLogout={handleLogout} />
        </div>

        {/* MAIN CONTENT WRAPPER */}
        <main
          className="
            flex-1 
            bg-white rounded-tl-3xl rounded-bl-3xl shadow-2xl 
            p-6 lg:p-8 min-h-screen overflow-x-hidden
          "
        >
          {children}
        </main>
      </div>
    </div>
  );
}
