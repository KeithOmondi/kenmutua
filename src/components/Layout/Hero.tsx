import { useEffect, useRef } from "react"

const COUNTIES = [
  { name: "Kitui", label: "County" },
  { name: "Makueni", label: "County" },
]

const Hero = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const tagRef = useRef<HTMLParagraphElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)

  // Staggered entrance animation on mount
  useEffect(() => {
    const els = [
      tagRef.current,
      headlineRef.current,
      subRef.current,
      actionsRef.current,
      badgesRef.current,
    ]
    els.forEach((el, i) => {
      if (!el) return
      el.style.opacity = "0"
      el.style.transform = "translateY(28px)"
      el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`
      // Trigger in next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        })
      })
    })
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        .hero-section {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 110px 6% 6rem;
          position: relative;
          overflow: hidden;
          background: #FAF5EC;
          font-family: 'Outfit', sans-serif;
        }

        /* Ambient background blobs */
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 80% 40%, rgba(90,143,98,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 10% 80%, rgba(212,168,67,0.07) 0%, transparent 60%);
        }

        /* Eyebrow tag */
        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #3E6B4E;
          margin-bottom: 1.8rem;
          position: relative;
          z-index: 1;
        }
        .hero-tag-line {
          display: inline-block;
          width: 28px;
          height: 1.5px;
          background: #3E6B4E;
          flex-shrink: 0;
        }

        /* Headline */
        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.2rem, 7vw, 7rem);
          font-weight: 700;
          line-height: 1.0;
          color: #2C1A0E;
          position: relative;
          z-index: 1;
          max-width: 820px;
          margin: 0;
        }
        .hero-headline em {
          font-style: italic;
          color: #3E6B4E;
        }

        /* Subtitle */
        .hero-sub {
          font-size: 1.05rem;
          line-height: 1.8;
          font-weight: 300;
          color: #7A4A2E;
          max-width: 540px;
          margin: 2rem 0 3rem;
          position: relative;
          z-index: 1;
        }

        /* CTA row */
        .hero-actions {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .hero-btn-primary {
          background: #3E6B4E;
          color: white;
          padding: 0.85rem 2rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          border: none;
          cursor: pointer;
          display: inline-block;
          transition: background 0.25s, transform 0.2s;
        }
        .hero-btn-primary:hover {
          background: #2C1A0E;
          transform: translateY(-2px);
        }
        .hero-btn-outline {
          border: 1.5px solid #7A4A2E;
          color: #7A4A2E;
          padding: 0.82rem 2rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          cursor: pointer;
          display: inline-block;
          background: transparent;
          transition: border-color 0.25s, color 0.25s;
        }
        .hero-btn-outline:hover {
          border-color: #3E6B4E;
          color: #3E6B4E;
        }

        /* Floating county badges */
        .hero-badges {
          position: absolute;
          right: 5%;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 1rem;
          z-index: 1;
        }
        .hero-badge {
          background: #FFFDF8;
          border: 1px solid rgba(122,74,46,0.15);
          padding: 1rem 1.4rem;
          text-align: center;
          box-shadow: 0 4px 24px rgba(44,26,14,0.08);
        }
        .hero-badge:nth-child(1) {
          animation: kmFloat 4s ease-in-out infinite;
        }
        .hero-badge:nth-child(2) {
          animation: kmFloat 4s ease-in-out infinite;
          animation-delay: -2s;
        }
        .hero-badge-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.9rem;
          font-weight: 700;
          color: #3E6B4E;
          line-height: 1;
          display: block;
        }
        .hero-badge-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #7A4A2E;
          margin-top: 0.25rem;
        }

        @keyframes kmFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }

        /* Responsive */
        @media (max-width: 900px) {
          .hero-badges {
            position: static;
            transform: none;
            flex-direction: row;
            margin-top: 3rem;
          }
        }

        @media (max-width: 520px) {
          .hero-section {
            padding: 100px 6% 4rem;
          }
          .hero-badges {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>

      <section className="hero-section" id="home" aria-label="Hero">
        {/* Ambient blobs */}
        <div className="hero-bg" aria-hidden="true" />

        {/* Eyebrow */}
        <p className="hero-tag" ref={tagRef}>
          <span className="hero-tag-line" />
          Livestock &amp; Poultry Farmer — Kitui &amp; Makueni
        </p>

        {/* Headline */}
        <h1 className="hero-headline" ref={headlineRef}>
          From <em>charcoal sacks</em>
          <br />
          to a thriving farm
        </h1>

        {/* Subtitle */}
        <p className="hero-sub" ref={subRef}>
          Built from nothing but determination. Started in 2019 with proceeds
          from selling charcoal, Ken Mutua now runs a livestock and poultry
          operation across two counties in Kenya.
        </p>

        {/* CTAs */}
        <div className="hero-actions" ref={actionsRef}>
          <a href="#story" className="hero-btn-primary">Read My Story</a>
          <a href="#services" className="hero-btn-outline">View Services</a>
        </div>

        {/* Floating county badges */}
        <div className="hero-badges" ref={badgesRef} aria-label="Counties we operate in">
          {COUNTIES.map(({ name, label }) => (
            <div className="hero-badge" key={name}>
              <span className="hero-badge-name">{name}</span>
              <span className="hero-badge-label">{label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Hero