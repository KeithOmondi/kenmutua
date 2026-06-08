import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { 
  submitInquiry, 
  resetSubmitStatus, 
  selectIsSubmitting, 
  selectSubmitSuccess, 
  selectContactError 
} from "../../store/slice/contactSlice";

const CONTACT_ITEMS = [
  {
    icon: "📍",
    label: "Location",
    value: "Kitui & Makueni Counties, Kenya",
  },
  {
    icon: "📱",
    label: "WhatsApp / Call",
    value: "+254 769 014 126",
  },
  {
    icon: "🕐",
    label: "Availability",
    value: "Mon – Sat, 7:00am – 6:00pm",
  },
];

const SERVICE_OPTIONS = [
  "Poultry purchase",
  "Livestock / Goats",
  "Fresh eggs",
  "Bulk / wholesale supply",
  "Agri advice / mentorship",
  "Custom / event order",
];

const Contact = () => {
  const dispatch = useAppDispatch();
  
  // Read state engines straight out of Redux Toolkit slice selectors
  const isSubmitting = useAppSelector(selectIsSubmitting);
  const submitSuccess = useAppSelector(selectSubmitSuccess);
  const submissionError = useAppSelector(selectContactError);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: "",
    message: "",
  });

  // Always reset the submission success state when this component mounts
  useEffect(() => {
    dispatch(resetSubmitStatus());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    
    // Dispatch to global async API thunk layer instead of manual local toggle
    dispatch(submitInquiry(form));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600;1,700&family=Outfit:wght@300;400;500;600&display=swap');

        /* ── CONTACT SECTION ── */
        .ct-section {
          background: #2C1A0E;
          padding: 6rem 6%;
          font-family: 'Outfit', sans-serif;
        }

        .ct-inner {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 6rem;
          align-items: start;
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ── Left ── */
        .ct-label {
          font-size: 0.72rem; font-weight: 600;
          letter-spacing: 0.16em; text-transform: uppercase;
          color: #D4A843; margin-bottom: 1rem;
        }
        .ct-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 700; line-height: 1.15;
          color: #F2DBA8; margin: 0 0 1.4rem;
        }
        .ct-body {
          font-size: 0.92rem; line-height: 1.8; font-weight: 300;
          color: rgba(242,219,168,0.55);
          margin-bottom: 2.5rem;
        }

        /* Contact items */
        .ct-items {
          display: flex; flex-direction: column; gap: 1.1rem;
        }
        .ct-item {
          display: flex; align-items: flex-start; gap: 1rem;
        }
        .ct-icon-box {
          width: 40px; height: 40px; flex-shrink: 0;
          background: rgba(212,168,67,0.1);
          border: 1px solid rgba(212,168,67,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }
        .ct-item-label {
          font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: #D4A843; margin-bottom: 0.2rem;
        }
        .ct-item-value {
          font-size: 0.9rem; font-weight: 300;
          color: #F2DBA8; line-height: 1.4;
        }

        /* ── Right — Form ── */
        .ct-form {
          display: flex; flex-direction: column; gap: 1rem;
        }
        .ct-field-label {
          font-size: 0.68rem; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(212,168,67,0.65);
          display: block; margin-bottom: 0.45rem;
        }
        .ct-input,
        .ct-select,
        .ct-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,168,67,0.18);
          color: #F2DBA8;
          font-family: 'Outfit', sans-serif;
          font-size: 0.9rem; font-weight: 300;
          padding: 0.82rem 1rem;
          outline: none;
          transition: border-color 0.2s;
          appearance: none;
          -webkit-appearance: none;
        }
        .ct-input::placeholder,
        .ct-textarea::placeholder {
          color: rgba(242,219,168,0.25);
        }
        .ct-input:focus,
        .ct-select:focus,
        .ct-textarea:focus {
          border-color: rgba(212,168,67,0.5);
        }
        .ct-textarea {
          resize: vertical;
          min-height: 120px;
        }

        /* Select wrapper for custom arrow */
        .ct-select-wrap {
          position: relative;
        }
        .ct-select-wrap::after {
          content: '▾';
          position: absolute; right: 1rem; top: 50%;
          transform: translateY(-50%);
          color: rgba(212,168,67,0.5);
          pointer-events: none; font-size: 0.85rem;
        }
        .ct-select {
          cursor: pointer;
        }
        .ct-select option {
          background: #2C1A0E;
          color: #F2DBA8;
        }

        /* Submit */
        .ct-submit {
          width: 100%;
          background: #D4A843;
          color: #2C1A0E;
          border: none;
          padding: 1.05rem;
          font-family: 'Outfit', sans-serif;
          font-size: 0.85rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          margin-top: 0.25rem;
        }
        .ct-submit:hover {
          background: #c49a35;
          transform: translateY(-1px);
        }
        .ct-submit:active { transform: translateY(0); }
        .ct-submit:disabled {
          opacity: 0.5; cursor: not-allowed; transform: none;
        }

        /* Error Banner Handling */
        .ct-error-banner {
          background: rgba(211, 47, 47, 0.12);
          border: 1px solid rgba(211, 47, 47, 0.3);
          color: #ff8a80;
          padding: 0.82rem 1rem;
          font-size: 0.85rem;
          line-height: 1.4;
        }

        /* Success state */
        .ct-success {
          background: rgba(62,107,78,0.15);
          border: 1px solid rgba(62,107,78,0.35);
          padding: 2rem;
          text-align: center;
        }
        .ct-success-icon { font-size: 2rem; margin-bottom: 0.8rem; }
        .ct-success-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem; font-weight: 700;
          color: #F2DBA8; margin-bottom: 0.5rem;
        }
        .ct-success-body {
          font-size: 0.88rem; font-weight: 300;
          color: rgba(242,219,168,0.6); line-height: 1.7;
        }

        /* ── FOOTER ── */
        .ct-footer {
          background: #1A0E06;
          padding: 2rem 6%;
          font-family: 'Outfit', sans-serif;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.8rem;
        }
        .ct-footer-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem; font-weight: 700;
          color: #F2DBA8;
        }
        .ct-footer-logo span { color: #3E6B4E; }
        .ct-footer-mid {
          font-size: 0.78rem; font-weight: 300;
          color: rgba(242,219,168,0.3);
          letter-spacing: 0.04em;
        }
        .ct-footer-right {
          font-size: 0.78rem; font-weight: 300;
          color: rgba(242,219,168,0.25);
          font-style: italic;
        }

        /* Responsive */
        @media (max-width: 860px) {
          .ct-inner { grid-template-columns: 1fr; gap: 3rem; }
        }
        @media (max-width: 480px) {
          .ct-footer { flex-direction: column; text-align: center; }
        }
      `}</style>

      {/* ── CONTACT SECTION ── */}
      <section className="ct-section" id="contact" aria-label="Contact">
        <div className="ct-inner">

          {/* Left Block */}
          <div>
            <p className="ct-label">Get in Touch</p>
            <h2 className="ct-title">
              Order, partner,<br />or just say hello
            </h2>
            <p className="ct-body">
              Whether you want to buy poultry, order livestock, discuss bulk supply,
              or simply learn more about the farm — reach out. Every enquiry is welcome.
            </p>

            <div className="ct-items">
              {CONTACT_ITEMS.map(({ icon, label, value }) => (
                <div className="ct-item" key={label}>
                  <div className="ct-icon-box" aria-hidden="true">{icon}</div>
                  <div>
                    <div className="ct-item-label">{label}</div>
                    <div className="ct-item-value">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Block — Controlled Form */}
          {submitSuccess ? (
            <div className="ct-success" role="alert">
              <div className="ct-success-icon">✅</div>
              <div className="ct-success-title">Message sent!</div>
              <p className="ct-success-body">
                Thank you, {form.name}. Your inquiry has been logged successfully. Ken will be in touch via WhatsApp shortly.
              </p>
            </div>
          ) : (
            <div className="ct-form" role="form" aria-label="Contact form">
              
              {/* Dynamic Error Messaging Output */}
              {submissionError && (
                <div className="ct-error-banner" role="alert">
                  ⚠️ {submissionError}
                </div>
              )}

              <div>
                <label className="ct-field-label" htmlFor="ct-name">Your Name</label>
                <input
                  id="ct-name"
                  name="name"
                  type="text"
                  className="ct-input"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="ct-field-label" htmlFor="ct-phone">Phone / WhatsApp</label>
                <input
                  id="ct-phone"
                  name="phone"
                  type="tel"
                  className="ct-input"
                  placeholder="+254 769 014 126"
                  value={form.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="ct-field-label" htmlFor="ct-service">What are you interested in?</label>
                <div className="ct-select-wrap">
                  <select
                    id="ct-service"
                    name="service"
                    className="ct-select"
                    value={form.service}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="ct-field-label" htmlFor="ct-message">Message</label>
                <textarea
                  id="ct-message"
                  name="message"
                  className="ct-textarea"
                  placeholder="Tell me what you need..."
                  value={form.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <button
                className="ct-submit"
                onClick={handleSubmit}
                disabled={isSubmitting || !form.name.trim() || !form.phone.trim()}
                aria-label="Send message"
              >
                {isSubmitting ? "Sending Inquiry..." : "Send Message →"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="ct-footer">
        <div className="ct-footer-logo font-serif">
          Asili <span>Acres</span>
        </div>
        <p className="ct-footer-mid">
          Kitui &amp; Makueni Counties · Kenya · Est. 2019
        </p>
        <p className="ct-footer-right">
          African Youth Panelist - Kitui County
        </p>
      </footer>
    </>
  );
};

export default Contact;