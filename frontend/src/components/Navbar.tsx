import { LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card/60 backdrop-blur-md px-6">
      <div className="pl-12 lg:pl-0">
        <h2 className="text-sm font-semibold text-foreground">
          {user ? `Hello, ${user.name}` : 'HelpDesk'}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setDark(!dark)}
          className="btn-ghost p-2"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        {user && (
          <button onClick={logout} className="btn-ghost flex items-center gap-2 text-sm">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
