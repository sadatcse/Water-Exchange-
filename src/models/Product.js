import mongoose from 'mongoose';

// Equipment shown on /products, /products/[slug] and the home page.
// `category` is the slug of a ProductCategory (any level of the tree) — checked by product.service.js.

const pair = { label: { type: String, trim: true, maxlength: 80 }, value: { type: String, trim: true, maxlength: 200 } };

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: [true, 'Slug is required'], unique: true, lowercase: true, trim: true, maxlength: 120 },
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 160 },
    category: { type: String, required: [true, 'Category is required'], lowercase: true, trim: true, index: true },
    // Local path (/images/products/…) or a full https URL
    image: { type: String, required: [true, 'Image is required'], trim: true, maxlength: 600 },
    brand: { type: String, trim: true, default: '', maxlength: 160 },
    origin: { type: String, trim: true, default: '', maxlength: 120 },
    summary: { type: String, required: [true, 'Summary is required'], trim: true, maxlength: 400 },
    question: { type: String, trim: true, default: '', maxlength: 200 },
    overview: { type: [String], default: [] },
    distinction: {
      text: { type: String, trim: true, default: '', maxlength: 1000 },
      see: { type: [String], default: [] }, // slugs of products it is often confused with
    },
    highlights: { type: [pair], default: [] },
    features: { type: [String], default: [] },
    specs: { type: [pair], default: [] },
    applications: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ published: 1, order: 1 });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
