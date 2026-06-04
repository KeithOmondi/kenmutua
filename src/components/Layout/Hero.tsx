import { useEffect, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchHeroContent, selectHeroContent, selectHeroIsFetching } from "../../store/slice/heroSlice"

const Hero = () => {
  const dispatch = useAppDispatch()
  const content  = useAppSelector(selectHeroContent)
  const loading  = useAppSelector(selectHeroIsFetching)

  const headlineRef = useRef<HTMLHeadingElement>(null)
  const tagRef      = useRef<HTMLParagraphElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const actionsRef  = useRef<HTMLDivElement>(null)
  const badgesRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(fetchHeroContent())
  }, [dispatch])

  // Re-run entrance animation whenever content loads
  useEffect(() => {
    if (!content) return
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
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = "1"
          el.style.transform = "translateY(0)"
        })
      })
    })
  }, [content])

  // Split headline into parts around the emphasis phrase
  const renderHeadline = () => {
    if (!content) return null
    const { headline, headline_emphasis } = content
    const parts = headline.split(headline_emphasis)
    return (
      <>
        {parts[0]}<em>{headline_emphasis}</em>{parts[1]}
      </>
    )
  }

  if (loading && !content) return (
    <section
      style={{
        minHeight: '100vh',
        background: '#FAF5EC',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-label="Loading hero"
    />
  )

  if (!content) return null

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
        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 80% 40%, rgba(90,143,98,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 10% 80%, rgba(212,168,67,0.07) 0%, transparent 60%);
        }
        .hero-image {
          position: absolute;
          right: 0; bottom: 0;
          width: 45%; max-width: 600px;
          height: auto; z-index: 0;
          pointer-events: none; opacity: 0.85;
          object-fit: cover; object-position: center bottom;
          mask-image: linear-gradient(to left, black 60%, transparent 100%);
          -webkit-mask-image: linear-gradient(to left, black 60%, transparent 100%);
        }
        @media (min-width: 1200px) {
          .hero-image { bottom: 0; width: 40%; opacity: 0.9; }
        }
        @media (max-width: 900px) {
          .hero-image {
            width: 50%; opacity: 0.6;
            mask-image: linear-gradient(to left, black 40%, transparent 100%);
            -webkit-mask-image: linear-gradient(to left, black 40%, transparent 100%);
          }
        }
        @media (max-width: 680px) {
          .hero-image { opacity: 0.25; width: 70%; }
        }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 0.65rem;
          font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #3E6B4E; margin-bottom: 1.8rem;
          position: relative; z-index: 1;
        }
        .hero-tag-line {
          display: inline-block; width: 28px; height: 1.5px;
          background: #3E6B4E; flex-shrink: 0;
        }
        .hero-headline {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3.2rem, 7vw, 7rem);
          font-weight: 700; line-height: 1.0;
          color: #2C1A0E; position: relative; z-index: 1;
          max-width: 820px; margin: 0;
        }
        .hero-headline em { font-style: italic; color: #3E6B4E; }
        .hero-sub {
          font-size: 1.05rem; line-height: 1.8; font-weight: 300;
          color: #7A4A2E; max-width: 540px; margin: 2rem 0 3rem;
          position: relative; z-index: 1;
        }
        .hero-actions {
          display: flex; gap: 1rem; align-items: center;
          flex-wrap: wrap; position: relative; z-index: 1;
        }
        .hero-btn-primary {
          background: #3E6B4E; color: white;
          padding: 0.85rem 2rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem; font-weight: 500;
          letter-spacing: 0.04em; text-decoration: none;
          border: none; cursor: pointer; display: inline-block;
          transition: background 0.25s, transform 0.2s;
        }
        .hero-btn-primary:hover { background: #2C1A0E; transform: translateY(-2px); }
        .hero-btn-outline {
          border: 1.5px solid #7A4A2E; color: #7A4A2E;
          padding: 0.82rem 2rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem; font-weight: 500;
          letter-spacing: 0.04em; text-decoration: none;
          cursor: pointer; display: inline-block; background: transparent;
          transition: border-color 0.25s, color 0.25s;
        }
        .hero-btn-outline:hover { border-color: #3E6B4E; color: #3E6B4E; }
        .hero-badges {
          position: absolute; right: 5%; top: 50%;
          transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 1rem; z-index: 2;
        }
        .hero-badge {
          background: #FFFDF8;
          border: 1px solid rgba(122,74,46,0.15);
          padding: 1rem 1.4rem; text-align: center;
          box-shadow: 0 4px 24px rgba(44,26,14,0.08);
          backdrop-filter: blur(4px);
        }
        .hero-badge:nth-child(1) { animation: kmFloat 4s ease-in-out infinite; }
        .hero-badge:nth-child(2) { animation: kmFloat 4s ease-in-out infinite; animation-delay: -2s; }
        .hero-badge-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.9rem; font-weight: 700;
          color: #3E6B4E; line-height: 1; display: block;
        }
        .hero-badge-label {
          display: block; font-size: 0.72rem; font-weight: 500;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #7A4A2E; margin-top: 0.25rem;
        }
        @keyframes kmFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-10px); }
        }
        @media (max-width: 900px) {
          .hero-badges { position: static; transform: none; flex-direction: row; margin-top: 3rem; }
        }
        @media (max-width: 520px) {
          .hero-section { padding: 100px 6% 4rem; }
          .hero-badges { flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <section className="hero-section" id="home" aria-label="Hero">
        <div className="hero-bg" aria-hidden="true" />

        {content.image_url && (
          <img
            src={content.image_url}
            alt={content.image_alt ?? 'Ken Mutua Farms'}
            className="hero-image"
            loading="eager"
          />
        )}

        <p className="hero-tag" ref={tagRef}>
          <span className="hero-tag-line" />
          {content.tag_line}
        </p>

        <h1 className="hero-headline" ref={headlineRef}>
          {renderHeadline()}
        </h1>

        <p className="hero-sub" ref={subRef}>
          {content.subtitle}
        </p>

        <div className="hero-actions" ref={actionsRef}>
          <a href={content.primary_btn_href} className="hero-btn-primary">
            {content.primary_btn_label}
          </a>
          <a href={content.secondary_btn_href} className="hero-btn-outline">
            {content.secondary_btn_label}
          </a>
        </div>

        <div className="hero-badges" ref={badgesRef} aria-label="Counties we operate in">
          {content.counties.map(({ name, label }) => (
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