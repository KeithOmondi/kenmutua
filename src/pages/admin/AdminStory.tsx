import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchStoryContent,
  updateOriginContent,
  createTimelineEntry,
  updateTimelineEntry,
  deleteTimelineEntry,
  selectOriginContent,
  selectTimeline,
  selectStoryIsFetching,
  selectIsUpdatingOrigin,
  selectIsSubmittingEntry,
  selectStoryError,
  type TimelineEntryInput,
  type TimelineEntry,
} from '../../store/slice/storySlice';
import toast from 'react-hot-toast';

type OriginFormData = {
  origin_label: string;
  origin_title: string;
  origin_emphasis: string;
  origin_body: string;
  origin_quote: string;
  origin_detail: string;
};

const emptyOriginForm: OriginFormData = {
  origin_label: '',
  origin_title: '',
  origin_emphasis: '',
  origin_body: '',
  origin_quote: '',
  origin_detail: '',
};

const emptyTimelineForm: TimelineEntryInput = {
  year: '',
  heading: '',
  description: '',
  tag: '',
  dot: '',
  active: true,
  is_now: false,
  sort_order: 0,
};

const AdminStory = () => {
  const dispatch = useAppDispatch();
  const origin = useAppSelector(selectOriginContent);
  const timeline = useAppSelector(selectTimeline);
  const isFetching = useAppSelector(selectStoryIsFetching);
  const isUpdatingOrigin = useAppSelector(selectIsUpdatingOrigin);
  const isSubmitting = useAppSelector(selectIsSubmittingEntry);
  const error = useAppSelector(selectStoryError);

  // ─── Origin patch state ──────────────────────────────────────────
  const [originPatch, setOriginPatch] = useState<Partial<OriginFormData>>({});

  const mergedOrigin: OriginFormData = {
    origin_label: originPatch.origin_label ?? origin?.origin_label ?? emptyOriginForm.origin_label,
    origin_title: originPatch.origin_title ?? origin?.origin_title ?? emptyOriginForm.origin_title,
    origin_emphasis: originPatch.origin_emphasis ?? origin?.origin_emphasis ?? emptyOriginForm.origin_emphasis,
    origin_body: originPatch.origin_body ?? origin?.origin_body ?? emptyOriginForm.origin_body,
    origin_quote: originPatch.origin_quote ?? origin?.origin_quote ?? emptyOriginForm.origin_quote,
    origin_detail: originPatch.origin_detail ?? origin?.origin_detail ?? emptyOriginForm.origin_detail,
  };

  // ─── Timeline form state ─────────────────────────────────────────
  const [timelineForm, setTimelineForm] = useState<TimelineEntryInput>(emptyTimelineForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showTimelineForm, setShowTimelineForm] = useState(false);

  // ─── Effects ─────────────────────────────────────────────────────
  useEffect(() => {
    dispatch(fetchStoryContent());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // ─── Origin handlers ─────────────────────────────────────────────
  const handleOriginChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOriginPatch((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOriginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(updateOriginContent(mergedOrigin));
    if (updateOriginContent.fulfilled.match(result)) {
      toast.success('Origin content saved');
      setOriginPatch({});
    } else {
      toast.error('Failed to save origin content');
    }
  };

  // ─── Timeline handlers ───────────────────────────────────────────
  const handleTimelineChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setTimelineForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const resetTimelineForm = () => {
    setTimelineForm(emptyTimelineForm);
    setEditingId(null);
    setShowTimelineForm(false);
  };

  const handleEditTimeline = (entry: TimelineEntry) => {
    setTimelineForm({
      year: entry.year,
      heading: entry.heading,
      description: entry.description,
      tag: entry.tag,
      dot: entry.dot,
      active: entry.active,
      is_now: entry.is_now,
      sort_order: entry.sort_order,
    });
    setEditingId(entry.id);
    setShowTimelineForm(true);
  };

  const handleDeleteTimeline = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this timeline entry?')) {
      const result = await dispatch(deleteTimelineEntry(id));
      if (deleteTimelineEntry.fulfilled.match(result)) {
        toast.success('Timeline entry deleted');
      } else {
        toast.error('Failed to delete entry');
      }
    }
  };

  const handleTimelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let result;
    if (editingId) {
      result = await dispatch(updateTimelineEntry({ id: editingId, ...timelineForm }));
    } else {
      result = await dispatch(createTimelineEntry(timelineForm));
    }
    if (
      (createTimelineEntry.fulfilled.match(result) || updateTimelineEntry.fulfilled.match(result))
    ) {
      toast.success(editingId ? 'Timeline entry updated' : 'Timeline entry created');
      resetTimelineForm();
    } else {
      toast.error(editingId ? 'Failed to update entry' : 'Failed to create entry');
    }
  };

  if (isFetching && !origin) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-[#8a7e6e]">Loading story content...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="font-serif text-2xl text-[#1a2e1a]">Our Story</h1>
        <p className="text-sm text-[#8a7e6e] mt-1">
          Edit the "Our Story" page content – origin text and timeline.
        </p>
      </div>

      {/* ========== Origin Section ========== */}
      <form onSubmit={handleOriginSubmit} className="bg-white border border-[#e0d8cc] rounded-sm p-6 space-y-6">
        <h2 className="text-sm font-medium tracking-widest uppercase text-[#5a4e3e]">Origin Content</h2>

        <div>
          <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Section Label</label>
          <input
            type="text"
            name="origin_label"
            value={mergedOrigin.origin_label}
            onChange={handleOriginChange}
            className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27]"
          />
        </div>

        {/* Title as textarea to preserve line breaks */}
        <div>
          <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Title (line breaks allowed)</label>
          <textarea
            name="origin_title"
            value={mergedOrigin.origin_title}
            onChange={handleOriginChange}
            rows={3}
            className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] resize-vertical"
          />
          <p className="text-xs text-[#8a7e6e] mt-1">Use \n for line breaks. The frontend will convert them to &lt;br&gt;.</p>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Emphasis (wrapped in &lt;em&gt;)</label>
          <input
            type="text"
            name="origin_emphasis"
            value={mergedOrigin.origin_emphasis}
            onChange={handleOriginChange}
            className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27]"
          />
          <p className="text-xs text-[#8a7e6e] mt-1">Appears immediately after the title, inside italics.</p>
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Body</label>
          <textarea
            name="origin_body"
            value={mergedOrigin.origin_body}
            onChange={handleOriginChange}
            rows={4}
            className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] resize-vertical"
          />
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Quote</label>
          <textarea
            name="origin_quote"
            value={mergedOrigin.origin_quote}
            onChange={handleOriginChange}
            rows={2}
            className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] resize-vertical"
          />
        </div>

        <div>
          <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Detail (right column extra text)</label>
          <textarea
            name="origin_detail"
            value={mergedOrigin.origin_detail}
            onChange={handleOriginChange}
            rows={3}
            className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] resize-vertical"
          />
        </div>

        <div className="flex justify-end pt-2 border-t border-[#e0d8cc]">
          <button
            type="submit"
            disabled={isUpdatingOrigin}
            className="bg-[#2d5a27] hover:bg-[#1a3d16] disabled:opacity-60 text-white text-xs tracking-widest uppercase px-6 py-3 rounded-sm transition-colors"
          >
            {isUpdatingOrigin ? 'Saving...' : 'Save Origin'}
          </button>
        </div>
      </form>

      {/* ========== Timeline Section ========== */}
      <div className="bg-white border border-[#e0d8cc] rounded-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium tracking-widest uppercase text-[#5a4e3e]">Timeline</h2>
          <button
            type="button"
            onClick={() => {
              resetTimelineForm();
              setShowTimelineForm(true);
            }}
            className="text-xs text-[#2d5a27] hover:underline"
          >
            + Add entry
          </button>
        </div>

        <div className="space-y-4">
          {timeline.length === 0 ? (
            <p className="text-sm text-[#8a7e6e] text-center py-4">No timeline entries yet.</p>
          ) : (
            timeline.map((entry) => (
              <div key={entry.id} className="border border-[#e0d8cc] rounded-sm p-4 bg-[#fefcf8]">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-mono text-[#2d5a27]">{entry.year}</span>
                      {entry.is_now && (
                        <span className="text-xs bg-[#2d5a27] text-white px-2 py-0.5 rounded-full">Now</span>
                      )}
                      {entry.active && !entry.is_now && (
                        <span className="text-xs bg-[#8a7e6e] text-white px-2 py-0.5 rounded-full">Active</span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg text-[#1a2e1a]">{entry.heading}</h3>
                    <p className="text-sm text-[#5a4e3e]">{entry.description}</p>
                    <div className="flex gap-2 text-xs text-[#8a7e6e]">
                      <span>Tag: {entry.tag}</span>
                      <span>•</span>
                      <span>Dot: {entry.dot}</span>
                      <span>•</span>
                      <span>Order: {entry.sort_order}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditTimeline(entry)}
                      className="text-xs text-[#2d5a27] hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteTimeline(entry.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {showTimelineForm && (
          <div className="border-t border-[#e0d8cc] pt-6 mt-4">
            <h3 className="text-sm font-medium text-[#1a2e1a] mb-4">
              {editingId ? 'Edit Timeline Entry' : 'Add New Timeline Entry'}
            </h3>
            <form onSubmit={handleTimelineSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Year*</label>
                  <input
                    type="text"
                    name="year"
                    value={timelineForm.year}
                    onChange={handleTimelineChange}
                    required
                    className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Heading*</label>
                  <input
                    type="text"
                    name="heading"
                    value={timelineForm.heading}
                    onChange={handleTimelineChange}
                    required
                    className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Tag</label>
                  <input
                    type="text"
                    name="tag"
                    value={timelineForm.tag}
                    onChange={handleTimelineChange}
                    required
                    className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Dot text (e.g., "19", "★", "NOW")</label>
                  <input
                    type="text"
                    name="dot"
                    value={timelineForm.dot}
                    onChange={handleTimelineChange}
                    required
                    className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Sort order (number)</label>
                  <input
                    type="number"
                    name="sort_order"
                    value={timelineForm.sort_order}
                    onChange={handleTimelineChange}
                    className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <label className="flex items-center gap-2 text-xs text-[#5a4e3e]">
                    <input
                      type="checkbox"
                      name="active"
                      checked={timelineForm.active ?? false}
                      onChange={handleTimelineChange}
                    />
                    Active (gold dot)
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#5a4e3e]">
                    <input
                      type="checkbox"
                      name="is_now"
                      checked={timelineForm.is_now ?? false}
                      onChange={handleTimelineChange}
                    />
                    Is "Now" (green dot)
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1">Description*</label>
                <textarea
                  name="description"
                  value={timelineForm.description}
                  onChange={handleTimelineChange}
                  rows={3}
                  required
                  className="w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm resize-vertical"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetTimelineForm}
                  className="text-xs text-[#8a7e6e] hover:text-[#5a4e3e] px-3 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2d5a27] hover:bg-[#1a3d16] disabled:opacity-60 text-white text-xs tracking-widest uppercase px-4 py-2 rounded-sm"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Entry' : 'Create Entry'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStory;