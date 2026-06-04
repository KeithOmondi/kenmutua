import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchHeroContent,
  updateHeroContent,
  updateHeroImage,
  selectHeroContent,
  selectHeroIsFetching,
  selectHeroIsUpdating,
  selectHeroIsUploading,
  selectHeroError,
  type County,
} from '../../store/slice/heroSlice';
import toast from 'react-hot-toast';

// Local type for the hero form data (matches the fields we edit)
type HeroFormData = {
  tag_line: string;
  headline: string;
  headline_emphasis: string;
  subtitle: string;
  primary_btn_label: string;
  primary_btn_href: string;
  secondary_btn_label: string;
  secondary_btn_href: string;
  image_alt: string;
  counties: County[];
};

const AdminHero = () => {
  const dispatch = useAppDispatch();
  const content = useAppSelector(selectHeroContent);
  const isFetching = useAppSelector(selectHeroIsFetching);
  const isUpdating = useAppSelector(selectHeroIsUpdating);
  const isUploading = useAppSelector(selectHeroIsUploading);
  const error = useAppSelector(selectHeroError);

  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Patch state for unsaved edits (source of truth is Redux content)
  const [patch, setPatch] = useState<Partial<HeroFormData>>({});

  // Merge Redux content with local patch
  const form: HeroFormData = {
    tag_line: patch.tag_line ?? content?.tag_line ?? '',
    headline: patch.headline ?? content?.headline ?? '',
    headline_emphasis: patch.headline_emphasis ?? content?.headline_emphasis ?? '',
    subtitle: patch.subtitle ?? content?.subtitle ?? '',
    primary_btn_label: patch.primary_btn_label ?? content?.primary_btn_label ?? '',
    primary_btn_href: patch.primary_btn_href ?? content?.primary_btn_href ?? '',
    secondary_btn_label: patch.secondary_btn_label ?? content?.secondary_btn_label ?? '',
    secondary_btn_href: patch.secondary_btn_href ?? content?.secondary_btn_href ?? '',
    image_alt: patch.image_alt ?? content?.image_alt ?? '',
    counties: patch.counties ?? content?.counties ?? [],
  };

  // Fetch hero content on mount
  useEffect(() => {
    dispatch(fetchHeroContent());
  }, [dispatch]);

  // Show error toast if any
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Cleanup image preview URL on unmount or when imagePreview changes
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handlers for text fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPatch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handlers for counties
  const handleCountyChange = (index: number, field: keyof County, value: string) => {
    setPatch((prev) => {
      const updated = [...(prev.counties ?? content?.counties ?? [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, counties: updated };
    });
  };

  const addCounty = () => {
    setPatch((prev) => ({
      ...prev,
      counties: [
        ...(prev.counties ?? content?.counties ?? []),
        { name: '', label: 'County' },
      ],
    }));
  };

  const removeCounty = (index: number) => {
    setPatch((prev) => ({
      ...prev,
      counties: (prev.counties ?? content?.counties ?? []).filter((_, i) => i !== index),
    }));
  };

  // Image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Clean up previous preview if it was a blob
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;
    const result = await dispatch(updateHeroImage(imageFile));
    if (updateHeroImage.fulfilled.match(result)) {
      toast.success('Hero image updated');
      setImageFile(null);
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(null);
    } else {
      toast.error('Failed to upload image');
    }
  };

  // Submit text content
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateHeroContent(form));
    if (updateHeroContent.fulfilled.match(result)) {
      toast.success('Hero content saved');
      setPatch({}); // Clear local edits, content becomes source of truth
    } else {
      toast.error('Failed to save hero content');
    }
  };

  if (isFetching && !content) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#8a7e6e]">Loading hero content...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page title */}
      <div>
        <h1 className="font-serif text-2xl text-[#1a2e1a]">Hero Section</h1>
        <p className="text-sm text-[#8a7e6e] mt-1">
          Edit the public-facing hero content shown on the homepage.
        </p>
      </div>

      {/* Image upload */}
      <div className="bg-white border border-[#e0d8cc] rounded-sm p-6 space-y-4">
        <h2 className="text-sm font-medium tracking-widest uppercase text-[#5a4e3e]">
          Hero Image
        </h2>

        <div className="flex gap-6 items-start flex-wrap">
          <div className="w-48 h-32 bg-[#f5f0e8] border border-[#e0d8cc] rounded-sm overflow-hidden flex-shrink-0">
            {imagePreview ?? content?.image_url ? (
              <img
                src={imagePreview ?? content?.image_url ?? ''}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#8a7e6e]">
                No image
              </div>
            )}
          </div>

          <div className="space-y-3 flex-1">
            <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">
              Replace image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-[#5a4e3e] file:mr-4 file:py-2 file:px-4 file:border file:border-[#d0c8bc] file:rounded-sm file:text-xs file:font-medium file:bg-[#f5f0e8] file:text-[#5a4e3e] hover:file:bg-[#ede8de] file:cursor-pointer"
            />

            <div>
              <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">
                Image alt text
              </label>
              <input
                type="text"
                name="image_alt"
                value={form.image_alt}
                onChange={handleChange}
                placeholder="Ken Mutua with livestock on his farm"
                className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors"
              />
            </div>

            {imageFile && (
              <button
                onClick={handleImageUpload}
                disabled={isUploading}
                className="bg-[#2d5a27] hover:bg-[#1a3d16] disabled:opacity-60 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-sm transition-colors"
              >
                {isUploading ? 'Uploading...' : 'Upload Image'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Text content form */}
      <form onSubmit={handleSubmit} className="bg-white border border-[#e0d8cc] rounded-sm p-6 space-y-6">
        <h2 className="text-sm font-medium tracking-widest uppercase text-[#5a4e3e]">
          Text Content
        </h2>

        <div>
          <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">
            Tag line
          </label>
          <input
            type="text"
            name="tag_line"
            value={form.tag_line}
            onChange={handleChange}
            className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">
            Headline
          </label>
          <input
            type="text"
            name="headline"
            value={form.headline}
            onChange={handleChange}
            className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors"
          />
          <p className="text-xs text-[#8a7e6e] mt-1">
            The full headline text including the emphasis phrase.
          </p>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">
            Headline emphasis
          </label>
          <input
            type="text"
            name="headline_emphasis"
            value={form.headline_emphasis}
            onChange={handleChange}
            className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors"
          />
          <p className="text-xs text-[#8a7e6e] mt-1">
            The italic green phrase within the headline — must be an exact substring of the headline above.
          </p>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">
            Subtitle
          </label>
          <textarea
            name="subtitle"
            value={form.subtitle}
            onChange={handleChange}
            rows={3}
            className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">
              Primary button label
            </label>
            <input
              type="text"
              name="primary_btn_label"
              value={form.primary_btn_label}
              onChange={handleChange}
              className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">
              Primary button link
            </label>
            <input
              type="text"
              name="primary_btn_href"
              value={form.primary_btn_href}
              onChange={handleChange}
              className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">
              Secondary button label
            </label>
            <input
              type="text"
              name="secondary_btn_label"
              value={form.secondary_btn_label}
              onChange={handleChange}
              className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">
              Secondary button link
            </label>
            <input
              type="text"
              name="secondary_btn_href"
              value={form.secondary_btn_href}
              onChange={handleChange}
              className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs tracking-widest uppercase text-[#5a4e3e]">
              Counties
            </label>
            <button
              type="button"
              onClick={addCounty}
              className="text-xs text-[#2d5a27] hover:underline"
            >
              + Add county
            </button>
          </div>

          <div className="space-y-2">
            {form.counties.map((county, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  type="text"
                  value={county.name}
                  onChange={(e) => handleCountyChange(i, 'name', e.target.value)}
                  placeholder="Name"
                  className="flex-1 border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors"
                />
                <input
                  type="text"
                  value={county.label}
                  onChange={(e) => handleCountyChange(i, 'label', e.target.value)}
                  placeholder="Label"
                  className="w-28 border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => removeCounty(i)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors px-1"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#e0d8cc]">
          <button
            type="submit"
            disabled={isUpdating}
            className="bg-[#2d5a27] hover:bg-[#1a3d16] disabled:opacity-60 text-white text-xs tracking-widest uppercase px-6 py-3 rounded-sm transition-colors"
          >
            {isUpdating ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminHero;