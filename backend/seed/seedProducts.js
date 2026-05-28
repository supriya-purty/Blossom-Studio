const dotenv = require("dotenv");
const connectDB = require("../src/config/db");
const Product = require("../src/models/Product");
const User = require("../src/models/User");

dotenv.config();

const products = [
  {
    name: "Crochet Daisy Tote Charm",
    description: "Hand-crocheted daisy charm made with soft cotton yarn for bags, keys, and gifting.",
    price: 349,
    category: "Crochet",
    stock: 18,
    rating: 4.8,
    numReviews: 22,
    isFeatured: true,
    isBestSeller: true,
    images: [{ url: "https://images.unsplash.com/photo-1618588507085-c79565432917?auto=format&fit=crop&w=900&q=80" }]
  },
  {
    name: "Pastel Pipe Cleaner Bouquet",
    description: "Forever flowers shaped by hand with velvet pipe cleaners in a dreamy pastel palette.",
    price: 799,
    category: "Pipe Cleaner Flowers",
    stock: 12,
    rating: 4.9,
    numReviews: 31,
    isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=900&q=80" }]
  },
  {
    name: "Lavender Desk Bloom Jar",
    description: "Aesthetic handmade desk decor with preserved craft blooms, lace, and ribbon details.",
    price: 599,
    category: "Aesthetic Crafts",
    stock: 9,
    rating: 4.7,
    numReviews: 15,
    isFeatured: true,
    images: [{ url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80" }]
  },
  {
    name: "Custom Name Gift Hamper",
    description: "Personalized handmade hamper with mini bouquet, crochet keepsake, note card, and gift wrap.",
    price: 1299,
    category: "Customized Gifts",
    stock: 7,
    rating: 5,
    numReviews: 18,
    isBestSeller: true,
    images: [{ url: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&q=80" }]
  }
];

const seed = async () => {
  await connectDB();
  await Product.deleteMany();
  await Product.insertMany(products);

  const adminExists = await User.findOne({ email: "admin@blossomstudio.in" });
  if (!adminExists) {
    await User.create({
      name: "Blossom Admin",
      email: "admin@blossomstudio.in",
      password: "admin123",
      role: "admin",
      phoneNumber: "9999999999"
    });
  }

  console.log("Sample products and admin user seeded");
  process.exit();
};

seed();
