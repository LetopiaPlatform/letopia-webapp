import { useState } from 'react';
import { NAV_LINKS } from '@/lib/constants';
import { Logo } from '../shared/Logo';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthContext();

  return (
    <header className="bg-[#FDFDFD] border-b border-border">
      <nav className="mx-auto flex h-24.5 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Logo className="h-14.5 w-auto" />

        {/* Desktop nav links */}
        <ul className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  `text-body font-semibold transition-colors ${
                    isActive ? 'text-foreground' : 'text-[#6E6A7C] hover:text-foreground'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop auth actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-body font-semibold text-foreground">{user?.fullName}</span>
              <Button variant="outline" className="rounded-xl" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-body font-semibold text-foreground hover:text-foreground/80 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-[#834496] hover:bg-[#6f3a80] px-6 h-11 text-body font-semibold text-[#EEE9FF] transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-[#FDFDFD] px-6 pb-4">
          <ul className="flex flex-col gap-2 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-body font-semibold transition-colors ${
                      isActive
                        ? 'text-foreground bg-accent'
                        : 'text-[#6E6A7C] hover:text-foreground hover:bg-accent'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            {isAuthenticated ? (
              <>
                <span className="px-3 py-2 text-body font-semibold text-foreground">
                  {user?.fullName}
                </span>
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg px-3 py-2 text-center text-body font-semibold text-foreground hover:bg-accent transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-[#834496] hover:bg-[#6f3a80] px-6 h-11 text-body font-semibold text-[#EEE9FF] transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
