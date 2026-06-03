import { useState } from "react"

const GALLERY_ITEMS = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/27908188/pexels-photo-27908188.jpeg",
    label: "Free-Range Chickens",
    caption: "Our chickens roam freely on open pasture every day, enjoying natural sunlight and fresh air.",
    category: "Poultry",
    location: "Kitui County",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/5840898/pexels-photo-5840898.jpeg",
    label: "Livestock — Goats",
    caption: "Quality goat breeds raised sustainably in Kitui County, known for their resilience and health.",
    category: "Livestock",
    location: "Kitui County",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/19972937/pexels-photo-19972937.jpeg",
    label: "Fresh Farm Eggs",
    caption: "Collected daily — deep orange yolks, rich in flavor, every time.",
    category: "Poultry",
    location: "Makueni County",
  },
  {
    id: 4,
    image: "https://images.pexels.com/photos/32911433/pexels-photo-32911433.jpeg",
    label: "The Farmland",
    caption: "Open fields stretching across Kitui and Makueni counties, rich with potential.",
    category: "Farm",
    location: "Kitui & Makueni",
  },
  {
    id: 5,
    image: "https://images.pexels.com/photos/13859220/pexels-photo-13859220.jpeg",
    label: "Farm Structures",
    caption: "Purpose-built housing designed for optimal poultry and livestock welfare.",
    category: "Farm",
    location: "Kitui County",
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop",
    label: "YALTA Mentorship",
    caption: "6-month agripreneur mentorship program, 2024/2025 — shaping the next generation of farmers.",
    category: "Milestones",
    location: "Regional Program",
  },
  {
    id: 7,
    image: "https://images.pexels.com/photos/37150855/pexels-photo-37150855.jpeg",
    label: "Chicks — Early Stage",
    caption: "New batches of chicks raised from day one with meticulous care on the farm.",
    category: "Poultry",
    location: "Kitui County",
  },
  {
    id: 8,
    image: "https://res.cloudinary.com/dvmoqhrd5/image/upload/v1780508726/farm_delivery_motorbike_l13vld.svg",
    label: "Ready for Delivery",
    caption: "Orders packed with care and ready for delivery to buyers across Kitui & Makueni.",
    category: "Operations",
    location: "Distribution Center",
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop",
    label: "Sunrise on the Farm",
    caption: "A typical early morning — 7am and the farm is already alive with activity and promise.",
    category: "Farm",
    location: "Kitui County",
  },
]

const CATEGORIES = ["All", "Poultry", "Livestock", "Farm", "Milestones", "Operations"]

const Gallery = () => {
  const [active, setActive] = useState("All")
  const [lightbox, setLightbox] = useState<number | null>(null)

  const filtered = active === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((g) => g.category === active)

  const lightboxItem = GALLERY_ITEMS.find((g) => g.id === lightbox) ?? null

  const moveLightbox = (dir: 1 | -1) => {
    if (!lightboxItem) return
    const idx = filtered.findIndex((g) => g.id === lightboxItem.id)
    const next = filtered[(idx + dir + filtered.length) % filtered.length]
    setLightbox(next.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!lightboxItem) return
    if (e.key === "ArrowLeft") moveLightbox(-1)
    else if (e.key === "ArrowRight") moveLightbox(1)
    else if (e.key === "Escape") setLightbox(null)
  }

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease; }
        .animate-scaleIn { animation: scaleIn 0.25s ease; }
      `}</style>

      <section className="bg-[#FAF5EC] py-24 px-6 lg:px-12 font-['Outfit',sans-serif]" id="gallery">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-[#3E6B4E] mb-4 inline-block bg-[rgba(62,107,78,0.1)] px-4 py-1 rounded-full">
            On the Farm
          </span>
          <h2 className="font-['Cormorant_Garamond',serif] text-4xl md:text-5xl font-bold text-[#2C1A0E] leading-tight mb-3">
            Life at Ken Mutua Farms
          </h2>
          <p className="text-base font-light text-[#7A4A2E] max-w-[600px] mx-auto leading-relaxed">
            A glimpse into daily farm life — from the birds and goats to the land, the work, and the milestones.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`
                font-['Outfit',sans-serif] text-sm font-medium tracking-wide uppercase
                px-5 py-2 rounded-full transition-all duration-200
                ${active === cat
                  ? 'bg-[#3E6B4E] text-white shadow-md shadow-[rgba(62,107,78,0.3)] border-[#3E6B4E]'
                  : 'bg-transparent text-[#7A4A2E] border-2 border-[rgba(122,74,46,0.2)] hover:border-[#3E6B4E] hover:text-[#3E6B4E] hover:-translate-y-0.5'
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightbox(item.id)}
              className="group relative overflow-hidden cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setLightbox(item.id)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-[#E8D5C0]">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(44,26,14,0.9)] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[0.7rem] font-semibold tracking-wide uppercase text-[#3E6B4E] z-10">
                    {item.category}
                  </span>
                  <span className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm w-8 h-8 rounded-full flex items-center justify-center text-white text-base transition-all duration-200 group-hover:bg-white/30 group-hover:scale-110">
                    ⤢
                  </span>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white">
                    <div className="font-['Cormorant_Garamond',serif] text-lg font-bold mb-1">{item.label}</div>
                    <div className="text-sm font-light opacity-90 leading-relaxed mb-2">{item.caption.substring(0, 60)}...</div>
                    <div className="text-xs font-normal opacity-70 flex items-center gap-1">📍 {item.location}</div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="font-['Cormorant_Garamond',serif] text-lg font-bold text-[#2C1A0E] mb-2">{item.label}</div>
                <div className="text-sm font-light text-[#7A4A2E] leading-relaxed mb-2">{item.caption.substring(0, 80)}...</div>
                <div className="text-xs font-normal text-[#3E6B4E] flex items-center gap-1">📍 {item.location}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal — FIXED */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-[9999] bg-[rgba(26,14,6,0.92)] backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={(e) => e.target === e.currentTarget && setLightbox(null)}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label={lightboxItem.label}
          tabIndex={-1}
        >
          {/* Counter — top center, outside card */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs font-medium text-white/50 tracking-widest uppercase">
            {filtered.findIndex((g) => g.id === lightboxItem.id) + 1} / {filtered.length}
          </div>

          {/* Close button — top right, outside card */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm text-white/80 hover:text-white w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all duration-200 hover:bg-white/20"
            aria-label="Close lightbox"
          >
            ✕
          </button>

          {/* Prev arrow — left, outside card */}
          <button
            onClick={() => moveLightbox(-1)}
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-200 hover:bg-white/25 hover:scale-110"
            aria-label="Previous image"
          >
            ←
          </button>

          {/* Next arrow — right, outside card */}
          <button
            onClick={() => moveLightbox(1)}
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm text-white w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-200 hover:bg-white/25 hover:scale-110"
            aria-label="Next image"
          >
            →
          </button>

          {/* Modal card */}
          <div className="relative w-full max-w-4xl max-h-[88vh] bg-white rounded-2xl overflow-hidden shadow-2xl animate-scaleIn flex flex-col md:flex-row">

            {/* Image — left on md+, top on mobile */}
            <div className="md:w-[55%] shrink-0 bg-[#1a0e06] flex items-center justify-center overflow-hidden">
              <img
                src={lightboxItem.image}
                alt={lightboxItem.label}
                className="w-full h-full object-cover max-h-[45vh] md:max-h-[88vh]"
              />
            </div>

            {/* Info — right on md+, bottom on mobile */}
            <div className="md:w-[45%] flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
              <div>
                <div className="text-[0.65rem] font-semibold tracking-[0.15em] uppercase text-[#3E6B4E] mb-2 bg-[rgba(62,107,78,0.1)] inline-block px-3 py-1 rounded-full">
                  {lightboxItem.category}
                </div>
                <h3 className="font-['Cormorant_Garamond',serif] text-2xl sm:text-3xl font-bold text-[#2C1A0E] mt-3 mb-3 leading-snug">
                  {lightboxItem.label}
                </h3>
                <p className="text-sm font-light text-[#7A4A2E] leading-relaxed">
                  {lightboxItem.caption}
                </p>
              </div>
              <div className="pt-5 mt-5 border-t border-[rgba(0,0,0,0.08)] text-sm text-[#3E6B4E] flex items-center gap-2">
                📍 {lightboxItem.location}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Gallery