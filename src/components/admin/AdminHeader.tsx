import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/slice/authSlice';

const AdminHeader = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <header className="sticky top-0 z-30 h-14 bg-[#f5f0e8] border-b border-[#e0d8cc] flex items-center justify-between pl-14 pr-4 lg:px-6">
      <p className="text-xs tracking-widest uppercase text-[#8a7e6e]">
        Farm Management
      </p>

      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm text-[#1a2e1a] font-medium">{user?.name}</p>
          <p className="text-xs text-[#8a7e6e] capitalize">{user?.role}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#2d5a27] flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;