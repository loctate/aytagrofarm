"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  createProduct,
  deleteProductAndImage,
  deleteProductImage,
  getProductImageUrl,
  listProductsForAdmin,
  setProductPublished,
  updateProduct,
  uploadProductImage,
  type ProductCreateInput,
  type ProductRecord,
} from "@/lib/appwrite/products";

import {
  formatProductPrice,
  getProductCategoryLabel,
  getProductStockStatusLabel,
  productCategoryOptions,
  productStockStatusOptions,
  slugifyProductName,
  type ProductCategory,
  type ProductStockStatus,
} from "@/lib/products/catalog";

type ProductFormState = {
  name: string;
  slug: string;
  category: ProductCategory;
  short_description: string;

  price_amount: string;
  unit_label: string;
  price_prefix: string;

  stock_status: ProductStockStatus;
  image_file_id: string;

  is_published: boolean;
  sort_order: string;
};

function createEmptyProductForm(): ProductFormState {
  return {
    name: "",
    slug: "",
    category: "daging_segar",
    short_description: "",

    price_amount: "",
    unit_label: "kg",
    price_prefix: "",

    stock_status: "available",
    image_file_id: "",

    is_published: false,
    sort_order: "0",
  };
}

function productToForm(
  product: ProductRecord,
): ProductFormState {
  return {
    name: product.name,
    slug: product.slug,
    category: product.category,
    short_description: product.short_description,

    price_amount: String(product.price_amount),
    unit_label: product.unit_label,
    price_prefix: product.price_prefix ?? "",

    stock_status: product.stock_status,
    image_file_id: product.image_file_id ?? "",

    is_published: product.is_published,
    sort_order: String(product.sort_order ?? 0),
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return (
    "Proses produk belum berhasil. " +
    "Periksa data dan koneksi Appwrite."
  );
}

function formatProductDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function AdminProductsPanel() {
  const [products, setProducts] = useState<
    ProductRecord[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [actionProductId, setActionProductId] =
    useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState<ProductCategory | "all">("all");

  const [editorOpen, setEditorOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState<ProductRecord | null>(null);

  const [form, setForm] =
    useState<ProductFormState>(
      createEmptyProductForm,
    );

  const [slugTouched, setSlugTouched] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [
    selectedFilePreview,
    setSelectedFilePreview,
  ] = useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [statusMessage, setStatusMessage] =
    useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const rows = await listProductsForAdmin();
      setProducts(rows);
    } catch (error) {
      console.error(
        "Gagal memuat daftar produk:",
        error,
      );

      setErrorMessage(
        "Daftar produk belum dapat dimuat. " +
          "Pastikan konfigurasi dan permission " +
          "table products sudah benar.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function initializeProducts() {
      try {
        const rows = await listProductsForAdmin();

        if (!active) {
          return;
        }

        setProducts(rows);
      } catch (error) {
        console.error(
          "Gagal memuat daftar produk:",
          error,
        );

        if (active) {
          setErrorMessage(
            "Daftar produk belum dapat dimuat. " +
              "Pastikan konfigurasi dan permission " +
              "table products sudah benar.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void initializeProducts();

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.slug,
        product.category,
        product.short_description,
        product.unit_label,
        product.stock_status,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !keyword ||
        searchableText.includes(keyword);

      const matchesCategory =
        categoryFilter === "all" ||
        product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, products, search]);

  const publishedCount = useMemo(
    () =>
      products.filter(
        (product) => product.is_published,
      ).length,
    [products],
  );

  const draftCount =
    products.length - publishedCount;

  function updateField<
    Key extends keyof ProductFormState,
  >(
    key: Key,
    value: ProductFormState[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const openCreateEditor = () => {
    setEditingProduct(null);
    setForm(createEmptyProductForm());
    setSlugTouched(false);
    setSelectedFile(null);
    setSelectedFilePreview("");
    setErrorMessage("");
    setStatusMessage("");
    setEditorOpen(true);
  };

  const openEditEditor = (
    product: ProductRecord,
  ) => {
    setEditingProduct(product);
    setForm(productToForm(product));
    setSlugTouched(true);
    setSelectedFile(null);
    setSelectedFilePreview("");
    setErrorMessage("");
    setStatusMessage("");
    setEditorOpen(true);
  };

  const closeEditor = () => {
    if (saving) {
      return;
    }

    setEditorOpen(false);
    setEditingProduct(null);
    setForm(createEmptyProductForm());
    setSlugTouched(false);
    setSelectedFile(null);
    setSelectedFilePreview("");
  };

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const name = event.currentTarget.value;

    setForm((current) => ({
      ...current,
      name,
      slug: slugTouched
        ? current.slug
        : slugifyProductName(name),
    }));
  };

  const handleSlugChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setSlugTouched(true);

    updateField(
      "slug",
      slugifyProductName(
        event.currentTarget.value,
      ),
    );
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.currentTarget.files?.[0] ?? null;

    setSelectedFile(file);

    if (!file) {
      setSelectedFilePreview("");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setSelectedFilePreview(
        typeof reader.result === "string"
          ? reader.result
          : "",
      );
    };

    reader.onerror = () => {
      setSelectedFilePreview("");
    };

    reader.readAsDataURL(file);
  };

  const saveProduct = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setSaving(true);
    setErrorMessage("");
    setStatusMessage("");

    let newImageFileId = "";
    let dataPersisted = false;

    try {
      let imageFileId =
        form.image_file_id.trim() || null;

      if (selectedFile) {
        const uploadedFile =
          await uploadProductImage(selectedFile);

        newImageFileId = uploadedFile.$id;
        imageFileId = uploadedFile.$id;
      }

      const payload: ProductCreateInput = {
        name: form.name,
        slug: form.slug,
        category: form.category,
        short_description:
          form.short_description,

        price_amount: Number(
          form.price_amount,
        ),
        unit_label: form.unit_label,
        price_prefix:
          form.price_prefix || null,

        stock_status: form.stock_status,
        image_file_id: imageFileId,

        is_published: form.is_published,
        sort_order: Number(
          form.sort_order || 0,
        ),
        price_updated_at:
          new Date().toISOString(),
      };

      if (editingProduct) {
        await updateProduct(
          editingProduct.$id,
          payload,
        );

        dataPersisted = true;

        if (
          selectedFile &&
          editingProduct.image_file_id &&
          editingProduct.image_file_id !==
            newImageFileId
        ) {
          try {
            await deleteProductImage(
              editingProduct.image_file_id,
            );
          } catch (error) {
            console.warn(
              "Produk sudah diperbarui, tetapi " +
                "gambar lama belum dapat dihapus:",
              error,
            );
          }
        }
      } else {
        await createProduct(payload);
        dataPersisted = true;
      }

      await loadProducts();

      setEditorOpen(false);
      setEditingProduct(null);
      setForm(createEmptyProductForm());
      setSlugTouched(false);
      setSelectedFile(null);
      setSelectedFilePreview("");

      setStatusMessage(
        editingProduct
          ? "Produk berhasil diperbarui."
          : "Produk baru berhasil ditambahkan.",
      );
    } catch (error) {
      console.error(
        "Gagal menyimpan produk:",
        error,
      );

      if (
        newImageFileId &&
        !dataPersisted
      ) {
        try {
          await deleteProductImage(
            newImageFileId,
          );
        } catch (cleanupError) {
          console.warn(
            "Gambar sementara belum berhasil " +
              "dibersihkan:",
            cleanupError,
          );
        }
      }

      setErrorMessage(
        getErrorMessage(error),
      );
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (
    product: ProductRecord,
  ) => {
    const nextPublished =
      !product.is_published;

    const confirmationMessage = nextPublished
      ? `Publikasikan produk "${product.name}"?`
      : `Jadikan produk "${product.name}" sebagai draft?`;

    if (
      !window.confirm(confirmationMessage)
    ) {
      return;
    }

    setActionProductId(product.$id);
    setErrorMessage("");
    setStatusMessage("");

    try {
      const updated =
        await setProductPublished(
          product.$id,
          nextPublished,
        );

      setProducts((current) =>
        current.map((item) =>
          item.$id === updated.$id
            ? updated
            : item,
        ),
      );

      setStatusMessage(
        nextPublished
          ? "Produk berhasil dipublikasikan."
          : "Produk berhasil dijadikan draft.",
      );
    } catch (error) {
      console.error(
        "Gagal mengubah status produk:",
        error,
      );

      setErrorMessage(
        getErrorMessage(error),
      );
    } finally {
      setActionProductId("");
    }
  };

  const removeProduct = async (
    product: ProductRecord,
  ) => {
    const confirmed = window.confirm(
      `Hapus produk "${product.name}" beserta gambarnya? ` +
        "Tindakan ini tidak dapat dibatalkan.",
    );

    if (!confirmed) {
      return;
    }

    setActionProductId(product.$id);
    setErrorMessage("");
    setStatusMessage("");

    try {
      await deleteProductAndImage(product);

      setProducts((current) =>
        current.filter(
          (item) => item.$id !== product.$id,
        ),
      );

      setStatusMessage(
        "Produk berhasil dihapus.",
      );
    } catch (error) {
      console.error(
        "Gagal menghapus produk:",
        error,
      );

      setErrorMessage(
        getErrorMessage(error),
      );
    } finally {
      setActionProductId("");
    }
  };

  const currentImageUrl =
    selectedFilePreview ||
    getProductImageUrl(
      form.image_file_id,
    );

  if (loading) {
    return (
      <div className="admin-placeholder-panel">
        <p>Memuat daftar produk...</p>
      </div>
    );
  }

  return (
    <section className="admin-activities-panel">
      <div className="admin-panel-heading">
        <div>
          <h2>Produk Turunan AYT Agro Farm</h2>
          <p>
            Kelola produk, harga eceran,
            foto, status stok, serta
            publish atau draft.
          </p>
        </div>

        <button
          type="button"
          className="admin-activity-primary-button"
          onClick={openCreateEditor}
        >
          Tambah Produk
        </button>
      </div>

      <div className="admin-stat-grid">
        <article>
          <span>Total Produk</span>
          <strong>{products.length}</strong>
        </article>

        <article>
          <span>Published</span>
          <strong>{publishedCount}</strong>
        </article>

        <article>
          <span>Draft</span>
          <strong>{draftCount}</strong>
        </article>

        <article>
          <span>Kategori</span>
          <strong>
            {productCategoryOptions.length}
          </strong>
        </article>
      </div>

      {errorMessage && (
        <div className="admin-activity-message is-error">
          {errorMessage}
        </div>
      )}

      {statusMessage && (
        <div className="admin-activity-message is-success">
          {statusMessage}
        </div>
      )}

      <div className="admin-activity-toolbar">
        <input
          type="search"
          placeholder="Cari nama atau deskripsi produk..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.currentTarget.value,
            )
          }
        />

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.currentTarget.value as
                | ProductCategory
                | "all",
            )
          }
        >
          <option value="all">
            Semua Kategori
          </option>

          {productCategoryOptions.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ),
          )}
        </select>
      </div>

      <div className="admin-activity-list">
        {filteredProducts.map(
          (product) => {
            const imageUrl =
              getProductImageUrl(
                product.image_file_id,
              );

            const actionLoading =
              actionProductId ===
              product.$id;

            return (
              <article
                key={product.$id}
                className="admin-activity-card"
              >
                <div className="admin-activity-card-image">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      fill
                      sizes="150px"
                      unoptimized
                    />
                  ) : (
                    <span>
                      Belum ada gambar produk
                    </span>
                  )}
                </div>

                <div className="admin-activity-card-body">
                  <div className="admin-activity-card-status">
                    <span>
                      {getProductCategoryLabel(
                        product.category,
                      )}
                    </span>

                    <strong
                      className={
                        product.is_published
                          ? "is-published"
                          : "is-draft"
                      }
                    >
                      {product.is_published
                        ? "Published"
                        : "Draft"}
                    </strong>
                  </div>

                  <h3>{product.name}</h3>

                  <p>
                    {product.short_description}
                  </p>

                  <small>
                    {formatProductPrice(product)}
                    {" · "}
                    {getProductStockStatusLabel(
                      product.stock_status,
                    )}
                    {" · "}
                    Harga diperbarui{" "}
                    {formatProductDate(
                      product.price_updated_at,
                    )}
                  </small>
                </div>

                <div className="admin-product-card-actions">
                  <button
                    type="button"
                    onClick={() =>
                      openEditEditor(product)
                    }
                    disabled={actionLoading}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void togglePublished(
                        product,
                      )
                    }
                    disabled={actionLoading}
                  >
                    {actionLoading
                      ? "Memproses..."
                      : product.is_published
                        ? "Jadikan Draft"
                        : "Publish"}
                  </button>

                  <button
                    type="button"
                    className="is-danger"
                    onClick={() =>
                      void removeProduct(product)
                    }
                    disabled={actionLoading}
                  >
                    Hapus
                  </button>
                </div>
              </article>
            );
          },
        )}

        {filteredProducts.length === 0 && (
          <div className="admin-placeholder-panel">
            <p>
              Belum ada produk yang sesuai
              dengan pencarian.
            </p>
          </div>
        )}
      </div>

      {editorOpen && (
        <div
          className="admin-activity-modal-backdrop"
          role="presentation"
          onClick={closeEditor}
        >
          <section
            className="admin-activity-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-product-editor-title"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <header className="admin-activity-modal-header">
              <div>
                <span>
                  {editingProduct
                    ? "Edit Produk"
                    : "Produk Baru"}
                </span>

                <h2 id="admin-product-editor-title">
                  {editingProduct
                    ? editingProduct.name
                    : "Tambah Produk Turunan"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
                aria-label="Tutup form produk"
              >
                ×
              </button>
            </header>

            <form
              className="admin-activity-form"
              onSubmit={saveProduct}
            >
              <div className="admin-activity-form-grid">
                <label>
                  <span>Nama produk</span>

                  <input
                    type="text"
                    required
                    maxLength={160}
                    value={form.name}
                    onChange={handleNameChange}
                    placeholder="Contoh: Daging Kambing Segar"
                  />
                </label>

                <label>
                  <span>Slug</span>

                  <input
                    type="text"
                    required
                    maxLength={180}
                    value={form.slug}
                    onChange={handleSlugChange}
                    placeholder="daging-kambing-segar"
                  />
                </label>

                <label>
                  <span>Kategori</span>

                  <select
                    required
                    value={form.category}
                    onChange={(event) =>
                      updateField(
                        "category",
                        event.currentTarget
                          .value as ProductCategory,
                      )
                    }
                  >
                    {productCategoryOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label>
                  <span>Status stok</span>

                  <select
                    required
                    value={form.stock_status}
                    onChange={(event) =>
                      updateField(
                        "stock_status",
                        event.currentTarget
                          .value as ProductStockStatus,
                      )
                    }
                  >
                    {productStockStatusOptions.map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                </label>

                <label>
                  <span>Harga eceran</span>

                  <input
                    type="number"
                    required
                    min={1}
                    step={1}
                    value={form.price_amount}
                    onChange={(event) =>
                      updateField(
                        "price_amount",
                        event.currentTarget.value,
                      )
                    }
                    placeholder="145000"
                  />
                </label>

                <label>
                  <span>Satuan harga</span>

                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={form.unit_label}
                    onChange={(event) =>
                      updateField(
                        "unit_label",
                        event.currentTarget.value,
                      )
                    }
                    placeholder="kg, botol 250 ml, karung"
                  />
                </label>

                <label>
                  <span>Awalan harga</span>

                  <input
                    type="text"
                    maxLength={30}
                    value={form.price_prefix}
                    onChange={(event) =>
                      updateField(
                        "price_prefix",
                        event.currentTarget.value,
                      )
                    }
                    placeholder="Contoh: Mulai"
                  />
                </label>

                <label>
                  <span>Urutan tampil</span>

                  <input
                    type="number"
                    min={0}
                    max={10000}
                    step={1}
                    value={form.sort_order}
                    onChange={(event) =>
                      updateField(
                        "sort_order",
                        event.currentTarget.value,
                      )
                    }
                  />
                </label>

                <label>
                  <span>Status publik</span>

                  <select
                    value={
                      form.is_published
                        ? "published"
                        : "draft"
                    }
                    onChange={(event) =>
                      updateField(
                        "is_published",
                        event.currentTarget.value ===
                          "published",
                      )
                    }
                  >
                    <option value="draft">
                      Simpan sebagai Draft
                    </option>

                    <option value="published">
                      Published
                    </option>
                  </select>
                </label>

                <label className="is-wide">
                  <span>Deskripsi singkat</span>

                  <textarea
                    required
                    rows={4}
                    maxLength={600}
                    value={
                      form.short_description
                    }
                    onChange={(event) =>
                      updateField(
                        "short_description",
                        event.currentTarget.value,
                      )
                    }
                    placeholder="Deskripsi singkat yang tampil pada kartu produk."
                  />

                  <small>
                    {
                      form.short_description
                        .length
                    }
                    /600
                  </small>
                </label>
              </div>

              <section className="admin-activity-photo-section">
                <div>
                  <h3>Foto utama produk</h3>

                  <p>
                    Gunakan satu foto JPG, JPEG,
                    PNG, atau WEBP maksimal 2 MB.
                    Produk Published wajib memiliki
                    foto.
                  </p>
                </div>

                <label className="admin-activity-upload-button">
                  <span>
                    {selectedFile ||
                    form.image_file_id
                      ? "Ganti Foto"
                      : "Pilih Foto"}
                  </span>

                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                  />
                </label>

                <div className="admin-product-image-preview">
                  {currentImageUrl ? (
                    <Image
                      src={currentImageUrl}
                      alt="Preview foto produk"
                      fill
                      sizes="360px"
                      unoptimized
                    />
                  ) : (
                    <span>
                      Preview foto produk akan
                      tampil di sini.
                    </span>
                  )}
                </div>

                {selectedFile && (
                  <small>
                    File dipilih:{" "}
                    {selectedFile.name}
                  </small>
                )}
              </section>

              {errorMessage && (
                <div className="admin-activity-message is-error">
                  {errorMessage}
                </div>
              )}

              <div className="admin-activity-form-actions">
                <button
                  type="button"
                  onClick={closeEditor}
                  disabled={saving}
                >
                  Batal
                </button>

                <span />

                <button
                  type="submit"
                  className="admin-activity-primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Menyimpan..."
                    : editingProduct
                      ? "Simpan Perubahan"
                      : "Tambah Produk"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}
