import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchStoryContent, selectTimeline } from '../../store/slice/storySlice';
import { fetchServices, selectAllServices } from '../../store/slice/servicesSlice';
import { fetchCoverage, selectCoverageCounties } from '../../store/slice/coverageSlice';
import { fetchGalleryItems, selectGalleryItems } from '../../store/slice/gallerySlice';
import { fetchInquiriesQueue, selectInquiriesQueue } from '../../store/slice/contactSlice';

const AdminDashboard = () => {
  const dispatch = useAppDispatch();

  // Data from slices
  const timelineEntries = useAppSelector(selectTimeline);
  const services = useAppSelector(selectAllServices);
  const counties = useAppSelector(selectCoverageCounties);
  const galleryItems = useAppSelector(selectGalleryItems);
  const inquiries = useAppSelector(selectInquiriesQueue);

  // Fetch all data on mount
  useEffect(() => {
    dispatch(fetchStoryContent());
    dispatch(fetchServices());
    dispatch(fetchCoverage());
    dispatch(fetchGalleryItems());
    dispatch(fetchInquiriesQueue());
  }, [dispatch]);

  // Stats cards with real counts
  const stats = [
    {
      label: 'Timeline Events',
      value: timelineEntries.length,
      change: 'Story milestones',
      trend: 'up',
      linkTo: '/admin/story',
    },
    {
      label: 'Active Services',
      value: services.length,
      change: 'Farm offerings',
      trend: 'up',
      linkTo: '/admin/services',
    },
    {
      label: 'Counties Covered',
      value: counties.length,
      change: 'Operational regions',
      trend: 'stable',
      linkTo: '/admin/coverage',
    },
    {
      label: 'Gallery Assets',
      value: galleryItems.length,
      change: 'Media records',
      trend: 'up',
      linkTo: '/admin/gallery',
    },
    {
      label: 'Pending Inquiries',
      value: inquiries.length,
      change: 'Unread messages',
      trend: inquiries.length > 0 ? 'up' : 'stable',
      linkTo: '/admin/contact',
    },
  ];

  // Activity feed (can be extended later with real audit logs)
  const activities = [
    { id: 1, action: 'Hero Content Updated', target: 'Tagline & buttons', user: 'Admin', time: 'Recently' },
    { id: 2, action: 'Gallery Upload', target: `${galleryItems.length} total items`, user: 'Admin', time: 'Ongoing' },
    { id: 3, action: 'Timeline Modified', target: `${timelineEntries.length} entries`, user: 'Admin', time: 'Latest sync' },
    { id: 4, action: 'Coverage Data Synced', target: `${counties.length} counties`, user: 'System', time: 'Auto' },
  ];

  return (
    <div className="bg-[#1A0E06] min-h-screen font-['Outfit',sans-serif] text-[#F2DBA8]">
      {/* Top Header (No Sidebar) */}
      <header className="bg-[#2C1A0E] border-b border-[rgba(212,168,67,0.15)] h-16 flex items-center justify-between px-[6%] shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[#D4A843] animate-pulse" />
          <h2 className="font-['Cormorant_Garamond',serif] text-xl font-bold tracking-wide text-[#F2DBA8]">
            KEN MUTUA FARMS
          </h2>
          <span className="text-xs uppercase font-mono tracking-widest text-[rgba(212,168,67,0.6)] ml-4">
            Dashboard / Live
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-bold text-[#F2DBA8]">Administrator</p>
            <p className="text-[10px] text-[#D4A843] font-mono">ID: #MUTA-FARMS</p>
          </div>
        </div>
      </header>

      <main className="p-6 md:p-[4%] max-w-7xl w-full mx-auto space-y-10">
        {/* Welcome Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[rgba(212,168,67,0.1)] pb-6">
          <div>
            <h1 className="font-['Cormorant_Garamond',serif] text-3xl font-bold text-[#F2DBA8] mb-1">
              Farm Operations Control Center
            </h1>
            <p className="text-xs text-[rgba(242,219,168,0.5)]">
              Manage hero section, story, services, coverage, gallery, and contact inquiries.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => {
                dispatch(fetchStoryContent());
                dispatch(fetchServices());
                dispatch(fetchCoverage());
                dispatch(fetchGalleryItems());
                dispatch(fetchInquiriesQueue());
              }}
              className="bg-transparent border border-[rgba(212,168,67,0.3)] hover:border-[#D4A843] text-[#F2DBA8] font-semibold tracking-wide text-xs uppercase px-4 py-3 transition-colors"
            >
              Refresh All
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {stats.map((stat, i) => (
            <Link
              key={i}
              to={stat.linkTo}
              className="bg-[#2C1A0E] border border-[rgba(212,168,67,0.1)] p-5 flex flex-col justify-between relative group hover:border-[#D4A843]/30 transition-all cursor-pointer"
            >
              <span className="text-[10px] font-semibold tracking-widest text-[rgba(212,168,67,0.7)] uppercase block mb-2">
                {stat.label}
              </span>
              <span className="text-2xl font-bold font-['Cormorant_Garamond',serif] text-[#F2DBA8] tracking-wide mb-1">
                {stat.value}
              </span>
              <span
                className={`text-[10px] font-mono ${
                  stat.trend === 'up' ? 'text-emerald-400/80' : 'text-amber-400/60'
                }`}
              >
                {stat.change}
              </span>
            </Link>
          ))}
        </section>

        {/* Two-Column Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Log */}
          <div className="lg:col-span-2 bg-[#2C1A0E] border border-[rgba(212,168,67,0.1)] p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-['Cormorant_Garamond',serif] text-xl font-bold text-[#D4A843] mb-4 border-b border-[rgba(212,168,67,0.06)] pb-2">
                Recent Activity Log
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[rgba(212,168,67,0.1)] text-[10px] tracking-widest uppercase text-[rgba(212,168,67,0.6)]">
                      <th className="pb-3 font-semibold">Action</th>
                      <th className="pb-3 font-semibold">Target</th>
                      <th className="pb-3 font-semibold">User</th>
                      <th className="pb-3 font-semibold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(212,168,67,0.05)] text-xs">
                    {activities.map((log) => (
                      <tr key={log.id} className="hover:bg-white/[0.01] transition-colors">
                        <td className="py-3 font-medium text-[#F2DBA8]">{log.action}</td>
                        <td className="py-3 text-[rgba(242,219,168,0.65)]">{log.target}</td>
                        <td className="py-3 font-mono text-[10px] text-[#D4A843]/80">{log.user}</td>
                        <td className="py-3 text-right text-[rgba(242,219,168,0.4)] font-mono text-[10px]">
                          {log.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="pt-4 border-t border-[rgba(212,168,67,0.05)] text-center">
              <button className="text-[10px] uppercase font-semibold text-[#D4A843] tracking-widest hover:underline">
                View Full Audit Trail
              </button>
            </div>
          </div>

          {/* Quick Actions & System Status */}
          <div className="bg-[#2C1A0E] border border-[rgba(212,168,67,0.1)] p-6 space-y-6">
            <h3 className="font-['Cormorant_Garamond',serif] text-xl font-bold text-[#D4A843] border-b border-[rgba(212,168,67,0.06)] pb-2">
              Quick Actions
            </h3>

            <div className="space-y-3">
              <Link
                to="/admin/gallery"
                className="w-full text-left bg-black/20 hover:bg-black/40 border border-[rgba(212,168,67,0.15)] hover:border-[#D4A843]/50 p-3 flex items-center justify-between group transition-all"
              >
                <div>
                  <p className="text-xs font-semibold text-[#F2DBA8]">Upload Gallery Image</p>
                  <p className="text-[10px] text-[rgba(242,219,168,0.4)]">Add new media asset</p>
                </div>
                <span className="text-[#D4A843] text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                to="/admin/story"
                className="w-full text-left bg-black/20 hover:bg-black/40 border border-[rgba(212,168,67,0.15)] hover:border-[#D4A843]/50 p-3 flex items-center justify-between group transition-all"
              >
                <div>
                  <p className="text-xs font-semibold text-[#F2DBA8]">Add Timeline Event</p>
                  <p className="text-[10px] text-[rgba(242,219,168,0.4)]">Expand farm story</p>
                </div>
                <span className="text-[#D4A843] text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>

              <Link
                to="/admin/services"
                className="w-full text-left bg-black/20 hover:bg-black/40 border border-[rgba(212,168,67,0.15)] hover:border-[#D4A843]/50 p-3 flex items-center justify-between group transition-all"
              >
                <div>
                  <p className="text-xs font-semibold text-[#F2DBA8]">Add New Service</p>
                  <p className="text-[10px] text-[rgba(242,219,168,0.4)]">Offer more farm products</p>
                </div>
                <span className="text-[#D4A843] text-sm group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>

            <div className="bg-black/20 border border-[rgba(212,168,67,0.08)] p-4 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[rgba(242,219,168,0.5)]">API Status:</span>
                <span className="font-mono text-[10px] text-emerald-400 font-semibold">OPERATIONAL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[rgba(242,219,168,0.5)]">Cloudinary Sync:</span>
                <span className="font-mono text-[10px] text-emerald-400 font-semibold">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[rgba(242,219,168,0.5)]">Database:</span>
                <span className="font-mono text-[10px] text-[#D4A843]">CONNECTED</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;