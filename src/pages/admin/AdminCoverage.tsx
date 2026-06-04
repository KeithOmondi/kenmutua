import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchCoverage,
  updateCoverageMain,
  createCounty,
  updateCounty,
  deleteCounty,
  selectCoverageMain,
  selectCoverageCounties,
  type County,
  type CoverageMain,
  type Stat,
} from '../../store/slice/coverageSlice';
import toast from 'react-hot-toast';
import { X, ChevronUp, ChevronDown, Plus, Trash2, Pencil } from 'lucide-react';

// ─── Shared styles ────────────────────────────────────────────────────────────

const inputClass =
  'w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors placeholder-[#b0a898]';

const labelClass =
  'block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1';

// ─── Modal wrapper ────────────────────────────────────────────────────────────

const Modal = ({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-lg bg-white rounded-sm shadow-xl overflow-y-auto max-h-[90vh]">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0d8cc]">
        <h2 className="text-sm font-medium tracking-widest uppercase text-[#5a4e3e]">{title}</h2>
        <button onClick={onClose} className="text-[#8a7e6e] hover:text-[#1a2e1a] transition-colors" aria-label="Close">
          <X size={18} />
        </button>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  </div>
);

// ─── Stats editor ─────────────────────────────────────────────────────────────

function StatsEditor({
  stats,
  onStatsChange,
}: {
  stats: Stat[];
  onStatsChange: (s: Stat[]) => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editNum,      setEditNum]      = useState('');
  const [editLabel,    setEditLabel]    = useState('');

  const addNewStat = () => {
    onStatsChange([...stats, { num: '', label: '' }]);
    setEditingIndex(stats.length);
    setEditNum('');
    setEditLabel('');
  };

  const startEdit = (idx: number) => {
    setEditingIndex(idx);
    setEditNum(stats[idx].num);
    setEditLabel(stats[idx].label);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const updated = [...stats];
    updated[editingIndex] = { num: editNum, label: editLabel };
    onStatsChange(updated);
    setEditingIndex(null);
  };

  const deleteStat = (idx: number) => {
    onStatsChange(stats.filter((_, i) => i !== idx));
    if (editingIndex === idx) setEditingIndex(null);
  };

  const moveStat = (idx: number, dir: 'up' | 'down') => {
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === stats.length - 1) return;
    const updated = [...stats];
    const target = dir === 'up' ? idx - 1 : idx + 1;
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    onStatsChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className={labelClass}>Statistics</label>
        <button
          type="button"
          onClick={addNewStat}
          className="flex items-center gap-1 text-xs text-[#2d5a27] hover:underline"
        >
          <Plus size={12} /> Add stat
        </button>
      </div>

      {stats.length === 0 && (
        <p className="text-xs text-[#8a7e6e] py-2">No stats yet.</p>
      )}

      <div className="space-y-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="border border-[#e0d8cc] rounded-sm p-3 bg-[#faf8f4]">
            {editingIndex === idx ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Number e.g. 2, 6+, 100%"
                  value={editNum}
                  onChange={(e) => setEditNum(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Label e.g. Counties Covered"
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  className={inputClass}
                />
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="bg-[#2d5a27] hover:bg-[#1a3d16] text-white text-xs tracking-widest uppercase px-4 py-1.5 rounded-sm transition-colors"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingIndex(null)}
                    className="border border-[#d0c8bc] text-[#5a4e3e] text-xs tracking-widest uppercase px-4 py-1.5 rounded-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-serif text-lg text-[#1a2e1a] mr-2">{stat.num}</span>
                  <span className="text-sm text-[#8a7e6e]">{stat.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => moveStat(idx, 'up')} className="text-[#8a7e6e] hover:text-[#1a2e1a]">
                    <ChevronUp size={14} />
                  </button>
                  <button type="button" onClick={() => moveStat(idx, 'down')} className="text-[#8a7e6e] hover:text-[#1a2e1a]">
                    <ChevronDown size={14} />
                  </button>
                  <button type="button" onClick={() => startEdit(idx)} className="text-[#2d5a27] hover:underline text-xs">
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteStat(idx)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── County items editor ──────────────────────────────────────────────────────

function CountyItemsEditor({
  items,
  onItemsChange,
}: {
  items: string[];
  onItemsChange: (items: string[]) => void;
}) {
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (!newItem.trim()) return;
    onItemsChange([...items, newItem.trim()]);
    setNewItem('');
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addItem())}
          placeholder="Add service item"
          className={inputClass}
        />
        <button
          type="button"
          onClick={addItem}
          className="bg-[#2d5a27] hover:bg-[#1a3d16] text-white text-xs tracking-widest uppercase px-3 rounded-sm transition-colors flex-shrink-0"
        >
          Add
        </button>
      </div>
      {items.length === 0 && (
        <p className="text-xs text-[#8a7e6e]">No items yet.</p>
      )}
      <ul className="space-y-1.5">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center justify-between text-sm text-[#1a2e1a] bg-[#faf8f4] border border-[#e0d8cc] px-3 py-1.5 rounded-sm"
          >
            <span>{item}</span>
            <button
              type="button"
              onClick={() => onItemsChange(items.filter((_, i) => i !== idx))}
              className="text-red-400 hover:text-red-600 ml-2"
            >
              <Trash2 size={12} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main content form ────────────────────────────────────────────────────────

const getInitialMainForm = (main: CoverageMain | null) => ({
  quote: main?.quote || '',
  body:  main?.body  || '',
  stats: main?.stats ? [...main.stats] : [],
});

function MainContentForm({
  main,
  onUpdate,
}: {
  main: CoverageMain | null;
  onUpdate: () => void;
}) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(() => getInitialMainForm(main));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    for (let i = 0; i < form.stats.length; i++) {
      if (!form.stats[i].num.trim() || !form.stats[i].label.trim()) {
        toast.error(`Stat ${i + 1} is missing a number or label.`);
        return;
      }
    }
    const result = await dispatch(updateCoverageMain(form));
    if (updateCoverageMain.fulfilled.match(result)) {
      toast.success('Main content updated');
      onUpdate();
    } else {
      toast.error('Update failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#e0d8cc] rounded-sm p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium tracking-widest uppercase text-[#5a4e3e]">
          Main Section
        </h2>
        <button
          type="button"
          onClick={() => setForm(getInitialMainForm(main))}
          className="text-xs text-[#8a7e6e] hover:text-[#1a2e1a] transition-colors"
        >
          Reset
        </button>
      </div>

      <div>
        <label className={labelClass}>Quote</label>
        <input
          value={form.quote}
          onChange={(e) => setForm((p) => ({ ...p, quote: e.target.value }))}
          className={inputClass}
          placeholder="The large italic quote"
          required
        />
        <p className="text-xs text-[#8a7e6e] mt-1">Shown as large italic text on the right side.</p>
      </div>

      <div>
        <label className={labelClass}>Body</label>
        <textarea
          value={form.body}
          onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
          rows={3}
          className={`${inputClass} resize-none`}
          placeholder="Explanatory text below the quote"
          required
        />
      </div>

      <StatsEditor
        stats={form.stats}
        onStatsChange={(s) => setForm((p) => ({ ...p, stats: s }))}
      />

      <div className="flex justify-end pt-2 border-t border-[#e0d8cc]">
        <button
          type="submit"
          className="bg-[#2d5a27] hover:bg-[#1a3d16] text-white text-xs tracking-widest uppercase px-6 py-2.5 rounded-sm transition-colors"
        >
          Save changes
        </button>
      </div>
    </form>
  );
}

// ─── County modal ─────────────────────────────────────────────────────────────

function CountyModal({
  county,
  onCountyChange,
  onSubmit,
  onClose,
}: {
  county: County;
  onCountyChange: (c: County) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}) {
  return (
    <Modal title={county.id ? 'Edit County' : 'New County'} onClose={onClose}>
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>County name</label>
          <input
            value={county.county_name}
            onChange={(e) => onCountyChange({ ...county, county_name: e.target.value })}
            className={inputClass}
            placeholder="e.g. Kitui"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Sort order</label>
          <input
            type="number"
            value={county.sort_order}
            onChange={(e) => onCountyChange({ ...county, sort_order: parseInt(e.target.value) })}
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Service items</label>
          <CountyItemsEditor
            items={county.items}
            onItemsChange={(items) => onCountyChange({ ...county, items })}
          />
        </div>

        <div className="flex gap-3 pt-2 border-t border-[#e0d8cc]">
          <button
            type="submit"
            className="bg-[#2d5a27] hover:bg-[#1a3d16] text-white text-xs tracking-widest uppercase px-6 py-2.5 rounded-sm transition-colors"
          >
            {county.id ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="border border-[#d0c8bc] text-[#5a4e3e] text-xs tracking-widest uppercase px-6 py-2.5 rounded-sm hover:border-[#8a7e6e] transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminCoverage() {
  const dispatch  = useAppDispatch();
  const main      = useAppSelector(selectCoverageMain);
  const counties  = useAppSelector(selectCoverageCounties);

  const [editingCounty,  setEditingCounty]  = useState<County | null>(null);
  const [deletingId,     setDeletingId]     = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchCoverage());
  }, [dispatch]);

  const refresh = () => dispatch(fetchCoverage());

  const moveCounty = async (index: number, dir: 'up' | 'down') => {
    if (dir === 'up'   && index === 0) return;
    if (dir === 'down' && index === counties.length - 1) return;
    const reordered = [...counties];
    const target = dir === 'up' ? index - 1 : index + 1;
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    for (const [idx, county] of reordered.entries()) {
      await dispatch(updateCounty({ id: county.id, sort_order: idx }));
    }
    refresh();
    toast.success('Order updated');
  };

  const handleCountySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCounty) return;
    const result = editingCounty.id
      ? await dispatch(updateCounty(editingCounty))
      : await dispatch(createCounty({
          county_name: editingCounty.county_name,
          items:       editingCounty.items,
          sort_order:  editingCounty.sort_order,
        }));

    if (createCounty.fulfilled.match(result) || updateCounty.fulfilled.match(result)) {
      toast.success(editingCounty.id ? 'County updated' : 'County created');
      setEditingCounty(null);
      refresh();
    } else {
      toast.error('Operation failed');
    }
  };

  const handleDeleteCounty = async (id: string) => {
    if (!window.confirm('Delete this county?')) return;
    setDeletingId(id);
    await dispatch(deleteCounty(id));
    toast.success('County deleted');
    setDeletingId(null);
    refresh();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* County modal */}
      {editingCounty && (
        <CountyModal
          county={editingCounty}
          onCountyChange={setEditingCounty}
          onSubmit={handleCountySubmit}
          onClose={() => setEditingCounty(null)}
        />
      )}

      {/* Page title */}
      <div>
        <h1 className="font-serif text-2xl text-[#1a2e1a]">Coverage</h1>
        <p className="text-sm text-[#8a7e6e] mt-1">
          Manage the coverage section shown on the public site.
        </p>
      </div>

      {/* Main content form */}
      <MainContentForm key={main?.updated_at || 'initial'} main={main} onUpdate={refresh} />

      {/* Counties */}
      <div className="bg-white border border-[#e0d8cc] rounded-sm p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium tracking-widest uppercase text-[#5a4e3e]">
            Counties
          </h2>
          <button
            onClick={() =>
              setEditingCounty({
                id:          '',
                county_name: '',
                items:       [],
                sort_order:  counties.length,
              })
            }
            className="flex items-center gap-1.5 bg-[#2d5a27] hover:bg-[#1a3d16] text-white text-xs tracking-widest uppercase px-4 py-2 rounded-sm transition-colors"
          >
            <Plus size={12} /> Add county
          </button>
        </div>

        {counties.length === 0 ? (
          <p className="text-sm text-[#8a7e6e] py-4 text-center">
            No counties yet. Add your first one above.
          </p>
        ) : (
          <div className="space-y-3">
            {counties.map((county, idx) => (
              <div
                key={county.id}
                className="border border-[#e0d8cc] rounded-sm px-5 py-4 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  {/* Order controls */}
                  <div className="flex flex-col gap-0.5 flex-shrink-0 mt-0.5">
                    <button
                      onClick={() => moveCounty(idx, 'up')}
                      disabled={idx === 0}
                      className="text-[#8a7e6e] hover:text-[#1a2e1a] disabled:opacity-30 transition-colors"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      onClick={() => moveCounty(idx, 'down')}
                      disabled={idx === counties.length - 1}
                      className="text-[#8a7e6e] hover:text-[#1a2e1a] disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-[#1a2e1a]">{county.county_name}</h3>
                    {county.items.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {county.items.map((item, i) => (
                          <span
                            key={i}
                            className="text-[10px] tracking-wide bg-[#f5f0e8] border border-[#e0d8cc] text-[#8a7e6e] px-2 py-0.5 rounded-sm"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => setEditingCounty(county)}
                    className="text-[#2d5a27] hover:text-[#1a3d16] transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteCounty(county.id)}
                    disabled={deletingId === county.id}
                    className="text-red-400 hover:text-red-600 disabled:opacity-50 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}