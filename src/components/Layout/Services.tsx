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
    <section
      id="services"
      aria-label="Services"
      className="bg-[#FAF5EC] py-24 px-6 lg:px-16 font-['Outfit',sans-serif]"
    >
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14 max-w-7xl mx-auto">
        <div>
          <p className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-[#3E6B4E] mb-3 inline-flex items-center gap-2">
            <span className="w-5 h-px bg-[#3E6B4E] inline-block" />
            What I Offer
          </p>
          <h2 className="font-['Cormorant_Garamond',serif] text-4xl md:text-5xl font-bold text-[#2C1A0E] leading-tight">
            Farm Products &amp; Services
          </h2>
        </div>
        
        <a
          href="#contact"
          className="shrink-0 inline-block border border-[#7A4A2E] text-[#7A4A2E] px-7 py-3 text-sm font-medium tracking-wide hover:bg-[#7A4A2E] hover:text-white transition-all duration-200 self-start sm:self-auto"
        >
          Enquire Now
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
        {SERVICES.map((svc) => (
          <div
            key={svc.name}
            role="listitem"
            className={`
              group relative flex flex-col rounded-2xl p-8 transition-all duration-300
              hover:-translate-y-1 hover:shadow-xl cursor-default
              ${svc.highlight
                ? "bg-[#3E6B4E] text-white shadow-lg shadow-[rgba(62,107,78,0.25)]"
                : "bg-white border border-[rgba(122,74,46,0.1)] hover:border-[rgba(62,107,78,0.25)] shadow-sm"
              }
            `}
          >
            <div className={`
              w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-6 shrink-0
              ${svc.highlight ? "bg-white/15" : "bg-[rgba(62,107,78,0.07)]"}
            `}>
              {svc.icon}
            </div>

            <h3 className={`
              font-['Cormorant_Garamond',serif] text-xl font-bold mb-3 leading-snug
              ${svc.highlight ? "text-white" : "text-[#2C1A0E]"}
            `}>
              {svc.name}
            </h3>

            <p className={`
              text-sm font-light leading-[1.8] mb-6 flex-1
              ${svc.highlight ? "text-white/80" : "text-[#7A4A2E]"}
            `}>
              {svc.desc}
            </p>

            <div className="flex flex-wrap gap-2 mt-auto">
              {svc.tags.map((tag) => (
                <span
                  key={tag}
                  className={`
                    text-[0.68rem] font-medium tracking-widest uppercase px-3 py-1 rounded-full
                    ${svc.highlight
                      ? "bg-white/20 text-white/90"
                      : "bg-[rgba(62,107,78,0.08)] text-[#3E6B4E] border border-[rgba(62,107,78,0.18)]"
                    }
                  `}
                >
                  {tag}
                </span>
              ))}
            </div>

            {!svc.highlight && (
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-2xl pointer-events-none">
                <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[rgba(62,107,78,0.2)] group-hover:bg-[#3E6B4E] transition-colors duration-300" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Services