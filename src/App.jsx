import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { id: 1, label: 'Action', to: '/action' },
  { id: 2, label: 'Comedy', to: '/comedy' },
  { id: 3, label: 'Drama', to: '/drama' },
  { id: 4, label: 'Horror', to: '/horror' },
  { id: 5, label: 'Sci-Fi', to: '/sci-fi' },
  { id: 6, label: 'Romance', to: '/romance' },
  { id: 7, label: 'Thriller', to: '/thriller' },
  { id: 8, label: 'Animation', to: '/animation' }
];

const moreGenres = [
  { id: 1, label: 'Fantasy', to: '/fantasy' },
  { id: 2, label: 'Mystery', to: '/mystery' },
  { id: 3, label: 'Documentary', to: '/documentary' },
  { id: 4, label: 'Crime', to: '/crime' }
];

function MoreDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-2 rounded-sm text-[13px] tracking-[0.08em] font-medium border border-[#C9A24B]/40 text-[#EFE7D6]/85 bg-[#1B1518]/60 backdrop-blur-sm hover:border-[#C9A24B] hover:text-[#C9A24B] transition-colors duration-300"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        More
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 min-w-[160px] bg-[#150F12] rounded-sm shadow-[0_12px_30px_rgba(0,0,0,0.5)] border border-[#C9A24B]/25 overflow-hidden z-10">
          {moreGenres.map((genre) => (
            <NavLink
              key={genre.id}
              to={genre.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `block px-5 py-3 text-[15px] border-l-2 transition-colors duration-200 ${isActive
                  ? 'border-l-[#C9A24B] text-[#C9A24B] bg-[#C9A24B]/5'
                  : 'border-l-transparent text-[#EFE7D6]/75 hover:border-l-[#C9A24B]/50 hover:text-[#C9A24B] hover:bg-white/[0.02]'
                }`
              }
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {genre.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@400;500&display=swap');
      `}</style>

      <div className="bg-[#0A0708] w-screen h-screen p-10">
        <div
          className="relative w-full h-full rounded-2xl shadow-md bg-cover bg-center overflow-hidden"
          style={{ backgroundImage: `url('/bg/b04.jpeg')` }}
        >
          {/* dark vignette so content stays legible over the photo */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/60 to-black/80" />

          {/* layout container  */}
          <div className="relative bg-[#120D0F]/70 backdrop-blur-md w-full h-full rounded-2xl border border-[#C9A24B]/20 p-5">
            {/* nav  */}
            <div className="w-full h-[10%] flex items-center border-b border-[#C9A24B]/15">
              {/* brand + search box */}
              <div className="w-[20%] h-full flex items-center gap-4 px-5">
                <span
                  className="text-[17px] text-[#C9A24B] tracking-[0.03em] shrink-0"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  Reelhouse
                </span>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 rounded-sm text-sm outline-none border border-[#C9A24B]/25 bg-[#1B1518]/60 text-[#EFE7D6] placeholder-[#EFE7D6]/40 focus:border-[#C9A24B] transition-colors duration-200"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A24B]/60"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                    />
                  </svg>
                </div>
              </div>

              {/* list */}
              <div className="w-[60%] h-full flex items-center justify-end gap-6 px-2">
                {/* nav links */}
                <nav className="flex items-center gap-7">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.id}
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `relative pb-1 text-[16px] tracking-[0.01em] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-px after:bg-[#C9A24B] after:transition-all after:duration-300 ${isActive
                          ? 'text-[#C9A24B] after:w-full'
                          : 'text-[#EFE7D6]/75 hover:text-[#C9A24B] after:w-0 hover:after:w-full'
                        }`
                      }
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </nav>

                {/* Item 5 — custom dropdown */}
                <MoreDropdown />
              </div>

              {/* notification and profile */}
              <div className="w-[20%] h-full flex items-center justify-end gap-4 px-5">
                {/* Notification bell */}
                <button className="relative p-2 rounded-full border border-[#C9A24B]/25 bg-[#1B1518]/60 hover:border-[#C9A24B] transition-colors duration-200">
                  <svg
                    className="w-5 h-5 text-[#EFE7D6]/80"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#8C2A2A] border border-[#150F12]" />
                </button>

                {/* Profile */}
                <button className="flex items-center gap-2 pl-1 pr-4 py-1 rounded-full border border-[#C9A24B]/25 bg-[#1B1518]/60 hover:border-[#C9A24B] transition-colors duration-200">
                  <img
                    src="/profile.jpg"
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border border-[#C9A24B]/40"
                  />
                  <span
                    className="text-[15px] text-[#EFE7D6]/90"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    John Doe
                  </span>
                </button>
              </div>
            </div>

            {/* outlet  */}
            <div
              className="rounded-sm border border-[#C9A24B]/15 w-full h-[90%] flex justify-center items-center text-[#EFE7D6]/50 text-[15px]"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              outlet
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App