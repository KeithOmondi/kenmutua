const TIMELINE = [
  {
    year: "2019",
    heading: "The Charcoal Days",
    desc: "Sold sacks of charcoal — reinvested every penny with purpose. Purchased 3 goats as the first livestock investment, planting the seed of what was to come.",
    tag: "Livestock begins",
    dot: "19",
    active: false,
  },
  {
    year: "2020",
    heading: "Poultry Farm Established",
    desc: "Set up a full poultry farming operation. Chickens, structure, and a serious business mindset. What began with goats now grew wings — literally.",
    tag: "Poultry launch",
    dot: "20",
    active: false,
  },
  {
    year: "2024 — 2025",
    heading: "YALTA Mentorship",
    desc: "Selected for the prestigious YALTA program — a 6-month intensive mentorship for outstanding young agripreneurs. A national recognition of the farming journey and future potential.",
    tag: "YALTA Program · 6 months",
    dot: "★",
    active: true,
  },
  {
    year: "Present",
    heading: "Two Counties, Growing Strong",
    desc: "Full livestock and poultry operation across Kitui and Makueni counties. From charcoal sacks to a recognised agripreneur — the journey continues.",
    tag: "Kitui · Makueni",
    dot: "NOW",
    active: true,
    isNow: true,
  },
];

const MyStory = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        /* ── ORIGIN ── */
        .ms-origin {
          background: #2C1A0E;
          padding: 6rem 6%;
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }
        .ms-origin-watermark {
          position: absolute;
          top: -80px; left: -20px;
          font-family: 'Cormorant Garamond', serif;
          font-size: 28rem; font-weight: 700;
          color: rgba(255,255,255,0.03);
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }
        .ms-origin-inner {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 6rem;
          align-items: start;
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* Left col */
        .ms-origin-label {
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #D4A843; margin-bottom: 1.2rem;
        }
        .ms-origin-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3.5rem);
          font-weight: 600; line-height: 1.15;
          color: #F2DBA8;
        }
        .ms-origin-title em {
          font-style: italic;
          color: #D4A843;
        }
        .ms-origin-body {
          font-size: 1rem; line-height: 1.85; font-weight: 300;
          color: rgba(242,219,168,0.65);
          margin-top: 1.8rem;
        }

        /* Right col */
        .ms-origin-quote {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.55rem; font-style: italic;
          color: #F2DBA8; line-height: 1.5;
          border-left: 3px solid #D4A843;
          padding-left: 1.5rem;
          margin-bottom: 2rem;
        }
        .ms-origin-detail {
          font-size: 1rem; line-height: 1.85; font-weight: 300;
          color: rgba(242,219,168,0.65);
        }

        /* ── TIMELINE ── */
        .ms-timeline-section {
          background: #2C1A0E;
          padding: 0 6% 6rem;
          font-family: 'Outfit', sans-serif;
        }
        .ms-timeline-label {
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #D4A843;
          text-align: center;
          padding-bottom: 3rem;
        }

        .ms-timeline {
          position: relative;
          max-width: 860px;
          margin: 0 auto;
        }
        .ms-timeline-spine {
          position: absolute;
          left: 50%; top: 0; bottom: 0;
          width: 1px;
          background: rgba(212,168,67,0.2);
          transform: translateX(-50%);
        }

        /* Each row */
        .ms-tl-row {
          display: grid;
          grid-template-columns: 1fr 60px 1fr;
          margin-bottom: 3rem;
          align-items: start;
        }

        /* Odd rows: content left, empty right */
        .ms-tl-row:nth-child(odd) .ms-tl-content {
          grid-column: 1;
          text-align: right;
          padding-right: 2.5rem;
        }
        .ms-tl-row:nth-child(odd) .ms-tl-dot  { grid-column: 2; }
        .ms-tl-row:nth-child(odd) .ms-tl-empty { grid-column: 3; }

        /* Even rows: empty left, content right */
        .ms-tl-row:nth-child(even) .ms-tl-empty   { grid-column: 1; }
        .ms-tl-row:nth-child(even) .ms-tl-dot      { grid-column: 2; }
        .ms-tl-row:nth-child(even) .ms-tl-content  {
          grid-column: 3;
          text-align: left;
          padding-left: 2.5rem;
        }

        .ms-tl-dot {
          justify-self: center;
          width: 52px; height: 52px;
          border-radius: 50%;
          background: #2C1A0E;
          border: 2px solid #D4A843;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.88rem; font-weight: 700;
          color: #D4A843;
          position: relative; z-index: 1;
          letter-spacing: -0.02em;
          flex-shrink: 0;
        }
        .ms-tl-dot.active {
          background: #D4A843;
          color: #2C1A0E;
          border-color: #D4A843;
          box-shadow: 0 0 0 6px rgba(212,168,67,0.15);
        }
        .ms-tl-dot.now {
          background: #3E6B4E;
          color: white;
          border-color: #3E6B4E;
          box-shadow: 0 0 0 6px rgba(62,107,78,0.2);
          font-size: 0.7rem;
          letter-spacing: 0.04em;
        }

        .ms-tl-year {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem; font-weight: 700;
          color: #D4A843; line-height: 1;
          margin-bottom: 0.4rem;
        }
        .ms-tl-heading {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 600;
          color: #F2DBA8; margin-bottom: 0.5rem;
        }
        .ms-tl-desc {
          font-size: 0.88rem; line-height: 1.7; font-weight: 300;
          color: rgba(242,219,168,0.65);
        }
        .ms-tl-tag {
          display: inline-block;
          margin-top: 0.7rem;
          background: rgba(212,168,67,0.1);
          border: 1px solid rgba(212,168,67,0.25);
          color: #D4A843;
          font-size: 0.73rem; font-weight: 500;
          letter-spacing: 0.06em;
          padding: 0.25rem 0.7rem;
        }

        /* ── Responsive ── */
        @media (max-width: 860px) {
          .ms-origin-inner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          /* Flatten timeline to left-aligned on mobile */
          .ms-timeline-spine { left: 26px; transform: none; }
          .ms-tl-row {
            grid-template-columns: 52px 1fr;
            gap: 0 1rem;
          }
          .ms-tl-row:nth-child(odd) .ms-tl-content,
          .ms-tl-row:nth-child(even) .ms-tl-content {
            grid-column: 2; grid-row: 1;
            text-align: left;
            padding: 0;
          }
          .ms-tl-row:nth-child(odd) .ms-tl-dot,
          .ms-tl-row:nth-child(even) .ms-tl-dot {
            grid-column: 1; grid-row: 1;
          }
          .ms-tl-empty { display: none; }
        }
      `}</style>

      {/* ── ORIGIN STORY ── */}
      <section className="ms-origin" id="story" aria-label="My story">
        <span className="ms-origin-watermark" aria-hidden="true">"</span>

        <div className="ms-origin-inner">
          {/* Left */}
          <div>
            <p className="ms-origin-label">The Origin</p>
            <h2 className="ms-origin-title">
              Every empire<br />starts with a<br /><em>single trade</em>
            </h2>
            <p className="ms-origin-body">
              Before the livestock, before the poultry farm, before the two counties —
              there were sacks of charcoal. Ken Mutua sold charcoal, saved every shilling,
              and made a decision that would change everything. This is the story of what
              happens when discipline meets vision.
            </p>
          </div>

          {/* Right */}
          <div>
            <blockquote className="ms-origin-quote">
              "I sold charcoal so I could buy my first three goats. That was the beginning of everything."
            </blockquote>
            <p className="ms-origin-detail">
              In 2019, with the proceeds from selling sacks of charcoal, Ken purchased three goats —
              a humble but deliberate investment. By 2020, he had set up a fully operational poultry farm.
              Today, his operation spans livestock and poultry across Kitui and Makueni counties, and in
              2024/2025 he was selected for a prestigious 6-month mentorship under the YALTA program —
              a recognition of the quality and promise of his work.
            </p>
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="ms-timeline-section" aria-label="Journey timeline">
        <p className="ms-timeline-label">The Journey</p>

        <div className="ms-timeline">
          <div className="ms-timeline-spine" aria-hidden="true" />

          {TIMELINE.map((item, i) => (
            <div className="ms-tl-row" key={i}>
              <div className="ms-tl-content">
                <div className="ms-tl-year">{item.year}</div>
                <div className="ms-tl-heading">{item.heading}</div>
                <p className="ms-tl-desc">{item.desc}</p>
                <span className="ms-tl-tag">{item.tag}</span>
              </div>

              <div
                className={`ms-tl-dot ${item.active ? "active" : ""} ${item.isNow ? "now" : ""}`}
                aria-hidden="true"
              >
                {item.dot}
              </div>

              <div className="ms-tl-empty" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default MyStory;