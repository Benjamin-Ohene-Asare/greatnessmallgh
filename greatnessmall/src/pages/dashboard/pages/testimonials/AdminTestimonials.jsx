import React, { useEffect, useState } from "react";
import { Edit, Plus, Trash2, X } from "lucide-react";

import {
  createAdminTestimonial,
  deleteAdminTestimonial,
  getAdminTestimonials,
  updateAdminTestimonial,
} from "../../../../services/backend";

import "./AdminTestimonials.css";

const emptyForm = {
  customer_name: "",
  customer_title: "",
  testimonial_type: "video",
  message: "",
  video_url: "",
  video_file: null,
  image: null,
  audio_file: null,
  thumbnail: null,
  is_featured: false,
  is_published: true,
  display_order: 0,
};

const AdminTestimonials = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getAdminTestimonials();
      setItems(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      setError(err.message || "Unable to load testimonials.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files?.[0] || null
          : value,
    }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError("");
  };

  const openEdit = (item) => {
    setEditingId(item.id);

    setForm({
      customer_name: item.customer_name || "",
      customer_title: item.customer_title || "",
      testimonial_type: item.testimonial_type || "video",
      message: item.message || "",
      video_url: item.video_url || "",
      video_file: null,
      image: null,
      audio_file: null,
      thumbnail: null,
      is_featured: Boolean(item.is_featured),
      is_published: Boolean(item.is_published),
      display_order: item.display_order || 0,
    });

    setShowForm(true);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.customer_name.trim()) {
      setError("Customer name is required.");
      return;
    }

    const data = new FormData();

    data.append("customer_name", form.customer_name.trim());
    data.append("customer_title", form.customer_title.trim());
    data.append("testimonial_type", form.testimonial_type);
    data.append("message", form.message.trim());
    data.append("video_url", form.video_url.trim());
    data.append("is_featured", String(form.is_featured));
    data.append("is_published", String(form.is_published));
    data.append("display_order", String(form.display_order || 0));

    if (form.video_file) data.append("video_file", form.video_file);
    if (form.image) data.append("image", form.image);
    if (form.audio_file) data.append("audio_file", form.audio_file);
    if (form.thumbnail) data.append("thumbnail", form.thumbnail);

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await updateAdminTestimonial(editingId, data);
      } else {
        await createAdminTestimonial(data);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
      await loadTestimonials();
    } catch (err) {
      setError(err.message || "Unable to save testimonial.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this testimonial?")) return;

    try {
      await deleteAdminTestimonial(id);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete testimonial.");
    }
  };

  return (
    <div className="admin-testimonials-page">
      <div className="admin-testimonials-header">
        <div>
          <span>CONTENT</span>
          <h1>Testimonials</h1>
          <p>Manage customer video, image and audio testimonials.</p>
        </div>

        <button type="button" onClick={openAdd}>
          <Plus size={17} />
          Add Testimonial
        </button>
      </div>

      {error && <p className="admin-testimonials-error">{error}</p>}

      {showForm && (
        <form className="admin-testimonials-form" onSubmit={handleSubmit}>
          <div className="admin-testimonials-form-header">
            <h2>{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>

            <button type="button" onClick={() => setShowForm(false)}>
              <X size={18} />
            </button>
          </div>

          <label>
            Customer Name
            <input
              name="customer_name"
              value={form.customer_name}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </label>

          <label>
            Customer Title
            <input
              name="customer_title"
              value={form.customer_title}
              onChange={handleChange}
              maxLength={150}
            />
          </label>

          <label className="full">
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="4"
            />
          </label>

          <label>
            Testimonial Type
            <select
              name="testimonial_type"
              value={form.testimonial_type}
              onChange={handleChange}
            >
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
            </select>
          </label>

          <label>
            Display Order
            <input
              type="number"
              name="display_order"
              min="0"
              value={form.display_order}
              onChange={handleChange}
            />
          </label>

          {form.testimonial_type === "video" && (
            <>
              <label>
                Video URL
                <input
                  type="url"
                  name="video_url"
                  value={form.video_url}
                  onChange={handleChange}
                  placeholder="YouTube or video link"
                />
              </label>

              <label>
                Or Upload Video
                <input
                  type="file"
                  name="video_file"
                  accept=".mp4,.webm,.mov,video/*"
                  onChange={handleChange}
                />
              </label>

              <label>
                Thumbnail
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleChange}
                />
              </label>
            </>
          )}

          {form.testimonial_type === "image" && (
            <label>
              Testimonial Image
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleChange}
              />
            </label>
          )}

          {form.testimonial_type === "audio" && (
            <label>
              Audio File
              <input
                type="file"
                name="audio_file"
                accept=".mp3,.wav,.m4a,.ogg,audio/*"
                onChange={handleChange}
              />
            </label>
          )}

          <label className="checkbox">
            <input
              type="checkbox"
              name="is_featured"
              checked={form.is_featured}
              onChange={handleChange}
            />
            Featured
          </label>

          <label className="checkbox">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={handleChange}
            />
            Published
          </label>

          <button type="submit" className="admin-testimonials-save" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Save Changes" : "Add Testimonial"}
          </button>
        </form>
      )}

      {loading ? (
        <p>Loading testimonials...</p>
      ) : items.length === 0 ? (
        <p>No testimonials have been added yet.</p>
      ) : (
        <div className="admin-testimonials-list">
          {items.map((item) => (
            <div className="admin-testimonial-item" key={item.id}>
              <div>
                <strong>{item.customer_name}</strong>
                <span>{item.testimonial_type}</span>
                <span>{item.is_published ? "Published" : "Draft"}</span>
                {item.is_featured && <span>Featured</span>}
              </div>

              <div className="admin-testimonial-actions">
                <button type="button" onClick={() => openEdit(item)}>
                  <Edit size={16} />
                </button>

                <button type="button" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;