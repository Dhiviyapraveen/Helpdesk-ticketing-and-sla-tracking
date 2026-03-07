import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, Users, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

const AppSidebar = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const location = useLocation();
  const { user } = useAuth();

  /* ✅ ROLE BASED NAVIGATION */
  let navItems = [];

  if (user?.role === "admin") {

    navItems = [
      { to: '/admin-dashboard', icon: LayoutDashboard, label: 'Admin Dashboard' },
      { to: '/tickets', icon: Ticket, label: 'All Tickets' },
      { to: '/admin', icon: Users, label: 'User Management' },
    ];

  } 
  else if (user?.role === "agent") {

    navItems = [
      { to: '/tickets', icon: Ticket, label: 'Assigned Tickets' },
    ];

  } 
  else {

    navItems = [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/tickets', icon: Ticket, label: 'My Tickets' },
    ];

  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">

      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-bold text-primary-foreground text-sm">
          HD
        </div>

        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-semibold text-sidebar-foreground"
          >
            HelpDesk
          </motion.span>
        )}

      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">

        {navItems.map((item) => {

          const isActive = location.pathname === item.to;

          return (
            <RouterNavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >

              <item.icon className="h-4.5 w-4.5 shrink-0" />

              {!collapsed && <span>{item.label}</span>}

            </RouterNavLink>
          );

        })}

      </nav>

      {/* User Info */}
      {!collapsed && user && (

        <div className="border-t border-sidebar-border p-4">

          <div className="flex items-center gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {user.name}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user.role}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );

  return (

    <>
      {/* Mobile Trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-xl bg-card p-2 shadow-md lg:hidden"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>

        {mobileOpen && (
          <>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-[260px] border-r border-sidebar-border bg-sidebar lg:hidden"
            >

              <button
                onClick={() => setMobileOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>

              <SidebarContent />

            </motion.aside>

          </>
        )}

      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
          collapsed ? 'w-[68px]' : 'w-[240px]'
        }`}
      >

        <SidebarContent />

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="m-3 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Menu className="h-4 w-4" />
        </button>

      </aside>

    </>
  );
};

export default AppSidebar;