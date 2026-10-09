import React, { useEffect, useState } from "react";
import { Edit, Plus, Trash2, X } from "lucide-react";

import {
  createAdminFaq,
  createAdminFaqCategory,
  deleteAdminFaq,
  deleteAdminFaqCategory,
  getAdminFaqCategories,
  getAdminFaqs,
  updateAdminFaq,
} from "../../../../services/backend";

import "./AdminFAQ.css";

const emptyForm = {
  category_id: "",
  question: "",
  answer: "",
  is_featured: false,
  is_published: true,
  display_order: 0,
};

const AdminFAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [faqData, categoryData] = await Promise.all([
        getAdminFaqs(),
        getAdminFaqCategories(),
      ]);

      setFaqs(Array.isArray(faqData) ? faqData : faqData.results || []);
      setCategories(
        Array.isArray(categoryData) ? categoryData : categoryData.results || []
      );
    } catch (err) {
      setError(err.message || "Unable to load FAQ data.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      category_id: categories[0]?.id || "",
    });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);

    setForm({
      category_id: item.category?.id || "",
      question: item.question || "",
      answer: item.answer || "",
      is_featured: Boolean(item.is_featured),
      is_published: Boolean(item.is_published),
      display_order: item.display_order || 0,
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category_id || !form.question.trim() || !form.answer.trim()) {
      setError("Category, question and answer are required.");
      return;
    }

    const data = {
      ...form,
      category_id: Number(form.category_id),
      display_order: Number(form.display_order) || 0,
    };

    try {
      setError("");

      if (editingId) {
        await updateAdminFaq(editingId, data);
      } else {
        await createAdminFaq(data);
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to save FAQ.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await deleteAdminFaq(id);
      setFaqs((current) => current.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || "Unable to delete FAQ.");
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await createAdminFaqCategory({
        name: newCategory.trim(),
        display_order: categories.length,
        is_active: true,
      });

      setNewCategory("");
      await loadData();
    } catch (err) {
      setError(err.message || "Unable to add category.");
    }
  };

  const removeCategory = async (id) => {
    if (!window.confirm("Delete this FAQ category?")) return;

    try {
      await deleteAdminFaqCategory(id);
      await loadData();
    } catch (err) {
      setError(
        err.message ||
          "This category may still be used by existing FAQs."
      );
    }
  };

  return (
    <div className="admin-faq-page">
      <div className="admin-faq-header">
        <div>
          <span>CONTENT</span>
          <h1>FAQs</h1>
          <p>Manage frequently asked questions and categories.</p>
        </div>

        <button type="button" onClick={openAdd}>
          <Plus size={17} />
          Add FAQ
        </button>
      </div>

      {error && <p className="admin-faq-error">{error}</p>}

      <section className="admin-faq-category-section">
        <h2>Categories</h2>

        <div className="admin-faq-category-add">
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category"
          />

          <button type="button" onClick={addCategory}>
            Add
          </button>
        </div>

        <div className="admin-faq-category-list">
          {categories.map((category) => (
            <div key={category.id}>
              <span>{category.name}</span>

              <button
                type="button"
                onClick={() => removeCategory(category.id)}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {showForm && (
        <form className="admin-faq-form" onSubmit={handleSubmit}>
          <div className="admin-faq-form-header">
            <h2>{editingId ? "Edit FAQ" : "Add FAQ"}</h2>

            <button type="button" onClick={() => setShowForm(false)}>
              <X size={18} />
            </button>
          </div>

          <label>
            Category
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
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

          <label className="full">
            Question
            <input
              name="question"
              value={form.question}
              onChange={handleChange}
              maxLength={250}
              required
            />
          </label>

          <label className="full">
            Answer
            <textarea
              name="answer"
              value={form.answer}
              onChange={handleChange}
              rows="5"
              required
            />
          </label>

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

          <button type="submit" className="admin-faq-save">
            {editingId ? "Save Changes" : "Add FAQ"}
          </button>
        </form>
      )}

      <div className="admin-faq-list">
        {faqs.length === 0 ? (
          <p>No FAQs have been added yet.</p>
        ) : (
          faqs.map((item) => (
            <div className="admin-faq-item" key={item.id}>
              <div>
                <span>{item.category?.name || "Uncategorised"}</span>
                <strong>{item.question}</strong>
                <p>{item.answer}</p>
              </div>

              <div className="admin-faq-actions">
                <button type="button" onClick={() => openEdit(item)}>
                  <Edit size={16} />
                </button>

                <button type="button" onClick={() => handleDelete(item.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminFAQ;