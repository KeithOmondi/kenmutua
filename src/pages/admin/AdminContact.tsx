import { useEffect } from 'react';
import { 
  fetchInquiriesQueue, 
  selectInquiriesQueue, 
  selectIsLoadingQueue, 
  selectContactError 
} from '../../store/slice/contactSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const AdminContact = () => {
  const dispatch = useAppDispatch();
  
  // Connect component layer to Redux context state
  const inquiries = useAppSelector(selectInquiriesQueue);
  const isLoading = useAppSelector(selectIsLoadingQueue);
  const error = useAppSelector(selectContactError);

  // Synchronize database records on mount
  useEffect(() => {
    dispatch(fetchInquiriesQueue());
  }, [dispatch]);

  // Helper formatting for localized Kenya dates (EAT)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-KE', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      <style>{`
        /* ── ADMIN DASHBOARD CONTAINER ── */
        .adm-container {
          background: #1A0E06; /* Dark background */
          min-height: 100vh;
          padding: 3rem 6%;
          font-family: 'Outfit', sans-serif;
          color: #F2DBA8;
        }

        .adm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(212, 168, 67, 0.15);
          padding-bottom: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .adm-title-block h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: #F2DBA8;
          margin: 0 0 0.2rem 0;
        }

        .adm-title-block p {
          font-size: 0.9rem;
          color: rgba(242, 219, 168, 0.5);
          margin: 0;
        }

        .adm-refresh-btn {
          background: rgba(212, 168, 67, 0.1);
          border: 1px solid rgba(212, 168, 67, 0.3);
          color: #D4A843;
          padding: 0.6rem 1.2rem;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .adm-refresh-btn:hover {
          background: #D4A843;
          color: #2C1A0E;
        }

        /* ── STATES ── */
        .adm-state-box {
          text-align: center;
          padding: 5rem 2rem;
          background: #2C1A0E;
          border: 1px solid rgba(212, 168, 67, 0.1);
        }

        .adm-error {
          border-color: rgba(211, 47, 47, 0.3);
          color: #ff8a80;
        }

        /* ── INQUIRY CARDS GRID ── */
        .adm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 1.5rem;
        }

        .adm-card {
          background: #2C1A0E; /* Deep surface contrast */
          border: 1px solid rgba(212, 168, 67, 0.12);
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.2s, border-color 0.2s;
          position: relative;
        }

        .adm-card:hover {
          transform: translateY(-2px);
          border-color: rgba(212, 168, 67, 0.3);
        }

        .adm-card-top {
          margin-bottom: 1.2rem;
        }

        .adm-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .adm-badge {
          font-size: 0.65rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.25rem 0.6rem;
          background: rgba(212, 168, 67, 0.12);
          color: #D4A843;
          border: 1px solid rgba(212, 168, 67, 0.2);
        }

        .adm-date {
          font-size: 0.75rem;
          color: rgba(242, 219, 168, 0.4);
        }

        .adm-client-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #F2DBA8;
          margin: 0 0 0.2rem 0;
        }

        .adm-client-phone {
          font-size: 0.85rem;
          color: #D4A843;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .adm-client-phone:hover {
          text-decoration: underline;
        }

        .adm-message-text {
          font-size: 0.9rem;
          line-height: 1.6;
          color: rgba(242, 219, 168, 0.7);
          background: rgba(0, 0, 0, 0.15);
          padding: 0.75rem;
          border-left: 2px solid rgba(212, 168, 67, 0.4);
          margin: 0;
          font-style: italic;
          word-break: break-word;
        }

        .adm-card-actions {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(212, 168, 67, 0.08);
          display: flex;
          justify-content: flex-end;
        }

        .adm-whatsapp-btn {
          background: #3E6B4E; /* Subtle green tone */
          color: #F2DBA8;
          border: none;
          padding: 0.5rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: background 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
        }

        .adm-whatsapp-btn:hover {
          background: #32563e;
        }
      `}</style>

      <div className="adm-container">
        {/* Top Header Block */}
        <header className="adm-header">
          <div className="adm-title-block">
            <h1>Farm Inquiries Queue</h1>
            <p>Monitor incoming customer orders, requests, and farm mentorship queries.</p>
          </div>
          <button 
            className="adm-refresh-btn" 
            onClick={() => dispatch(fetchInquiriesQueue())}
            disabled={isLoading}
          >
            {isLoading ? 'Syncing...' : '🔄 Refresh Data'}
          </button>
        </header>

        {/* Loading State UI */}
        {isLoading && inquiries.length === 0 && (
          <div className="adm-state-box">
            <p>Synchronizing operational databases secure logstreams...</p>
          </div>
        )}

        {/* Error Handling State UI */}
        {error && (
          <div className="adm-state-box adm-error" role="alert">
            <h3>Data Synchronization Halt</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Empty State Layout */}
        {!isLoading && !error && inquiries.length === 0 && (
          <div className="adm-state-box">
            <p>Queue empty. No active incoming submissions recorded.</p>
          </div>
        )}

        {/* Functional Dynamic Grid Content */}
        <main className="adm-grid">
          {inquiries.map((inquiry) => (
            <article className="adm-card" key={inquiry.id}>
              <div className="adm-card-top">
                <div className="adm-card-meta">
                  <span className="adm-badge">
                    {inquiry.service || 'General Inquiry'}
                  </span>
                  <span className="adm-date">
                    {formatDate(inquiry.created_at)}
                  </span>
                </div>
                
                <h2 className="adm-client-name">{inquiry.name}</h2>
                
                <a 
                  href={`tel:${inquiry.phone}`} 
                  className="adm-client-phone"
                  title="Initiate direct cellular line connection"
                >
                  📱 {inquiry.phone}
                </a>

                {inquiry.message && (
                  <p className="adm-message-text">
                    "{inquiry.message}"
                  </p>
                )}
              </div>

              {/* Action Toolbar Linkages */}
              <div className="adm-card-actions">
                <a
                  href={`https://wa.me/${inquiry.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello ${inquiry.name}, this is Ken Mutua regarding your farm inquiry for ${inquiry.service || 'poultry items'}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="adm-whatsapp-btn"
                >
                  💬 Open WhatsApp
                </a>
              </div>
            </article>
          ))}
        </main>
      </div>
    </>
  );
};

export default AdminContact;