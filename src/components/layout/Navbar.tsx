import { useRef, useState } from 'react';
import { NAV_LINKS, NAV_ICONS } from '@/lib/constants';
import { Logo } from '../shared/Logo';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X as XIcon, User, LogOut } from 'lucide-react';
import { useAuthContext } from '@/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const SEARCH_FILTERS = ['Communities', 'Projects', 'Members'] as const;
type SearchFilter = (typeof SEARCH_FILTERS)[number];

// Placeholder mock results — replace with real API later
const MOCK_RESULTS: Record<SearchFilter, string[]> = {
  Communities: ['UI/UX Design', 'Graphic Design', 'Designers'],
  Projects: ['Portfolio Website', 'E-commerce App', 'Design System'],
  Members: ['Mohamed Raafat', 'Ahmed Ali', 'Sara Hassan'],
};

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<SearchFilter | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <header>
      {/* ── nav container — h-[72px], px-[83px] on desktop ── */}
      <nav className="mx-auto flex h-18 max-w-360 items-center justify-between bg-white/90 px-6 backdrop-blur-md lg:px-10 xl:px-20.75">
        {/* ── Left: Logo + Search bar (search only when logged in) ── */}
        <div className="flex items-center gap-6">
          <Logo className="w-25 shrink-0" />

          {/* Search bar — only when authenticated, desktop only */}
          {isAuthenticated && (
            <div className="hidden lg:block relative">
              <div
                className={`flex lg:w-60 xl:w-101.5 items-center rounded-xl border bg-white p-4 transition-colors overflow-hidden ${
                  isSearchFocused ? 'border-[#824892]' : 'border-[#DBD5DE]'
                }`}
              >
                <div className="flex flex-1 items-center gap-2">
                  <img
                    src={NAV_ICONS.SEARCH}
                    alt=""
                    aria-hidden="true"
                    className={`size-6 transition-all ${
                      isSearchFocused || activeFilter
                        ? 'brightness-0 invert-28 sepia-60 saturate-700 hue-rotate-260'
                        : ''
                    }`}
                  />

                  {/* Selected filter chip */}

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    placeholder={
                      activeFilter
                        ? `Search ${activeFilter}...`
                        : 'Search for Communities, Projects...'
                    }
                    className="min-w-0 flex-1 bg-transparent text-sm font-normal text-[#24252c] placeholder:text-[#DBD5DE] outline-none truncate"
                  />

                  {activeFilter && (
                    <button
                      type="button"
                      onClick={() => setActiveFilter(null)}
                      className="flex items-center gap-1 rounded-[14px] border border-[#824892] px-2 py-1 text-xs text-[#824892] shrink-0"
                    >
                      <XIcon className="size-3.5" />
                      <span className="hidden xl:inline">{activeFilter}</span>
                    </button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="outline-none shrink-0">
                        <img
                          src={NAV_ICONS.FILTER}
                          alt="Filter"
                          className="size-6 cursor-pointer"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={24}
                      className="rounded-[14px] border border-[#a39ba6] bg-white p-4 gap-4 min-w-35"
                    >
                      {SEARCH_FILTERS.map((filter) => (
                        <DropdownMenuItem
                          key={filter}
                          onClick={() => {
                            setActiveFilter(filter);
                            searchInputRef.current?.focus();
                          }}
                          className="cursor-pointer text-sm text-[#24252c] px-0 py-0 hover:text-[#824892] focus:text-[#824892] hover:bg-transparent focus:bg-transparent"
                        >
                          {filter}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Search results dropdown */}
              {isSearchFocused && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 mt-2 lg:w-60 xl:w-101.5 rounded-[14px] border border-[#DBD5DE] bg-white p-4 shadow-sm z-50">
                  <div className="flex flex-col gap-4">
                    {(activeFilter
                      ? MOCK_RESULTS[activeFilter]
                      : Object.values(MOCK_RESULTS).flat()
                    )
                      .filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 5)
                      .map((result) => (
                        <button
                          key={result}
                          type="button"
                          className="text-left text-sm text-[#24252c] hover:text-black transition-colors"
                          onClick={() => {
                            setSearchQuery(result);
                            setIsSearchFocused(false);
                          }}
                        >
                          {result}
                        </button>
                      ))}
                    {(activeFilter
                      ? MOCK_RESULTS[activeFilter]
                      : Object.values(MOCK_RESULTS).flat()
                    ).filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
                      .length === 0 && <p className="text-sm text-[#DBD5DE]">No results found</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* ── Desktop nav links — gap-10 (40px), icons when logged in ── */}
        <ul className="hidden lg:flex items-center lg:gap-6 xl:gap-10 shrink-0">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-base font-medium transition-colors ${
                    isActive ? 'font-semibold text-black' : 'text-[#24252C] hover:text-black'
                  }`
                }
              >
                <img src={link.icon} alt="" aria-hidden="true" className="size-5" />
                <span>{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
        {/* ── Right side: Auth actions ── */}
        <div className="hidden lg:flex items-center shrink-0">
          {isAuthenticated ? (
            /* Avatar dropdown — unchanged */
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="size-12">
                    <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                    <AvatarFallback className="bg-[#834496] text-white text-caption font-semibold">
                      {user?.fullName
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-body font-semibold">
                  {user?.fullName}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="size-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Single "Log in" button — w-[146px] h-[50px] rounded-[14px] bg-[#824892] */
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-36.5 h-12.5 rounded-[14px] bg-[#824892] hover:bg-[#6f3a80] text-lg font-medium text-[#FDFDFD] transition-colors"
            >
              Log in
            </Link>
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
          {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-[#FDFDFD] px-6 pb-4">
          {/* Mobile search — only when logged in */}
          {isAuthenticated && (
            <div className="relative my-3">
              <div
                className={`flex items-center rounded-[14px] border bg-white p-4 transition-colors ${
                  isSearchFocused ? 'border-[#824892]' : 'border-[#DBD5DE]'
                }`}
              >
                <div className="flex flex-1 items-center gap-2">
                  <img
                    src={NAV_ICONS.SEARCH}
                    alt=""
                    aria-hidden="true"
                    className={`size-6 transition-all ${
                      isSearchFocused || activeFilter
                        ? 'brightness-0 invert-28 sepia-60 saturate-700 hue-rotate-260'
                        : ''
                    }`}
                  />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                    placeholder={
                      activeFilter
                        ? `Search ${activeFilter}...`
                        : 'Search for Communities, Projects...'
                    }
                    className="flex-1 bg-transparent text-sm font-normal text-[#24252c] placeholder:text-[#DBD5DE] outline-none"
                  />

                  {activeFilter && (
                    <button
                      type="button"
                      onClick={() => setActiveFilter(null)}
                      className="flex items-center gap-1 rounded-[14px] border border-[#824892] px-2 py-1 text-xs text-[#824892] shrink-0"
                    >
                      <XIcon className="size-3.5" />
                      <span>{activeFilter}</span>
                    </button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button type="button" className="outline-none shrink-0">
                        <img
                          src={NAV_ICONS.FILTER}
                          alt="Filter"
                          className="size-6 cursor-pointer"
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      sideOffset={24}
                      className="rounded-[14px] border border-[#a39ba6] bg-white p-4 gap-4 min-w-35"
                    >
                      {SEARCH_FILTERS.map((filter) => (
                        <DropdownMenuItem
                          key={filter}
                          onClick={() => setActiveFilter(filter)}
                          className="cursor-pointer text-sm text-[#24252c] px-0 py-0 hover:text-[#824892] focus:text-[#824892] hover:bg-transparent focus:bg-transparent"
                        >
                          {filter}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {isSearchFocused && searchQuery.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-[14px] border border-[#DBD5DE] bg-white p-4 shadow-sm z-50">
                  <div className="flex flex-col gap-4">
                    {(activeFilter
                      ? MOCK_RESULTS[activeFilter]
                      : Object.values(MOCK_RESULTS).flat()
                    )
                      .filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
                      .slice(0, 5)
                      .map((result) => (
                        <button
                          key={result}
                          type="button"
                          className="text-left text-sm text-[#24252c] hover:text-black transition-colors"
                          onClick={() => {
                            setSearchQuery(result);
                            setIsSearchFocused(false);
                          }}
                        >
                          {result}
                        </button>
                      ))}
                    {(activeFilter
                      ? MOCK_RESULTS[activeFilter]
                      : Object.values(MOCK_RESULTS).flat()
                    ).filter((item) => item.toLowerCase().includes(searchQuery.toLowerCase()))
                      .length === 0 && <p className="text-sm text-[#DBD5DE]">No results found</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mobile nav links — always show icons */}
          <ul className="flex flex-col gap-2 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-body font-semibold transition-colors ${
                      isActive
                        ? 'text-black bg-accent'
                        : 'text-[#24252c] hover:text-black hover:bg-accent'
                    }`
                  }
                >
                  <img src={link.icon} alt="" aria-hidden="true" className="size-5" />
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Mobile auth section */}
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar size="sm">
                    <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
                    <AvatarFallback className="bg-[#834496] text-white text-[10px] font-semibold">
                      {user?.fullName
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-body font-semibold text-foreground">{user?.fullName}</span>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-body font-semibold text-[#24252c] hover:text-black hover:bg-accent transition-colors"
                >
                  <User className="size-4" />
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-body font-semibold text-destructive hover:bg-accent transition-colors cursor-pointer"
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
            ) : (
              /* Single "Log in" button for mobile too */
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center rounded-[14px] bg-[#824892] hover:bg-[#6f3a80] h-12.5 text-lg font-medium text-[#FDFDFD] transition-colors"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
