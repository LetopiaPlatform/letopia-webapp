import { useAuthContext } from '@/context/AuthContext';
import { SIDEBAR_ITEMS } from '@/lib/constants';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SidebarContent } from './SidebarContent';
import { useNavigate } from 'react-router-dom';

/* sub-components */
interface IconListProps {
  direction: 'col' | 'row';
  activeId: string | null;
  onItemClick: (id: string) => void;
  small?: boolean;
}

const IconList = ({ direction, activeId, onItemClick, small }: IconListProps) => (
  <div
    className={`flex ${
      direction === 'col'
        ? `flex-col items-center ${small ? 'gap-6' : 'gap-10'}`
        : 'flex-row items-center justify-around flex-1'
    }`}
  >
    {SIDEBAR_ITEMS.map((item) => (
      <button
        key={item.id}
        className="flex items-center justify-center cursor-pointer"
        onClick={() => onItemClick(item.id)}
      >
        <img
          src={activeId === item.id ? item.activeIcon : item.icon}
          alt=""
          className={small ? 'w-5 h-5' : 'w-6 h-6 md:w-auto md:h-auto'}
        />
      </button>
    ))}
  </div>
);

interface AvatarProps {
  isAuthenticated: boolean;
  user: { avatarUrl?: string; fullName?: string } | null;
  small?: boolean;
}

const Avatar = ({ isAuthenticated, user, small }: AvatarProps) => {
  const navigate = useNavigate();

  if (!isAuthenticated || !user) return null;
  const size = small ? 'size-8' : 'size-10 md:size-12';
  return (
    <div
      onClick={() => navigate('/profile')}
      className={`${size} shrink-0 rounded-full p-0.5 bg-linear-to-tl from-primary to-[#4C88C1] cursor-pointer`}
    >
      <div className="size-full shrink-0 overflow-hidden rounded-full flex items-center justify-center">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt=""
            className="size-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span className={`text-white font-agbalumo ${small ? 'text-sm' : 'text-lg'}`}>
            {user.fullName?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};

/* Main component */
export const AppSidebar = () => {
  const { isAuthenticated, user } = useAuthContext();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const handleItemClick = (itemId: string) => {
    if (activeId === itemId && isExpanded) {
      setIsExpanded(false);
      setActiveId(null);
    } else {
      setActiveId(itemId);
      setIsExpanded(true);
    }
  };

  const handleMobileItemClick = (itemId: string) => {
    if (activeId === itemId && mobilePanelOpen) {
      setMobilePanelOpen(false);
      setActiveId('create'); // default to 'create' for next open
    } else {
      setActiveId(itemId);
      setMobilePanelOpen(true);
    }
  };

  const closeDesktopPanel = () => {
    setIsExpanded(false);
    setActiveId(null);
  };

  const closeMobilePanel = () => {
    setMobilePanelOpen(false);
    setActiveId(null);
  };

  return (
    <>
      {/*DESKTOP / TABLET (md+): left icon rail + sliding panel*/}
      <div className="hidden md:flex fixed top-18 left-0 z-50 h-[calc(100vh-4.5rem)] w-16 lg:w-22 bg-white/60 backdrop-blur-xl backdrop-saturate-150 shadow-md flex-col items-center justify-between py-8 px-2 lg:px-4">
        <IconList direction="col" activeId={activeId} onItemClick={handleItemClick} />
        <Avatar isAuthenticated={isAuthenticated} user={user} />
      </div>

      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Desktop Panel */}
            <motion.div
              key="desktop-panel"
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="hidden md:block fixed top-18 left-16 lg:left-22 z-40 h-[calc(100vh-4.5rem)] w-72 lg:w-80 bg-[#F6F5F6] overflow-y-auto scrollbar-hide"
            >
              <SidebarContent activeSection={activeId || 'create'} />
            </motion.div>

            {/* Backdrop */}
            <motion.div
              key="desktop-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDesktopPanel}
              className="hidden md:block fixed inset-0 bg-black/15 z-30 top-18"
            />
          </>
        )}
      </AnimatePresence>

      {/* MOBILE (< md): hamburger trigger + compact sidebar*/}
      {/* Trigger button — top-right, same height as the desktop rail */}
      <button
        onClick={() => {
          setMobilePanelOpen((prev) => {
            if (!prev && activeId === null) setActiveId('create');
            return !prev;
          });
        }}
        className="md:hidden fixed top-[4.9rem] right-7 z-40 size-9 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-md shadow-md"
        aria-label="Open menu"
      >
        <motion.div
          animate={mobilePanelOpen ? 'open' : 'closed'}
          className="flex flex-col gap-1.25 w-4"
        >
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: 45, y: 7 },
            }}
            transition={{ duration: 0.2 }}
            className="block h-0.5 w-full bg-gray-700 rounded-full origin-center"
          />
          <motion.span
            variants={{
              closed: { opacity: 1 },
              open: { opacity: 0 },
            }}
            transition={{ duration: 0.2 }}
            className="block h-0.5 w-full bg-gray-700 rounded-full"
          />
          <motion.span
            variants={{
              closed: { rotate: 0, y: 0 },
              open: { rotate: -45, y: -7 },
            }}
            transition={{ duration: 0.2 }}
            className="block h-0.5 w-full bg-gray-700 rounded-full origin-center"
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {mobilePanelOpen && (
          <>
            {/* Compact icon rail */}
            <motion.div
              key="mobile-rail"
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed top-18 left-0 z-40 h-[calc(100vh-4.5rem)] w-14 bg-white/60 backdrop-blur-xl backdrop-saturate-150 shadow-2xl flex flex-col items-center justify-between py-8 px-2"
            >
              <IconList
                direction="col"
                activeId={activeId}
                onItemClick={handleMobileItemClick}
                small
              />
              <Avatar isAuthenticated={isAuthenticated} user={user} small />
            </motion.div>

            {/* Compact content panel */}
            <motion.div
              key="mobile-panel"
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.04 }}
              className="md:hidden fixed top-18 left-14 z-40 h-[calc(100vh-4.5rem)] w-60 bg-[#F6F5F6] overflow-y-auto scrollbar-hide"
            >
              {/* Smaller text scale wrapper */}
              <div className="text-[0.85rem] [&_h2]:text-base [&_h3]:text-sm [&_span]:text-xs">
                <SidebarContent activeSection={activeId || 'create'} />
              </div>
            </motion.div>

            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobilePanel}
              className="md:hidden fixed inset-0 bg-black/40 z-30 top-18"
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
};
