import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useTheme, ThemeToggle } from './theme/ThemeContext';
import { serif, sans } from './theme/Themes';

const navItems = [
  { id: 1, label: 'Action', to: '/action' },
  { id: 2, label: 'Comedy', to: '/comedy' },
  { id: 3, label: 'Drama', to: '/drama' },
  { id: 4, label: 'Horror', to: '/horror' },
  { id: 5, label: 'Sci-Fi', to: '/sci-fi' },
  { id: 6, label: 'Thriller', to: '/thriller' },
];

const moreGenres = [
  { id: 1, label: 'Romance', to: '/romance' },
  { id: 2, label: 'Animation', to: '/animation' },
  { id: 3, label: 'Fantasy', to: '/fantasy' },
  { id: 4, label: 'Mystery', to: '/mystery' },
  { id: 5, label: 'Documentary', to: '/documentary' },
  { id: 6, label: 'Crime', to: '/crime' },
];

/* ------------------------------------------------------------------ */
/*  More dropdown — closes on outside click                            */
/* ------------------------------------------------------------------ */

function MoreDropdown() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-sm text-[13px] tracking-[0.08em] font-medium transition-colors duration-300"
        style={{ fontFamily: sans, border: `1px solid ${theme.border}`, color: theme.textDim, background: theme.inputBg }}
      >
        More
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={13} strokeWidth={2} />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute top-full right-0 mt-2 min-w-44 rounded-sm overflow-hidden z-20"
            style={{ background: theme.panelSolid, border: `1px solid ${theme.border}`, boxShadow: '0 16px 34px rgba(0,0,0,0.35)' }}
          >
            {moreGenres.map((genre) => (
              <NavLink
                key={genre.id}
                to={genre.to}
                onClick={() => setIsOpen(false)}
                className="block px-5 py-2.5 text-[16px] border-l-2 transition-colors duration-200"
                style={({ isActive }) => ({
                  fontFamily: serif,
                  borderLeftColor: isActive ? theme.accent : 'transparent',
                  color: isActive ? theme.accent : theme.textDim,
                  background: isActive ? theme.accentSoft : 'transparent',
                })}
              >
                {genre.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                 */
/* ------------------------------------------------------------------ */

function App() {
  const { theme } = useTheme();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Inter:wght@400;500;600&display=swap');
      `}</style>

      <div
        className="w-screen h-screen p-10 transition-colors duration-500"
        style={{ background: theme.bg }}
      >
        <div
          className="relative w-full h-full rounded-2xl shadow-md bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url('/bg/b04.jpeg')` }}
        >
          {/* theme-aware vignette so content stays legible over the photo */}
          <div className="absolute inset-0 transition-[background] duration-500" style={{ background: theme.overlay }} />

          {/* layout container */}
          <div
            className="relative backdrop-blur-md w-full h-full rounded-2xl p-5 flex flex-col transition-colors duration-500"
            style={{ background: theme.panel, border: `1px solid ${theme.border}` }}
          >
            {/* nav */}
            <div
              className="w-full shrink-0 h-20 flex items-center justify-between gap-6 border-b px-2 transition-colors duration-500"
              style={{ borderColor: theme.border }}
            >
              {/* brand + search */}
              <div className="flex items-center gap-5 flex-1 min-w-0 px-3">
                <span
                  className="text-[19px] tracking-[0.02em] shrink-0 italic transition-colors duration-500"
                  style={{ fontFamily: serif, color: theme.accent }}
                >
                  MovieDetails
                </span>
                <div className="relative w-full max-w-72 hidden md:block">
                  <input
                    type="text"
                    placeholder="Search…"
                    className="w-full pl-10 pr-4 py-2 rounded-sm text-sm outline-none transition-colors duration-300"
                    style={{
                      fontFamily: sans,
                      border: `1px solid ${theme.border}`,
                      background: theme.inputBg,
                      color: theme.text,
                    }}
                  />
                  <Search
                    size={15}
                    strokeWidth={1.5}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: theme.textFaint }}
                  />
                </div>
              </div>

              {/* nav links */}
              <nav className="hidden lg:flex items-center gap-7 shrink-0">
                {navItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.to}
                    className="relative pb-1 text-[16px] tracking-[0.01em] transition-colors duration-300"
                    style={({ isActive }) => ({ fontFamily: serif, color: isActive ? theme.accent : theme.textDim })}
                  >
                    {({ isActive }) => (
                      <>
                        {item.label}
                        <span
                          className="absolute left-0 -bottom-0.5 h-px transition-all duration-300"
                          style={{ width: isActive ? '100%' : '0%', background: theme.accent }}
                        />
                      </>
                    )}
                  </NavLink>
                ))}
                <MoreDropdown />
              </nav>

              {/* actions */}
              <div className="flex items-center gap-3 shrink-0 px-3">
                <ThemeToggle />

                <button
                  aria-label="Notifications"
                  className="relative p-2 rounded-full transition-colors duration-300"
                  style={{ border: `1px solid ${theme.border}`, background: theme.inputBg }}
                >
                  <Bell size={16} strokeWidth={1.5} style={{ color: theme.textDim }} />
                  <span
                    className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                    style={{ background: theme.accent }}
                  />
                </button>

                <button
                  aria-label="Profile"
                  className="p-0.5 rounded-full transition-colors duration-300"
                  style={{ border: `1px solid ${theme.border}` }}
                >
                  <img src="./bg/b03.jpeg" alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                </button>
              </div>
            </div>

            {/* outlet */}
            <div
              className="rounded-sm w-full flex-1 min-h-0 flex justify-center items-center text-[15px] mt-5 transition-colors duration-500"
              style={{ fontFamily: serif, border: `0px solid ${theme.border}`, color: theme.outletText }}
            >
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;