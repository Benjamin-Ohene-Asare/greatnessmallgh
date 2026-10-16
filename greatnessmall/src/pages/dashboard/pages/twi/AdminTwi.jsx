import React, {
  useEffect,
  useState,
} from "react";

import {
  Edit,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  createAdminTwiContent,
  deleteAdminTwiContent,
  getAdminProducts,
  getAdminTwiContent,
  updateAdminTwiContent,
} from "../../../../services/backend";

import "./AdminTwi.css";


const emptyForm = {
  title: "",
  english_title: "",
  short_description: "",
  content_type: "video",
  video_url: "",
  audio_file: null,
  image: null,
  product_id: "",
  is_featured: false,
  is_published: true,
  display_order: 0,
};


const AdminTwi = () => {
  const [
    items,
    setItems,
  ] = useState([]);

  const [
    products,
    setProducts,
  ] = useState([]);

  const [
    form,
    setForm,
  ] = useState(emptyForm);

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");


  const loadContent = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        twiData,
        productData,
      ] = await Promise.all([
        getAdminTwiContent(),
        getAdminProducts(),
      ]);

      setItems(
        Array.isArray(twiData)
          ? twiData
          : twiData?.results || []
      );

      setProducts(
        Array.isArray(productData)
          ? productData
          : productData?.results || []
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to load Twi content."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadContent();
  }, []);


  const handleChange = (event) => {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = event.target;

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
      title:
        item.title || "",

      english_title:
        item.english_title || "",

      short_description:
        item.short_description || "",

      content_type:
        item.content_type || "video",

      video_url:
        item.video_url || "",

      audio_file: null,
      image: null,

      product_id:
        item.product?.id
          ? String(item.product.id)
          : "",

      is_featured:
        Boolean(item.is_featured),

      is_published:
        Boolean(item.is_published),

      display_order:
        item.display_order || 0,
    });

    setShowForm(true);
    setError("");
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError(
        "Twi / Akan title is required."
      );
      return;
    }

    if (
      form.content_type === "video" &&
      !form.video_url.trim()
    ) {
      setError(
        "Video URL is required."
      );
      return;
    }

    if (
      form.content_type === "audio" &&
      !editingId &&
      !form.audio_file
    ) {
      setError(
        "Audio file is required."
      );
      return;
    }

    if (
      form.content_type === "audio" &&
      !form.product_id
    ) {
      setError(
        "Select the product this audio belongs to."
      );
      return;
    }

    if (
      form.content_type === "image" &&
      !editingId &&
      !form.image
    ) {
      setError(
        "Image is required."
      );
      return;
    }

    const data =
      new FormData();

    data.append(
      "title",
      form.title.trim()
    );

    data.append(
      "english_title",
      form.english_title.trim()
    );

    data.append(
      "short_description",
      form.short_description.trim()
    );

    data.append(
      "content_type",
      form.content_type
    );

    data.append(
      "video_url",
      form.content_type === "video"
        ? form.video_url.trim()
        : ""
    );

    /*
     * Audio content must be linked to a real product
     * so its final-10-seconds order button can open
     * the correct product page.
     *
     * Video and image content may optionally be linked.
     */
    if (form.product_id) {
      data.append(
        "product_id",
        form.product_id
      );
    } else if (editingId) {
      data.append(
        "product_id",
        ""
      );
    }

    data.append(
      "is_featured",
      String(form.is_featured)
    );

    data.append(
      "is_published",
      String(form.is_published)
    );

    data.append(
      "display_order",
      String(
        form.display_order || 0
      )
    );

    if (form.audio_file) {
      data.append(
        "audio_file",
        form.audio_file
      );
    }

    if (form.image) {
      data.append(
        "image",
        form.image
      );
    }

    try {
      setSaving(true);
      setError("");

      if (editingId) {
        await updateAdminTwiContent(
          editingId,
          data
        );
      } else {
        await createAdminTwiContent(
          data
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadContent();
    } catch (err) {
      setError(
        err.message ||
          "Unable to save Twi content."
      );
    } finally {
      setSaving(false);
    }
  };


  const handleDelete = async (
    id
  ) => {
    if (
      !window.confirm(
        "Delete this Twi content?"
      )
    ) {
      return;
    }

    try {
      await deleteAdminTwiContent(
        id
      );

      setItems(
        (current) =>
          current.filter(
            (item) =>
              item.id !== id
          )
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete content."
      );
    }
  };


  return (
    <div className="admin-twi-page">
      <div className="admin-twi-header">
        <div>
          <span>
            CONTENT
          </span>

          <h1>
            Twi Content
          </h1>

          <p>
            Manage Twi videos, audio
            and image content.
          </p>
        </div>

        <button
          type="button"
          onClick={openAdd}
        >
          <Plus size={17} />
          Add Content
        </button>
      </div>


      {error && (
        <p role="alert">
          {error}
        </p>
      )}


      {showForm && (
        <form
          className="admin-twi-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-twi-form-header">
            <h2>
              {editingId
                ? "Edit Content"
                : "Add Twi Content"}
            </h2>

            <button
              type="button"
              onClick={() =>
                setShowForm(false)
              }
              aria-label="Close form"
            >
              <X size={18} />
            </button>
          </div>


          <label>
            Twi / Akan Title

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              maxLength={180}
              placeholder="Example: Ahoɔden ne Apɔmuden"
              required
            />
          </label>


          <label>
            English Title

            <input
              name="english_title"
              value={
                form.english_title
              }
              onChange={handleChange}
              maxLength={180}
              placeholder="Example: Strength and Good Health"
            />
          </label>


          <label>
            Short Description

            <textarea
              name="short_description"
              value={
                form.short_description
              }
              onChange={handleChange}
              rows="4"
            />
          </label>


          <label>
            Content Type

            <select
              name="content_type"
              value={
                form.content_type
              }
              onChange={handleChange}
            >
              <option value="video">
                Video
              </option>

              <option value="audio">
                Audio
              </option>

              <option value="image">
                Image
              </option>
            </select>
          </label>


          <label>
            Related Product

            <select
              name="product_id"
              value={
                form.product_id
              }
              onChange={handleChange}
              required={
                form.content_type ===
                "audio"
              }
            >
              <option value="">
                {form.content_type ===
                "audio"
                  ? "Select the product for this audio"
                  : "No product selected"}
              </option>

              {products.map(
                (product) => (
                  <option
                    key={
                      product.id
                    }
                    value={
                      product.id
                    }
                  >
                    {product.name}
                    {!product.is_published
                      ? " (Draft)"
                      : ""}
                  </option>
                )
              )}
            </select>

            <small>
              {form.content_type ===
              "audio"
                ? "Required. The order button shown near the end of the audio will open this product."
                : "Optional. Link this Twi content to a product if it explains a specific product."}
            </small>
          </label>


          {form.content_type ===
            "video" && (
            <label>
              Video URL

              <input
                type="url"
                name="video_url"
                value={
                  form.video_url
                }
                onChange={
                  handleChange
                }
                placeholder="YouTube video URL"
              />
            </label>
          )}


          {form.content_type ===
            "audio" && (
            <label>
              Audio File

              <input
                type="file"
                name="audio_file"
                accept="audio/*"
                onChange={
                  handleChange
                }
              />

              {editingId && (
                <small>
                  Leave empty to keep
                  the current audio.
                </small>
              )}
            </label>
          )}


          {form.content_type ===
            "audio" && (
            <label>
              Cover Image

              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleChange
                }
              />

              <small>
                Optional. Add an image
                to display above the
                audio player.
              </small>
            </label>
          )}


          {form.content_type ===
            "image" && (
            <label>
              Image

              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleChange
                }
              />

              {editingId && (
                <small>
                  Leave empty to keep
                  the current image.
                </small>
              )}
            </label>
          )}


          <label>
            Display Order

            <input
              type="number"
              name="display_order"
              min="0"
              value={
                form.display_order
              }
              onChange={
                handleChange
              }
            />
          </label>


          <label>
            <input
              type="checkbox"
              name="is_featured"
              checked={
                form.is_featured
              }
              onChange={
                handleChange
              }
            />

            Featured
          </label>


          <label>
            <input
              type="checkbox"
              name="is_published"
              checked={
                form.is_published
              }
              onChange={
                handleChange
              }
            />

            Published
          </label>


          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
              ? "Save Changes"
              : "Add Content"}
          </button>
        </form>
      )}


      {loading ? (
        <p>
          Loading content...
        </p>
      ) : items.length === 0 ? (
        <p>
          No Twi content has been
          added yet.
        </p>
      ) : (
        <div className="admin-twi-list">
          {items.map(
            (item) => (
              <div
                key={item.id}
                className="admin-twi-item"
              >
                <div>
                  <strong>
                    {item.title}
                  </strong>

                  {item.english_title && (
                    <span>
                      {
                        item.english_title
                      }
                    </span>
                  )}

                  <span>
                    {
                      item.content_type
                    }
                  </span>

                  {item.product && (
                    <span>
                      Product:{" "}
                      {
                        item.product
                          .name
                      }
                    </span>
                  )}

                  <span>
                    {item.is_published
                      ? "Published"
                      : "Draft"}
                  </span>

                  {item.is_featured && (
                    <span>
                      Featured
                    </span>
                  )}
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() =>
                      openEdit(
                        item
                      )
                    }
                    aria-label={`Edit ${item.title}`}
                  >
                    <Edit
                      size={16}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(
                        item.id
                      )
                    }
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2
                      size={16}
                    />
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};


export default AdminTwi;
