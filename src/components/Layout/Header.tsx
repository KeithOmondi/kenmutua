import { useState, useEffect } from "react"

const NAV_LINKS = [
  { label: "My Story", href: "#story" },
  { label: "Services", href: "#services" },
  { label: "Coverage", href: "#coverage" },
  { label: "Contact", href: "#contact" },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600&display=swap');

        :root {
          --earth:  #2C1A0E;
          --clay:   #7A4A2E;
          --dust:   #C48C5C;
          --gold:   #D4A843;
          --straw:  #F2DBA8;
          --cream:  #FAF5EC;
          --sky:    #3E6B4E;
          --leaf:   #5A8F62;
          --white:  #FFFDF8;
          --nav-h:  68px;
        }

        /* ── Base reset scoped to header ── */
        .km-header *, .km-header *::before, .km-header *::after {
          box-sizing: border-box; margin: 0; padding: 0;
        }
        .km-header a { text-decoration: none; }
        .km-header button { cursor: pointer; border: none; background: none; font-family: inherit; }
        .km-header ul { list-style: none; }

        /* ── Outer shell ── */
        .km-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 999;
          height: var(--nav-h);
          font-family: 'Outfit', sans-serif;
          transition: background 0.35s, box-shadow 0.35s;
        }
        .km-header.scrolled {
          background: rgba(250,245,236,0.95);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 1px 0 rgba(122,74,46,0.12), 0 4px 24px rgba(44,26,14,0.06);
        }
        .km-header.top {
          background: rgba(250,245,236,0.6);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
        }

        /* ── Inner bar ── */
        .km-nav-bar {
          max-width: 1280px; margin: 0 auto;
          height: 100%;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 5%;
        }

        /* ── Logo ── */
        .km-logo {
          display: flex; flex-direction: column; line-height: 1;
          gap: 1px;
        }
        .km-logo-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem; font-weight: 700;
          color: var(--earth); letter-spacing: 0.01em;
        }
        .km-logo-name span { color: var(--sky); }
        .km-logo-sub {
          font-size: 0.62rem; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--dust);
        }

        /* ── Desktop nav links ── */
        .km-links {
          display: flex; align-items: center; gap: 2.4rem;
        }
        .km-link {
          font-size: 0.78rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--clay);
          position: relative; padding-bottom: 2px;
          transition: color 0.2s;
        }
        .km-link::after {
          content: '';
          position: absolute; bottom: -2px; left: 0; right: 0;
          height: 1.5px; background: var(--sky);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.25s ease;
        }
        .km-link:hover { color: var(--sky); }
        .km-link:hover::after { transform: scaleX(1); }

        /* ── CTA button ── */
        .km-cta {
          font-family: 'Outfit', sans-serif;
          font-size: 0.78rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: white; background: var(--sky);
          padding: 0.55rem 1.4rem;
          transition: background 0.2s, transform 0.15s;
        }
        .km-cta:hover {
          background: var(--earth);
          transform: translateY(-1px);
        }
        .km-cta:active { transform: translateY(0); }

        /* ── Desktop right cluster ── */
        .km-right {
          display: flex; align-items: center; gap: 1.4rem;
        }

        /* ── Hamburger ── */
        .km-burger {
          display: none;
          flex-direction: column; justify-content: center;
          gap: 5px; width: 32px; height: 32px; padding: 2px;
        }
        .km-burger-line {
          display: block; width: 100%; height: 1.5px;
          background: var(--earth);
          transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
          transform-origin: center;
        }
        .km-burger.open .km-burger-line:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
        .km-burger.open .km-burger-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .km-burger.open .km-burger-line:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

        /* ── Mobile drawer ── */
        .km-drawer {
          position: fixed; inset: 0; z-index: 998;
          pointer-events: none;
        }
        .km-drawer.open { pointer-events: all; }

        .km-drawer-overlay {
          position: absolute; inset: 0;
          background: rgba(44,26,14,0);
          transition: background 0.35s ease;
        }
        .km-drawer.open .km-drawer-overlay {
          background: rgba(44,26,14,0.45);
        }

        .km-drawer-panel {
          position: absolute; top: 0; right: 0; bottom: 0;
          width: min(320px, 88vw);
          background: var(--white);
          border-left: 1px solid rgba(122,74,46,0.12);
          display: flex; flex-direction: column;
          transform: translateX(100%);
          transition: transform 0.38s cubic-bezier(0.4, 0, 0.2, 1);
          padding-top: var(--nav-h);
          overflow-y: auto;
        }
        .km-drawer.open .km-drawer-panel {
          transform: translateX(0);
        }

        /* ── Mobile nav items ── */
        .km-mobile-links {
          padding: 1.5rem 0;
          flex: 1;
        }
        .km-mobile-link-wrap {
          border-bottom: 1px solid rgba(122,74,46,0.08);
        }
        .km-mobile-link {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.1rem 2rem;
          font-size: 0.88rem; font-weight: 500;
          letter-spacing: 0.06em; text-transform: uppercase;
          color: var(--clay);
          transition: background 0.15s, color 0.15s;
        }
        .km-mobile-link:hover { background: rgba(62,107,78,0.05); color: var(--sky); }
        .km-mobile-link-arrow {
          font-size: 0.7rem; color: var(--dust);
          transition: transform 0.2s;
        }
        .km-mobile-link:hover .km-mobile-link-arrow { transform: translateX(3px); color: var(--sky); }

        /* ── Mobile footer strip ── */
        .km-drawer-footer {
          padding: 1.5rem 2rem 2rem;
          border-top: 1px solid rgba(122,74,46,0.08);
        }
        .km-drawer-cta {
          display: block; width: 100%; text-align: center;
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: white; background: var(--sky);
          padding: 0.9rem 1.5rem;
          transition: background 0.2s;
        }
        .km-drawer-cta:hover { background: var(--earth); }
        .km-drawer-tagline {
          font-size: 0.72rem; font-weight: 400;
          color: var(--dust); letter-spacing: 0.06em;
          text-align: center; margin-top: 1rem;
          font-style: italic;
        }

        /* ── Accent strip at very top ── */
        .km-accent-bar {
          position: absolute; top: 0; left: 0; right: 0;
          height: 2.5px; background: var(--sky);
          transform-origin: left;
          animation: barReveal 0.8s ease forwards;
        }
        @keyframes barReveal {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        /* ── Responsive breakpoint ── */
        @media (max-width: 768px) {
          .km-links { display: none; }
          .km-right .km-cta { display: none; }
          .km-burger { display: flex; }
        }
      `}</style>

      {/* ── Main header bar ── */}
      <header className={`km-header ${scrolled ? "scrolled" : "top"}`}>
        <div className="km-accent-bar" />

        <nav className="km-nav-bar" aria-label="Main navigation">
          {/* Logo */}
          <a href="#home" className="km-logo" aria-label="Ken Mutua Farms — home">
            <span className="km-logo-name font-serif">
              Asili <span>Acres</span>
            </span>
            <span className="km-logo-sub">Kitui · Makueni · Est. 2019</span>
          </a>

          {/* Desktop links */}
          <ul className="km-links" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={href}>
                <a href={href} className="km-link">{label}</a>
              </li>
            ))}
          </ul>

          {/* Desktop right */}
          <div className="km-right">
            <a href="#contact" className="km-cta">Get in Touch</a>

            {/* Hamburger */}
            <button
              className={`km-burger ${menuOpen ? "open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="km-mobile-drawer"
              onClick={() => setMenuOpen(v => !v)}
            >
              <span className="km-burger-line" />
              <span className="km-burger-line" />
              <span className="km-burger-line" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Mobile drawer ── */}
      <div
        id="km-mobile-drawer"
        className={`km-drawer ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Overlay — click to close */}
        <div className="km-drawer-overlay" onClick={close} />

        <div className="km-drawer-panel">
          <nav className="km-mobile-links" aria-label="Mobile navigation">
            <ul role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href} className="km-mobile-link-wrap">
                  <a
                    href={href}
                    className="km-mobile-link"
                    onClick={close}
                  >
                    {label}
                    <span className="km-mobile-link-arrow" aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="km-drawer-footer">
            <a href="#contact" className="km-drawer-cta" onClick={close}>
              Get in Touch
            </a>
            <p className="km-drawer-tagline">
              From charcoal sacks to two counties — Est. 2019
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header