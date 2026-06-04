import { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { 
  fetchGalleryItems, 
  addGalleryItem, 
  updateGalleryItem,
  deleteGalleryItem,
  selectGalleryItems, 
  selectIsGalleryLoading, 
  selectGalleryError,
  type GalleryItem
} from '../../store/slice/gallerySlice';

const CATEGORIES = ["Poultry", "Livestock", "Farm", "Milestones", "Operations"];

const AdminGallery = () => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Connect component to Redux gallery state engine
  const items = useAppSelector(selectGalleryItems);
  const isGlobalLoading = useAppSelector(selectIsGalleryLoading);
  const globalError = useAppSelector(selectGalleryError);

  // Structural toggle tracking whether admin is creating or editing an entry
  const [editingId, setEditingId] = useState<number | null>(null);

  // Local Form state for staging asset mutations
  const [form, setForm] = useState({
    label: '',
    caption: '',
    category: 'Poultry',
    location_tag: 'Kitui County'
  });

  // Dedicated state fields explicitly tracking binary file objects and operational UI notices
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Local structural tracking map allowing index browsing across preview panels
  const [previewIndexes, setPreviewIndexes] = useState<Record<number, number>>({});

  // Synchronize gallery items registry on component mount
  useEffect(() => {
    dispatch(fetchGalleryItems());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      setFormError(null);
    }
  };

  // Initialize form properties using existing data matrix when transitioning to Edit mode
  const handleInitiateEdit = (item: GalleryItem) => {
    setFormError(null);
    setFormSuccess(null);
    setEditingId(item.id);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    setForm({
      label: item.label,
      caption: item.caption,
      category: item.category,
      location_tag: item.location // Maps layout normalization variable down to database configuration fields
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setForm({
      label: '',
      caption: '',
      category: 'Poultry',
      location_tag: 'Kitui County'
    });
  };

  const handleSaveAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    // Contextual validation: File asset is strictly required ONLY when spawning completely new records
    if (!editingId && !selectedFile) {
      setFormError('A valid binary media file asset must be selected to publish a new record.');
      return;
    }

    if (!form.label || !form.caption || !form.location_tag) {
      setFormError('All text tracking fields require comprehensive structural data inputs.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('label', form.label);
      formData.append('caption', form.caption);
      formData.append('category', form.category);
      formData.append('location_tag', form.location_tag);

      if (editingId) {
        // Execute dynamic backend PUT action updates
        await dispatch(updateGalleryItem({ id: editingId, formData })).unwrap();
        setFormSuccess('Gallery record successfully altered in production nodes.');
        setEditingId(null);
      } else {
        // Post production creation entries
        await dispatch(addGalleryItem(formData)).unwrap();
        setFormSuccess('Media asset successfully recorded in the remote production system database.');
      }

      // Reset asset states and inputs
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setForm({
        label: '',
        caption: '',
        category: 'Poultry',
        location_tag: 'Kitui County'
      });

    } catch (err: unknown) {
      setFormError(typeof err === 'string' ? err : 'An unexpected operational database exception occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAsset = async (id: number) => {
    if (!window.confirm('Are you absolutely certain you want to purge this record out of dynamic showcase visibility?')) return;
    
    setFormError(null);
    setFormSuccess(null);
    try {
      await dispatch(deleteGalleryItem(id)).unwrap();
      setFormSuccess('Target gallery record removed successfully.');
      if (editingId === id) handleCancelEdit();
    } catch (err: unknown) {
      setFormError(typeof err === 'string' ? err : 'Failed to commit file erasure instructions to database context.');
    }
  };

  // Traverses items arrays forwards or backwards relative to specific category scopes
  const navigateCardPreview = (currentItem: GalleryItem, direction: 1 | -1) => {
    const scopeItems = items.filter(i => i.category === currentItem.category);
    const currentIndex = scopeItems.findIndex(i => i.id === currentItem.id);
    if (currentIndex === -1) return;

    const targetIndex = (currentIndex + direction + scopeItems.length) % scopeItems.length;
    const targetItem = scopeItems[targetIndex];

    setPreviewIndexes(prev => ({
      ...prev,
      [currentItem.category === form.category ? 0 : currentItem.id]: targetItem.id
    }));
  };

  return (
    <div className="bg-[#1A0E06] min-h-screen py-12 px-[6%] font-['Outfit',sans-serif] text-[#F2DBA8]">
      {/* Dynamic Section Header */}
      <header className="border-b border-[rgba(212,168,67,0.15)] pb-6 mb-10">
        <h1 className="font-['Cormorant_Garamond',serif] text-4xl font-bold text-[#F2DBA8] mb-1">
          Farm Gallery Control Engine
        </h1>
        <p className="text-sm text-[rgba(242,219,168,0.5)]">
          Manage live frontend showcase records, track livestock cycles, and update visual timeline parameters.
        </p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-14 items-start">
        {/* Left Column: Management Submission Control Board */}
        <section className="bg-[#2C1A0E] border border-[rgba(212,168,67,0.15)] p-8 lg:sticky lg:top-8">
          <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#D4A843] border-b border-[rgba(212,168,67,0.1)] pb-2 mb-6">
            {editingId ? `Modify Asset Records (ID: #${editingId})` : 'Publish Media Asset'}
          </h2>
          
          <form onSubmit={handleSaveAsset} className="space-y-5">
            {formError && (
              <div className="bg-[rgba(211,47,47,0.15)] border border-[rgba(211,47,47,0.3)] text-[#ff8a80] p-3 text-sm">
                ⚠️ {formError}
              </div>
            )}
            {formSuccess && (
              <div className="bg-[rgba(62,107,78,0.15)] border border-[rgba(62,107,78,0.35)] text-[#a3e2b8] p-3 text-sm">
                ✅ {formSuccess}
              </div>
            )}

            <div>
              <label className="text-[0.68rem] font-semibold tracking-widest text-[rgba(212,168,67,0.7)] uppercase block mb-2">
                Select Asset Image File {editingId && <span className="text-xs lowercase text-amber-500/60">(Optional)</span>}
              </label>
              <input 
                type="file" 
                name="image"
                ref={fileInputRef}
                className="w-full bg-black/20 border border-[rgba(212,168,67,0.18)] text-[#F2DBA8] text-sm p-2 outline-none focus:border-[#D4A843] disabled:opacity-50" 
                accept="image/jpeg,image/png,image/webp,image/gif,image/heic"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-[0.68rem] font-semibold tracking-widest text-[rgba(212,168,67,0.7)] uppercase block mb-2">
                Asset Label
              </label>
              <input 
                type="text" 
                name="label"
                className="w-full bg-black/20 border border-[rgba(212,168,67,0.18)] text-[#F2DBA8] text-sm p-3 outline-none focus:border-[#D4A843] disabled:opacity-50" 
                placeholder="e.g., Free-Range Layers" 
                value={form.label}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-[0.68rem] font-semibold tracking-widest text-[rgba(212,168,67,0.7)] uppercase block mb-2">
                Classification Category
              </label>
              <select 
                name="category"
                className="w-full bg-black/20 border border-[rgba(212,168,67,0.18)] text-[#F2DBA8] text-sm p-3 outline-none focus:border-[#D4A843] disabled:opacity-50"
                value={form.category}
                onChange={handleInputChange}
                disabled={isSubmitting}
              >
                {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-[#2C1A0E] text-[#F2DBA8]">{cat}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[0.68rem] font-semibold tracking-widest text-[rgba(212,168,67,0.7)] uppercase block mb-2">
                Regional Location Tag
              </label>
              <input 
                type="text" 
                name="location_tag"
                className="w-full bg-black/20 border border-[rgba(212,168,67,0.18)] text-[#F2DBA8] text-sm p-3 outline-none focus:border-[#D4A843] disabled:opacity-50" 
                placeholder="Kitui County" 
                value={form.location_tag}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-[0.68rem] font-semibold tracking-widest text-[rgba(212,168,67,0.7)] uppercase block mb-2">
                Detailed Caption
              </label>
              <textarea 
                name="caption"
                className="w-full bg-black/20 border border-[rgba(212,168,67,0.18)] text-[#F2DBA8] text-sm p-3 min-h-[90px] outline-none focus:border-[#D4A843] resize-vertical disabled:opacity-50" 
                placeholder="Provide details regarding this record execution loop context..."
                value={form.caption}
                onChange={handleInputChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="flex gap-3 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="w-1/3 bg-transparent border-2 border-[rgba(212,168,67,0.3)] text-[#F2DBA8] p-3 text-xs font-semibold tracking-wide uppercase transition-colors hover:border-amber-600 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              )}
              <button 
                type="submit" 
                className={`bg-[#D4A843] text-[#2C1A0E] p-3 text-xs font-semibold tracking-widest uppercase transition-all hover:bg-[#c49a35] disabled:opacity-50 disabled:cursor-not-allowed ${editingId ? 'w-2/3' : 'w-full'}`}
                disabled={isSubmitting || isGlobalLoading || (!editingId && !selectedFile) || !form.label || !form.caption}
              >
                {isSubmitting ? 'Transmitting Server Data Matrix...' : editingId ? 'Commit Modifications →' : 'Publish to Live Gallery →'}
              </button>
            </div>
          </form>
        </section>


{/* Right Column: Inventory Visual Monitoring Matrix */}
        
        <section className="space-y-6">
  <div className="flex justify-between items-center">
    <h2 className="font-['Cormorant_Garamond',serif] text-2xl font-bold">Active Showcase Stack</h2>
    <span className="text-xs text-[rgba(242,219,168,0.4)]">Total Dynamic Records: {items.length}</span>
  </div>

  {globalError && (
    <div className="bg-[rgba(211,47,47,0.15)] border border-[rgba(211,47,47,0.3)] text-[#ff8a80] p-4 text-sm">
      <strong>Showcase Synchronize Halt:</strong> {globalError}
    </div>
  )}

  {isGlobalLoading && items.length === 0 ? (
    <p className="text-sm text-[rgba(242,219,168,0.4)] italic">
      Fetching chronological tracking grid records...
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {items.map((originalItem) => {
        // Resolve whether this specific card position has been navigated to a alternative slide preview
        const activeId = previewIndexes[originalItem.id] || originalItem.id;
        const displayItem = items.find(i => i.id === activeId) || originalItem;

        return (
          <article 
            className={`bg-[#2C1A0E] border transition-all flex flex-col justify-between ${
              editingId === originalItem.id ? 'border-[#D4A843] shadow-md shadow-amber-500/10' : 'border-[rgba(212,168,67,0.1)]'
            }`} 
            key={originalItem.id}
          >
            
            {/* Image Context Container Layer incorporating Pagination Handles */}
            <div className="aspect-[16/10] bg-[#1A0E06] relative group overflow-hidden">
              <img 
                src={displayItem.image} 
                alt={displayItem.label} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" 
                loading="lazy" 
              />
              <span className="absolute top-2 left-2 bg-[#1A0E06]/85 backdrop-blur-sm border border-[#D4A843]/30 text-[#D4A843] text-[0.6rem] font-semibold tracking-wide uppercase px-2 py-0.5">
                {displayItem.category}
              </span>

              {/* Step Controls: Slide Browse Traversal updates preview tracking indexes inside categories */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <button 
                  onClick={(e) => { e.stopPropagation(); navigateCardPreview(displayItem, -1); }}
                  className="w-8 h-8 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center text-sm font-bold hover:bg-black/90 pointer-events-auto transition-transform hover:scale-105"
                  aria-label="View previous scope layout asset"
                  type="button"
                >
                  ←
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigateCardPreview(displayItem, 1); }}
                  className="w-8 h-8 rounded-full bg-black/60 text-white border border-white/20 flex items-center justify-center text-sm font-bold hover:bg-black/90 pointer-events-auto transition-transform hover:scale-105"
                  aria-label="View next scope layout asset"
                  type="button"
                >
                  →
                </button>
              </div>
            </div>

            {/* Card Descriptive Details */}
            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h3 className="font-['Cormorant_Garamond',serif] text-xl font-bold text-[#F2DBA8] mb-1">
                  {displayItem.label}
                </h3>
                <p className="text-xs text-[rgba(242,219,168,0.6)] line-clamp-3 leading-relaxed mb-4">
                  {displayItem.caption}
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-[0.72rem] text-[#D4A843] border-t border-[rgba(212,168,67,0.08)] pt-3 flex justify-between">
                  <span>📍 {displayItem.location}</span>
                  <span className="font-mono tracking-wider">INDEX: #{displayItem.id}</span>
                </div>

                {/* Action Interface Operations Array linked explicitly to original index reference parameters */}
                <div className="grid grid-cols-2 gap-2 border-t border-[rgba(212,168,67,0.08)] pt-3">
                  <button
                    type="button"
                    onClick={() => handleInitiateEdit(originalItem)}
                    disabled={isSubmitting}
                    className="bg-transparent border border-amber-500/40 text-[#D4A843] py-2 text-[0.7rem] font-semibold tracking-wider uppercase hover:bg-amber-500/10 transition-colors disabled:opacity-40"
                  >
                    Modify Fields
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteAsset(originalItem.id)}
                    disabled={isSubmitting}
                    className="bg-transparent border border-red-500/40 text-red-400 py-2 text-[0.7rem] font-semibold tracking-wider uppercase hover:bg-red-500/10 transition-colors disabled:opacity-40"
                  >
                    Purge Asset
                  </button>
                </div>
              </div>

            </div>
          </article>
        );
      })}
    </div>
  )}
</section>
      </main>
    </div>
  );
};

export default AdminGallery;