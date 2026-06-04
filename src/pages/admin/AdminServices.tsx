import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  selectAllServices,
  type ServiceInput,
  type Service,
} from '../../store/slice/servicesSlice';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const emptyService: ServiceInput = {
  icon: '',
  name: '',
  description: '',
  tags: [],
  highlight: false,
  sort_order: 0,
};

const inputClass =
  'w-full border border-[#d0c8bc] rounded-sm px-3 py-2 text-sm text-[#1a2e1a] bg-transparent focus:outline-none focus:border-[#2d5a27] transition-colors placeholder-[#b0a898]';

const labelClass =
  'block text-xs tracking-widest uppercase text-[#5a4e3e] mb-1';

// ─── Modal ────────────────────────────────────────────────────────────────────

interface ServiceModalProps {
  form:        ServiceInput;
  editingId:   string | null;
  onChange:    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTagsChange:(e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit:    (e: React.FormEvent) => void;
  onClose:     () => void;
}

const ServiceModal = ({
  form, editingId, onChange, onTagsChange, onSubmit, onClose,
}: ServiceModalProps) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    />

    {/* Panel */}
    <div className="relative w-full max-w-lg bg-white rounded-sm shadow-xl overflow-y-auto max-h-[90vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0d8cc]">
        <h2 className="text-sm font-medium tracking-widest uppercase text-[#5a4e3e]">
          {editingId ? 'Edit Service' : 'New Service'}
        </h2>
        <button
          onClick={onClose}
          className="text-[#8a7e6e] hover:text-[#1a2e1a] transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="px-6 py-5 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Icon (emoji)</label>
            <input
              name="icon"
              placeholder="🐔"
              value={form.icon}
              onChange={onChange}
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Name</label>
            <input
              name="name"
              placeholder="Poultry purchase"
              value={form.name}
              onChange={onChange}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            name="description"
            placeholder="Describe this service..."
            value={form.description}
            onChange={onChange}
            rows={3}
            className={`${inputClass} resize-none`}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Tags</label>
          <input
            name="tags"
            placeholder="Chickens, Broilers, Free range"
            value={form.tags.join(', ')}
            onChange={onTagsChange}
            className={inputClass}
          />
          <p className="text-xs text-[#8a7e6e] mt-1">Comma separated values.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClass}>Sort order</label>
            <input
              type="number"
              name="sort_order"
              value={form.sort_order}
              onChange={onChange}
              className={inputClass}
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  type="checkbox"
                  name="highlight"
                  checked={form.highlight}
                  onChange={onChange}
                  className="sr-only"
                />
                <div className={`w-9 h-5 rounded-full transition-colors ${form.highlight ? 'bg-[#2d5a27]' : 'bg-[#d0c8bc]'}`} />
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.highlight ? 'translate-x-4' : ''}`} />
              </div>
              <span className="text-xs tracking-widest uppercase text-[#5a4e3e]">
                Highlight
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 pt-2 border-t border-[#e0d8cc]">
          <button
            type="submit"
            className="bg-[#2d5a27] hover:bg-[#1a3d16] text-white text-xs tracking-widest uppercase px-6 py-2.5 rounded-sm transition-colors"
          >
            {editingId ? 'Update' : 'Create'}
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
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminServices() {
  const dispatch = useAppDispatch();
  const services = useAppSelector(selectAllServices);
  const [form,       setForm]       = useState<ServiceInput>(emptyService);
  const [editingId,  setEditingId]  = useState<string | null>(null);
  const [showModal,  setShowModal]  = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = editingId
      ? await dispatch(updateService({ id: editingId, ...form }))
      : await dispatch(createService(form));

    if (createService.fulfilled.match(result) || updateService.fulfilled.match(result)) {
      toast.success(editingId ? 'Service updated' : 'Service created');
      setForm(emptyService);
      setEditingId(null);
      setShowModal(false);
    } else {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (service: Service) => {
    setForm({
      icon:        service.icon,
      name:        service.name,
      description: service.description,
      tags:        service.tags,
      highlight:   service.highlight,
      sort_order:  service.sort_order,
    });
    setEditingId(service.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this service?')) return;
    setDeletingId(id);
    await dispatch(deleteService(id));
    toast.success('Service deleted');
    setDeletingId(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyService);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Modal */}
      {showModal && (
        <ServiceModal
          form={form}
          editingId={editingId}
          onChange={handleChange}
          onTagsChange={handleTagsChange}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
      )}

      {/* Page title */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-2xl text-[#1a2e1a]">Services</h1>
          <p className="text-sm text-[#8a7e6e] mt-1">
            Manage the services displayed on the public site.
          </p>
        </div>
        <button
          onClick={() => { setForm(emptyService); setEditingId(null); setShowModal(true); }}
          className="bg-[#2d5a27] hover:bg-[#1a3d16] text-white text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-colors"
        >
          + Add Service
        </button>
      </div>

      {/* Services list */}
      {services.length === 0 ? (
        <div className="bg-white border border-[#e0d8cc] rounded-sm p-12 text-center">
          <p className="text-sm text-[#8a7e6e]">No services yet. Add your first one above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white border border-[#e0d8cc] rounded-sm px-5 py-4 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 bg-[#f5f0e8] border border-[#e0d8cc] rounded-sm flex items-center justify-center text-xl">
                  {service.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium text-[#1a2e1a]">{service.name}</h3>
                    {service.highlight && (
                      <span className="text-[10px] tracking-widest uppercase bg-[#2d5a27]/10 text-[#2d5a27] border border-[#2d5a27]/20 px-2 py-0.5 rounded-sm">
                        Highlighted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#8a7e6e] mt-0.5 line-clamp-2">{service.description}</p>
                  {service.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {service.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] tracking-wide bg-[#f5f0e8] border border-[#e0d8cc] text-[#8a7e6e] px-2 py-0.5 rounded-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-xs text-[#2d5a27] hover:underline transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  disabled={deletingId === service.id}
                  className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                >
                  {deletingId === service.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}