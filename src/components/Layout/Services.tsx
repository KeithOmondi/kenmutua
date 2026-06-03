const SERVICES = [
  {
    icon: "🐓",
    name: "Poultry Farming",
    desc: "Free-range and quality-raised poultry for households, retailers, and local markets. Consistent supply of healthy birds raised with care.",
    tags: ["Kitui", "Makueni"],
    highlight: false,
  },
  {
    icon: "🐐",
    name: "Livestock Rearing",
    desc: "Goats and other livestock raised from quality breeds. Available for purchase by individuals, households, and community buyers.",
    tags: ["Kitui", "Makueni"],
    highlight: true,
  },
  {
    icon: "🥚",
    name: "Fresh Farm Eggs",
    desc: "Farm-fresh eggs collected daily. Supplied to local markets, households, and small businesses looking for reliable, quality produce.",
    tags: ["Local Markets"],
    highlight: false,
  },
  {
    icon: "🌾",
    name: "Farm Produce Supply",
    desc: "Direct-from-farm supply for traders, hotels, and bulk buyers in Kitui and Makueni. Consistent, traceable, and fresh every time.",
    tags: ["Wholesale", "Retail"],
    highlight: false,
  },
  {
    icon: "🤝",
    name: "Agri Consultation",
    desc: "Peer mentorship and advice for young farmers starting out. Sharing lessons from the YALTA program and years of hands-on experience.",
    tags: ["YALTA Alumni"],
    highlight: false,
  },
  {
    icon: "📦",
    name: "Custom Orders",
    desc: "Special orders for events, functions, and festive seasons. Pre-order your poultry or livestock supply ahead of time for the best availability.",
    tags: ["Events", "Seasonal"],
    highlight: false,
  },
]

const Services = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600&display=swap');

        .svc-section {
          padding: 6rem 6%;
          background: #FAF5EC;
          font-family: 'Outfit', sans-serif;
        }

        /* Header row */
        .svc-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 3rem;
        }
        .svc-label {
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #3E6B4E; margin-bottom: 0.7rem;
        }
        .svc-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 3.5vw, 2.8rem);
          font-weight: 700; color: #2C1A0E;
          line-height: 1.15; margin: 0;
        }
        .svc-enquire {
          flex-shrink: 0;
          display: inline-block;
          border: 1.5px solid #7A4A2E;
          color: #7A4A2E;
          padding: 0.7rem 1.8rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.82rem; font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          background: transparent;
          transition: border-color 0.2s, color 0.2s;
          cursor: pointer;
        }
        .svc-enquire:hover {
          border-color: #3E6B4E;
          color: #3E6B4E;
        }

        /* Grid */
        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border: 1px solid rgba(122,74,46,0.12);
        }

        /* Card */
        .svc-card {
          padding: 2.5rem;
          background: #FFFDF8;
          border-right: 1px solid rgba(122,74,46,0.1);
          border-bottom: 1px solid rgba(122,74,46,0.1);
          transition: background 0.25s, transform 0.25s;
          cursor: default;
        }
        .svc-card:nth-child(3n) {
          border-right: none;
        }
        .svc-card:nth-last-child(-n+3) {
          border-bottom: none;
        }
        .svc-card.highlight {
          background: #EBF3EC;
        }
        .svc-card:hover {
          background: #E5EFE6;
          transform: translateY(-3px);
        }
        .svc-card.highlight:hover {
          background: #ddeade;
        }

        .svc-icon {
          font-size: 2.2rem;
          margin-bottom: 1.4rem;
          display: block;
          line-height: 1;
        }
        .svc-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.35rem; font-weight: 700;
          color: #2C1A0E; margin-bottom: 0.65rem;
          line-height: 1.2;
        }
        .svc-desc {
          font-size: 0.87rem; line-height: 1.75; font-weight: 300;
          color: #7A4A2E;
          margin-bottom: 1.2rem;
        }
        .svc-tags {
          display: flex; flex-wrap: wrap; gap: 0.4rem;
        }
        .svc-tag {
          font-size: 0.7rem; font-weight: 500;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: #3E6B4E;
          background: rgba(62,107,78,0.08);
          border: 1px solid rgba(62,107,78,0.2);
          padding: 0.2rem 0.65rem;
        }

        /* Responsive */
        @media (max-width: 860px) {
          .svc-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .svc-card:nth-child(3n) {
            border-right: 1px solid rgba(122,74,46,0.1);
          }
          .svc-card:nth-child(2n) {
            border-right: none;
          }
          .svc-card:nth-last-child(-n+3) {
            border-bottom: 1px solid rgba(122,74,46,0.1);
          }
          .svc-card:nth-last-child(-n+2) {
            border-bottom: none;
          }
        }

        @media (max-width: 560px) {
          .svc-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
          }
          .svc-grid {
            grid-template-columns: 1fr;
          }
          .svc-card {
            border-right: none !important;
            border-bottom: 1px solid rgba(122,74,46,0.1) !important;
          }
          .svc-card:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>

      <section className="svc-section" id="services" aria-label="Services">
        <div className="svc-header">
          <div>
            <p className="svc-label">What I Offer</p>
            <h2 className="svc-title">Farm Products &amp; Services</h2>
          </div>
          <a href="#contact" className="svc-enquire">Enquire Now</a>
        </div>

        <div className="svc-grid" role="list">
          {SERVICES.map((svc) => (
            <div
              key={svc.name}
              className={`svc-card${svc.highlight ? " highlight" : ""}`}
              role="listitem"
            >
              <span className="svc-icon" aria-hidden="true">{svc.icon}</span>
              <h3 className="svc-name">{svc.name}</h3>
              <p className="svc-desc">{svc.desc}</p>
              <div className="svc-tags">
                {svc.tags.map((tag) => (
                  <span className="svc-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

export default Services