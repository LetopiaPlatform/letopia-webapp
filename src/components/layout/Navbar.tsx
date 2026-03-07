import { useState } from 'react';
import { NAV_LINKS } from '@/lib/constants';
import { Logo } from '../shared/Logo';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '../ui/button';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link
            to="/login"
            className="text-body font-semibold text-foreground hover:text-foreground/80 transition-colors"
          >
            Sign In
          </Link>
          <Button asChild className="rounded-xl bg-brand-500 px-6 hover:bg-brand-600">
            <Link to="/register">Register</Link>
          </Button>
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
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-center text-body font-semibold text-foreground hover:bg-accent transition-colors"
            >
              Sign In
            </Link>
            <Button asChild className="rounded-xl bg-brand-500 hover:bg-brand-600">
              <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                Register
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
