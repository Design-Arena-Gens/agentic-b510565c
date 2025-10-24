require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    title: 'Wireless Bluetooth Headphones',
    slug: 'wireless-bluetooth-headphones',
    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life',
    price: 89.99,
    compareAtPrice: 129.99,
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'],
    category: 'Electronics',
    stock: 50,
    featured: true,
    sku: 'WBH-001'
  },
  {
    title: 'Smart Watch Pro',
    slug: 'smart-watch-pro',
    description: 'Advanced fitness tracking, heart rate monitor, and smartphone notifications',
    price: 199.99,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'],
    category: 'Electronics',
    stock: 30,
    featured: true,
    sku: 'SWP-002'
  },
  {
    title: 'Portable Bluetooth Speaker',
    slug: 'portable-bluetooth-speaker',
    description: 'Waterproof speaker with 360-degree sound and 12-hour battery',
    price: 49.99,
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500'],
    category: 'Electronics',
    stock: 100,
    featured: true,
    sku: 'PBS-003'
  },
  {
    title: 'Laptop Backpack',
    slug: 'laptop-backpack',
    description: 'Durable backpack with padded laptop compartment and USB charging port',
    price: 39.99,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'],
    category: 'Accessories',
    stock: 75,
    featured: false,
    sku: 'LBP-004'
  },
  {
    title: 'Wireless Gaming Mouse',
    slug: 'wireless-gaming-mouse',
    description: 'High-precision gaming mouse with customizable RGB lighting',
    price: 59.99,
    images: ['https://images.unsplash.com/photo-1527814050087-3793815479db?w=500'],
    category: 'Electronics',
    stock: 60,
    featured: true,
    sku: 'WGM-005'
  },
  {
    title: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    description: 'RGB mechanical keyboard with blue switches and aluminum frame',
    price: 119.99,
    images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500'],
    category: 'Electronics',
    stock: 40,
    featured: true,
    sku: 'MKB-006'
  },
  {
    title: 'USB-C Hub',
    slug: 'usb-c-hub',
    description: '7-in-1 USB-C adapter with HDMI, USB 3.0, and SD card reader',
    price: 34.99,
    images: ['https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500'],
    category: 'Accessories',
    stock: 120,
    featured: false,
    sku: 'UCH-007'
  },
  {
    title: 'Webcam HD 1080p',
    slug: 'webcam-hd-1080p',
    description: 'Full HD webcam with auto-focus and built-in microphone',
    price: 69.99,
    images: ['https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500'],
    category: 'Electronics',
    stock: 55,
    featured: true,
    sku: 'WHD-008'
  },
  {
    title: 'Phone Stand Adjustable',
    slug: 'phone-stand-adjustable',
    description: 'Aluminum phone stand with adjustable angle for desk use',
    price: 19.99,
    images: ['https://images.unsplash.com/photo-1601524909162-ae8725290836?w=500'],
    category: 'Accessories',
    stock: 200,
    featured: false,
    sku: 'PSA-009'
  },
  {
    title: 'Wireless Charger',
    slug: 'wireless-charger',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices',
    price: 24.99,
    images: ['https://images.unsplash.com/photo-1591290619762-d118732c49f2?w=500'],
    category: 'Accessories',
    stock: 150,
    featured: true,
    sku: 'WCH-010'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products
    await Product.insertMany(products);
    console.log(`Inserted ${products.length} products`);

    // Create admin user if doesn't exist
    const adminEmail = 'admin@ecommerce.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const admin = new User({
        name: 'Admin User',
        email: adminEmail,
        passwordHash: 'admin123',
        role: 'admin',
        emailVerified: true
      });
      await admin.save();
      console.log('Created admin user: admin@ecommerce.com / admin123');
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seedDatabase();
