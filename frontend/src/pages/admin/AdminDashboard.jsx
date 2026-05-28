import { useEffect, useMemo, useState } from "react";
import { Boxes, CreditCard, LayoutDashboard, MessageSquareText, PackagePlus, ShoppingCart, Tags, Upload, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const emptyProduct = {
  name: "",
  description: "",
  price: "",
  category: "Crochet",
  stock: "",
  images: [],
  handmade: true,
  isFeatured: true,
  isBestSeller: false
};

const emptyCategory = {
  name: "",
  apiCategory: "",
  subtitle: "",
  image: ""
};

const chartData = [
  { name: "Mon", sales: 5400 },
  { name: "Tue", sales: 7600 },
  { name: "Wed", sales: 4800 },
  { name: "Thu", sales: 9200 },
  { name: "Fri", sales: 11000 }
];

const AdminDashboard = () => {
  const { logoutAdmin } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [categoryForm, setCategoryForm] = useState(emptyCategory);
  const [editingId, setEditingId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [message, setMessage] = useState("");

  const revenue = useMemo(
    () => payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    [payments]
  );

  const loadAdminData = async () => {
    try {
      const [productRes, statsRes, ordersRes, paymentsRes, customersRes, feedbackRes, notificationsRes, categoryRes] = await Promise.allSettled([
        api.get("/products"),
        api.get("/admin/stats"),
        api.get("/orders"),
        api.get("/payments"),
        api.get("/admin/customers"),
        api.get("/admin/feedback"),
        api.get("/admin/notifications"),
        api.get("/categories")
      ]);

      if (productRes.status === "fulfilled") setProducts(productRes.value.data.products || productRes.value.data);
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value.data);
      if (paymentsRes.status === "fulfilled") setPayments(paymentsRes.value.data);
      if (customersRes.status === "fulfilled") setCustomers(customersRes.value.data);
      if (feedbackRes.status === "fulfilled") setFeedback(feedbackRes.value.data);
      if (notificationsRes.status === "fulfilled") setNotifications(notificationsRes.value.data);
      if (categoryRes.status === "fulfilled") setCategories(categoryRes.value.data);
    } catch {
      setMessage("Backend data could not be loaded. Sample data is shown.");
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleLogout = () => {
    logoutAdmin();
    navigate("/login");
  };

  const changeForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const changeCategoryForm = (field, value) => {
    setCategoryForm((current) => ({ ...current, [field]: value }));
  };

  const saveProduct = async (event) => {
    event.preventDefault();
    try {
      if (!form.images.length) {
        setMessage("Please upload your own product image before saving.");
        return;
      }
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images
      };
      if (editingId) await api.put(`/products/${editingId}`, payload);
      else await api.post("/products", payload);
      setForm(emptyProduct);
      setEditingId(null);
      await loadAdminData();
      setActive("Products");
      setMessage("Product saved successfully. It is now loaded from database products.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save product. Check admin login and backend.");
    }
  };

  const editProduct = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      images: product.images || [],
      handmade: product.handmade,
      isFeatured: product.isFeatured,
      isBestSeller: product.isBestSeller
    });
    setActive("Add Products");
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((current) => current.filter((product) => product._id !== id));
      setMessage("Product deleted.");
    } catch {
      setMessage("Delete failed. Check admin login and backend.");
    }
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...categoryForm,
        apiCategory: categoryForm.apiCategory || categoryForm.name
      };
      if (editingCategoryId) await api.put(`/categories/${editingCategoryId}`, payload);
      else await api.post("/categories", payload);
      setCategoryForm(emptyCategory);
      setEditingCategoryId(null);
      await loadAdminData();
      setMessage("Category saved successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Could not save category.");
    }
  };

  const editCategory = (category) => {
    setEditingCategoryId(category._id);
    setCategoryForm({
      name: category.name,
      apiCategory: category.apiCategory,
      subtitle: category.subtitle || "",
      image: category.image || ""
    });
    setActive("Categories");
  };

  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories((current) => current.filter((category) => category._id !== id));
      setMessage("Category deleted.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed. Move products out of this category first.");
    }
  };

  const uploadImage = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await api.post("/products/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm((current) => ({
        ...current,
        images: editingId ? [res.data] : [...current.images, res.data]
      }));
      setMessage(
        editingId
          ? "New photo uploaded. Click Save Product to replace the old product photo."
          : "Image uploaded to Cloudinary. Now fill product details and click Save Product."
      );
    } catch {
      setMessage("Image upload failed. Check Cloudinary keys and admin login.");
    }
  };

  const uploadCategoryImage = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("image", file);
    try {
      const res = await api.post("/products/upload", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setCategoryForm((current) => ({ ...current, image: res.data.url }));
      setMessage("Category image uploaded. Save the category to apply it.");
    } catch {
      setMessage("Category image upload failed. Check Cloudinary keys and admin login.");
    }
  };

  const updateOrderStatus = async (orderId, orderStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { orderStatus });
      setOrders((current) => current.map((order) => (order._id === orderId ? res.data : order)));
      setMessage("Order status updated.");
    } catch {
      setMessage("Could not update order status.");
    }
  };

  const navItems = [
    [LayoutDashboard, "Dashboard"],
    [PackagePlus, "Add Products"],
    [Boxes, "Products"],
    [Tags, "Categories"],
    [ShoppingCart, "Orders"],
    [CreditCard, "Payments"],
    [MessageSquareText, "Reviews"],
    [Upload, "Image Uploads"],
    [Users, "Customers"]
  ];

  return (
    <div className="min-h-screen bg-[#fbf4ea] text-cocoa lg:grid lg:grid-cols-[280px_1fr]">
      <aside className="border-r border-cocoa/10 bg-white/70 p-6 backdrop-blur">
        <h1 className="font-display text-3xl text-blush">Blossom Admin</h1>
        <nav className="mt-8 grid gap-2">
          {navItems.map(([Icon, label]) => (
            <button
              key={label}
              onClick={() => setActive(label)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition ${active === label ? "bg-petal font-semibold" : "hover:bg-petal"}`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <div className="mt-8 grid gap-3">
          <Link to="/" className="rounded-2xl bg-petal px-4 py-3 text-center font-semibold">Open Store</Link>
          <button onClick={handleLogout} className="rounded-2xl bg-cocoa px-4 py-3 font-semibold text-white">Logout</button>
        </div>
      </aside>

      <main className="p-5 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-cocoa/50">Admin Dashboard</p>
            <h2 className="font-display text-5xl">{active}</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary" onClick={loadAdminData}>Refresh Data</button>
            <button className="btn-primary" onClick={() => setActive("Add Products")}>Add Product</button>
          </div>
        </div>

        {message && <div className="mt-5 rounded-2xl bg-petal px-5 py-3 text-sm font-semibold">{message}</div>}

        {active === "Dashboard" && (
          <>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["Revenue", `Rs ${stats?.revenue || revenue || 0}`],
                ["Orders", stats?.orders || orders.length],
                ["Products", stats?.products || products.length],
                ["Low Stock", stats?.lowStock?.length || products.filter((product) => product.stock <= 5).length]
              ].map(([label, value]) => (
                <div key={label} className="glass-card p-6">
                  <p className="text-cocoa/60">{label}</p>
                  <p className="mt-3 text-3xl font-bold">{value}</p>
                </div>
              ))}
            </div>
            <section className="glass-card mt-8 p-6">
              <h3 className="font-display text-3xl">Weekly Sales</h3>
              <div className="mt-6 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#e27698" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          </>
        )}

        {(active === "Add Products" || active === "Image Uploads") && (
          <section className="glass-card mt-8 max-w-3xl p-6">
            <h3 className="font-display text-3xl">{editingId ? "Edit Product" : "Add Product"}</h3>
            <form className="mt-5 grid gap-3" onSubmit={saveProduct}>
              <input className="input" placeholder="Product title" value={form.name} onChange={(event) => changeForm("name", event.target.value)} required />
              <input
                className="input"
                list="admin-category-options"
                placeholder="Category, e.g. Crochet Bouquets"
                value={form.category}
                onChange={(event) => changeForm("category", event.target.value)}
                required
              />
              <datalist id="admin-category-options">
                {categories.map((category) => (
                  <option key={category.apiCategory} value={category.apiCategory}>{category.name}</option>
                ))}
              </datalist>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="input" placeholder="Price" type="number" value={form.price} onChange={(event) => changeForm("price", event.target.value)} required />
                <input className="input" placeholder="Stock" type="number" value={form.stock} onChange={(event) => changeForm("stock", event.target.value)} required />
              </div>
              <textarea className="input min-h-28 resize-none rounded-[1.5rem]" placeholder="Description" value={form.description} onChange={(event) => changeForm("description", event.target.value)} required />
              <label className="cursor-pointer rounded-[1.5rem] border border-dashed border-cocoa/30 bg-white/45 p-5 text-center transition hover:bg-petal">
                <span className="font-semibold">{editingId ? "Replace Product Photo" : "Choose Image from Computer"}</span>
                <span className="mt-1 block text-sm text-cocoa/60">
                  {editingId ? "The new file becomes the main storefront photo after saving." : "The selected file uploads to Cloudinary automatically."}
                </span>
                <input type="file" className="hidden" accept="image/*" onChange={(event) => uploadImage(event.target.files?.[0])} />
              </label>
              {form.images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {form.images.map((image, index) => (
                    <div key={image.url} className="relative">
                      <img className="h-24 w-full rounded-2xl object-cover" src={image.url} alt="Uploaded product" />
                      {index === 0 && <span className="absolute left-2 top-2 rounded-full bg-petal px-2 py-1 text-xs font-semibold">Main</span>}
                      <button
                        type="button"
                        className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-xs font-semibold"
                        onClick={() => setForm((current) => ({ ...current, images: current.images.filter((item) => item.url !== image.url) }))}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button className="btn-primary justify-center" type="submit">Save Product</button>
            </form>
          </section>
        )}

        {active === "Categories" && (
          <div className="mt-8 grid gap-6 xl:grid-cols-[420px_1fr]">
            <section className="glass-card p-6">
              <h3 className="font-display text-3xl">{editingCategoryId ? "Edit Category" : "Add Category"}</h3>
              <form className="mt-5 grid gap-3" onSubmit={saveCategory}>
                <input className="input" placeholder="Display name, e.g. Crochet Bouquets" value={categoryForm.name} onChange={(event) => changeCategoryForm("name", event.target.value)} required />
                <input className="input" placeholder="Product filter name, e.g. Crochet" value={categoryForm.apiCategory} onChange={(event) => changeCategoryForm("apiCategory", event.target.value)} />
                <input className="input" placeholder="Subtitle" value={categoryForm.subtitle} onChange={(event) => changeCategoryForm("subtitle", event.target.value)} />
                <input className="input" placeholder="Image URL" value={categoryForm.image} onChange={(event) => changeCategoryForm("image", event.target.value)} required />
                <label className="cursor-pointer rounded-[1.5rem] border border-dashed border-cocoa/30 bg-white/45 p-5 text-center transition hover:bg-petal">
                  <span className="font-semibold">Upload Category Picture</span>
                  <span className="mt-1 block text-sm text-cocoa/60">Uploads to Cloudinary and fills the image URL.</span>
                  <input type="file" className="hidden" accept="image/*" onChange={(event) => uploadCategoryImage(event.target.files?.[0])} />
                </label>
                {categoryForm.image && <img className="h-40 rounded-[1.5rem] object-cover" src={categoryForm.image} alt="Category preview" />}
                <div className="grid gap-3 sm:grid-cols-2">
                  <button className="btn-primary justify-center" type="submit">Save Category</button>
                  {editingCategoryId && (
                    <button
                      className="btn-secondary justify-center"
                      type="button"
                      onClick={() => {
                        setEditingCategoryId(null);
                        setCategoryForm(emptyCategory);
                      }}
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </section>
            <section className="glass-card p-6">
              <h3 className="font-display text-3xl">Manage Categories</h3>
              <div className="mt-5 grid gap-3">
                {categories.length ? categories.map((category) => (
                  <div key={category._id} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem] bg-white/60 p-4">
                    <div className="flex items-center gap-4">
                      <img className="h-16 w-16 rounded-2xl object-cover" src={category.image} alt={category.name} />
                      <div>
                        <p className="font-semibold">{category.name}</p>
                        <p className="text-sm text-cocoa/60">{category.apiCategory} | {category.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded-full bg-petal px-3 py-1" onClick={() => editCategory(category)}>Edit</button>
                      {category._id ? (
                        <button className="rounded-full bg-cocoa px-3 py-1 text-white" onClick={() => deleteCategory(category._id)}>Delete</button>
                      ) : (
                        <span className="rounded-full bg-white px-3 py-1 text-sm text-cocoa/60">From products</span>
                      )}
                    </div>
                  </div>
                )) : <p className="text-cocoa/60">No database categories yet. Add one here.</p>}
              </div>
            </section>
          </div>
        )}

        {active === "Products" && (
          <section className="glass-card mt-8 overflow-hidden p-6">
            <h3 className="font-display text-3xl">Manage Products & Inventory</h3>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="text-sm text-cocoa/60">
                  <tr><th className="py-3">Photo</th><th>Product</th><th>Category</th><th>Stock</th><th>Price</th><th>Actions</th></tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t border-cocoa/10">
                      <td className="py-3">
                        {product.images?.[0]?.url ? (
                          <img className="h-14 w-14 rounded-2xl object-cover" src={product.images[0].url} alt={product.name} />
                        ) : (
                          <div className="h-14 w-14 rounded-2xl bg-petal" />
                        )}
                      </td>
                      <td className="py-3">{product.name}</td>
                      <td>{product.category}</td>
                      <td>{product.stock}</td>
                      <td>Rs {product.price}</td>
                      <td className="flex gap-2 py-3">
                        <button className="rounded-full bg-petal px-3 py-1" onClick={() => editProduct(product)}>Edit</button>
                        <button className="rounded-full bg-cocoa px-3 py-1 text-white" onClick={() => deleteProduct(product._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {active === "Customers" && (
          <section className="glass-card mt-8 overflow-hidden p-6">
            <h3 className="font-display text-3xl">Customer Accounts</h3>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead className="text-sm text-cocoa/60">
                  <tr><th className="py-3">Name</th><th>Email</th><th>Phone</th><th>Joined</th></tr>
                </thead>
                <tbody>
                  {customers.length ? customers.map((customer) => (
                    <tr key={customer._id} className="border-t border-cocoa/10">
                      <td className="py-3">{customer.name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phoneNumber || "Not added"}</td>
                      <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr><td className="py-5 text-cocoa/60" colSpan="4">No customers found yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {active === "Orders" && (
          <section className="glass-card mt-8 p-6">
            <h3 className="font-display text-3xl">Manage Orders</h3>
            <div className="mt-5 grid gap-3">
              {(orders.length ? orders : [{ _id: "demo", totalAmount: 0, orderStatus: "Placed", paymentStatus: "Pending" }]).map((order, index) => (
                <div key={order._id} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem] bg-white/60 p-4">
                  <div>
                    <p className="font-semibold">Order #{order._id === "demo" ? `BS10${index + 1}` : order._id.slice(-6)}</p>
                    <p className="text-sm text-cocoa/60">Payment: {order.paymentMethod || "Cash on Delivery"} | {order.paymentStatus} | Total: Rs {order.totalAmount}</p>
                  </div>
                  <select className="rounded-full bg-petal px-3 py-2 text-sm" value={order.orderStatus} onChange={(event) => updateOrderStatus(order._id, event.target.value)} disabled={order._id === "demo"}>
                    {["Placed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"].map((status) => <option key={status}>{status}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </section>
        )}

        {active === "Payments" && (
          <section className="glass-card mt-8 p-6">
            <h3 className="font-display text-3xl">View Payments</h3>
            <div className="mt-5 grid gap-3">
              {(payments.length ? payments : [{ _id: "sample", paymentMethod: "Razorpay", amount: 0, status: "No payments yet" }]).map((payment) => (
                <div key={payment._id} className="flex flex-wrap items-center justify-between gap-4 rounded-[1.4rem] bg-white/60 p-4">
                  <div>
                    <p className="font-semibold">{payment.paymentMethod}</p>
                    <p className="text-sm text-cocoa/60">{payment.paymentId || payment.razorpayOrderId || "Waiting for payment"}</p>
                  </div>
                  <p className="font-semibold">Rs {payment.amount} | {payment.status}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {active === "Reviews" && (
          <div className="mt-8 grid gap-6 xl:grid-cols-2">
            <section className="glass-card p-6">
              <h3 className="font-display text-3xl">Reviews & Feedback</h3>
              <div className="mt-5 grid gap-3">
                {feedback.length ? feedback.map((item) => (
                  <div key={item._id} className="rounded-[1.4rem] bg-white/60 p-4">
                    <div className="flex flex-wrap justify-between gap-3">
                      <p className="font-semibold">{item.productName}</p>
                      <span>{item.rating}/5</span>
                    </div>
                    <p className="mt-1 text-sm text-cocoa/60">{item.userName} {item.userEmail ? `| ${item.userEmail}` : ""}</p>
                    <p className="mt-2 text-cocoa/75">{item.comment}</p>
                  </div>
                )) : <p className="text-cocoa/60">No product reviews yet.</p>}
              </div>
            </section>
            <section className="glass-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-3xl">Notification Log</h3>
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full bg-petal px-4 py-2 font-semibold" onClick={async () => {
                    try {
                      const { data } = await api.post("/admin/test-email", {});
                      setMessage(data.message);
                    } catch (error) {
                      setMessage(error.response?.data?.message || "Test email failed.");
                    }
                  }}>Test Email</button>
                  <button className="rounded-full bg-petal px-4 py-2 font-semibold" onClick={loadAdminData}>Refresh</button>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {notifications.length ? notifications.map((item) => (
                  <div key={item._id} className="rounded-[1.4rem] bg-white/60 p-4">
                    <p className="font-semibold">{item.subject}</p>
                    <p className="mt-1 text-sm text-cocoa/60">Type: {item.type?.replaceAll("_", " ")} | From: {item.userEmail || "N/A"} | Admin: {item.adminEmail}</p>
                    <p className="mt-1 text-sm text-cocoa/60">Email: {item.emailSent ? "Sent" : "Queued"} | Status: {item.status}</p>
                    <p className="mt-2 whitespace-pre-line text-sm text-cocoa/75">{item.message}</p>
                    {item.error && <p className="mt-2 text-sm font-semibold text-red-700">Error: {item.error}</p>}
                  </div>
                )) : <p className="text-cocoa/60">No notifications yet.</p>}
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
