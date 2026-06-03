const COUNTIES = [
  {
    name: "Kitui",
    items: ["Poultry supply", "Livestock sales", "Local market delivery"],
  },
  {
    name: "Makueni",
    items: ["Poultry supply", "Goat rearing", "Bulk farm orders"],
  },
]

const STATS = [
  { num: "2",  label: "Counties Covered" },
  { num: "6+", label: "Years Farming" },
  { num: "3",  label: "Started with 3 Goats" },
]

const Coverage = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        .cov-section {
          background: #F2DBA8;
          padding: 6rem 6%;
          font-family: 'Outfit', sans-serif;
        }

        .cov-inner {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 5rem;
          align-items: start;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ── Left col ── */
        .cov-label {
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #3E6B4E; margin-bottom: 0.8rem;
        }
        .cov-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3rem);
          font-weight: 700; line-height: 1.15;
          color: #2C1A0E; margin: 0 0 2rem;
        }

        /* County cards */
        .cov-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .cov-card {
          background: #FFFDF8;
          padding: 1.6rem;
          border-bottom: 3px solid #3E6B4E;
        }
        .cov-card-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem; font-weight: 700;
          color: #2C1A0E; line-height: 1;
        }
        .cov-card-sub {
          font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.14em; text-transform: uppercase;
          color: #3E6B4E; margin: 0.35rem 0 1rem;
        }
        .cov-card-list {
          list-style: none; padding: 0; margin: 0;
        }
        .cov-card-list li {
          font-size: 0.85rem; font-weight: 300;
          color: #7A4A2E; line-height: 1.9;
          display: flex; align-items: baseline; gap: 0.35rem;
        }
        .cov-card-list li::before {
          content: '→';
          color: #3E6B4E;
          font-size: 0.78rem;
          flex-shrink: 0;
        }

        /* ── Right col ── */
        .cov-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(1.4rem, 2.5vw, 1.85rem);
          font-style: italic; font-weight: 600;
          color: #2C1A0E; line-height: 1.5;
          margin-bottom: 1.4rem;
        }
        .cov-body {
          font-size: 0.92rem; line-height: 1.8; font-weight: 300;
          color: #7A4A2E;
          margin-bottom: 2.5rem;
        }

        /* Stats row */
        .cov-stats {
          display: flex; gap: 3rem;
          border-top: 1px solid rgba(122,74,46,0.2);
          padding-top: 2rem;
        }
        .cov-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.8rem; font-weight: 700;
          color: #3E6B4E; line-height: 1;
        }
        .cov-stat-label {
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: #7A4A2E; margin-top: 0.3rem;
        }

        /* Responsive */
        @media (max-width: 860px) {
          .cov-inner {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
        }
        @media (max-width: 480px) {
          .cov-cards { grid-template-columns: 1fr; }
          .cov-stats { gap: 2rem; flex-wrap: wrap; }
        }
      `}</style>

      <section className="cov-section" id="coverage" aria-label="Coverage">
        <div className="cov-inner">

          {/* Left */}
          <div>
            <p className="cov-label">Where We Operate</p>
            <h2 className="cov-title">Two Counties,<br />One Mission</h2>

            <div className="cov-cards">
              {COUNTIES.map(({ name, items }) => (
                <div className="cov-card" key={name}>
                  <div className="cov-card-name">{name}</div>
                  <div className="cov-card-sub">County</div>
                  <ul className="cov-card-list">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div>
            <blockquote className="cov-quote">
              "A farm that started with goats now feeds families across two counties."
            </blockquote>
            <p className="cov-body">
              From a small investment in 2019 to an expanding operation across Kitui
              and Makueni — the growth has been steady, deliberate, and driven by a
              commitment to quality.
            </p>

            <div className="cov-stats">
              {STATS.map(({ num, label }) => (
                <div key={label}>
                  <div className="cov-stat-num">{num}</div>
                  <div className="cov-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}

export default Coverage