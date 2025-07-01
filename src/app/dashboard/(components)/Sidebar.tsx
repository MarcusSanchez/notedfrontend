"use client";

import React, { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Stethoscope,
  Home,
  Clipboard as ClipboardPen,
  Users,
  Bed,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUserStore } from "@/lib/state";
import { Role } from "@/proto/user_pb";

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
  active?: boolean;
}

interface DashboardNavigatorProps {
  children: ReactNode;
}

export const DashboardNavigator = ({ children }: DashboardNavigatorProps) => {
  const { user } = useUserStore();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const path = usePathname();

  const navItems: NavItem[] = [
    { title: 'Home', icon: Home, href: '/dashboard', active: path == "/dashboard" },
    { title: 'Notes', icon: ClipboardPen, href: '/dashboard/notes', active: path == "/dashboard/notes" },
    { title: 'Nurses', icon: Users, href: '/dashboard/nurses', active: path == "/dashboard/nurses" },
    { title: 'Patients', icon: Bed, href: '/dashboard/patients', active: path == "/dashboard/patients" },
    { title: 'Settings', icon: Settings, href: '/dashboard/settings', active: path == "/dashboard/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Noted</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="hover:bg-blue-50"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/20 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-72 bg-white/95 backdrop-blur-md shadow-2xl border-r border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Noted</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
                className="hover:bg-blue-50"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            <nav className="p-6 space-y-2">
              {navItems.map((item) => (
                <NavItem setIsMobileMenuOpen={setIsMobileMenuOpen} key={item.title} item={item} isCollapsed={false} />
              ))}
            </nav>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        <div className={`hidden lg:flex flex-col bg-white/80 backdrop-blur-md border-r border-gray-200 shadow-lg transition-all duration-300 ${
          isCollapsed ? '' : 'w-72'
        }`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {!isCollapsed && (
              <Link href="/">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                    <Stethoscope className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Noted</span>
                </div>
              </Link>
            )}
            {isCollapsed && (
              <Link href="/">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg mx-auto">
                  <Stethoscope className="w-7 h-7 text-white" />
                </div>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="ml-auto hover:bg-blue-50"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.title} item={item} isCollapsed={isCollapsed} />
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="p-6 border-t border-gray-200">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-sm font-semibold">{user.name.split(' ').map(n => n[0]).join('')}</span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.role === Role.Admin ? "Administrator" : "Nurse"}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-h-screen overflow-auto">
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  item: NavItem;
  isCollapsed: boolean;
  setIsMobileMenuOpen?: (open: boolean) => void;
}

const NavItem = ({ item, isCollapsed, setIsMobileMenuOpen }: NavItemProps) => {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
      className={`w-full flex items-center ${
        isCollapsed ? 'justify-center px-3' : 'space-x-3 px-4'
      } py-3 rounded-xl text-left transition-all duration-200 group ${
        item.active
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
      }`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 ${item.active ? 'text-white' : 'group-hover:text-blue-600'}`} />
      {!isCollapsed && (
        <span className={`font-medium ${item.active ? 'text-white' : 'group-hover:text-blue-600'}`}>
            {item.title}
          </span>
      )}
    </Link>
  );
};