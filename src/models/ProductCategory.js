import mongoose from 'mongoose';

// Product category tree (Dashboard → Product Categories). Children point to their parent by slug.
const ProductCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 100 },
    slug: { type: String, required: [true, 'Slug is required'], unique: true, lowercase: true, trim: true, maxlength: 120 },
    parent: { type: String, default: '', lowercase: true, trim: true, index: true }, // '' = top-level group
    icon: { type: String, default: '', trim: true, maxlength: 30 }, // key from CATEGORY_ICONS (groups)
    description: { type: String, default: '', trim: true, maxlength: 300 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.ProductCategory || mongoose.model('ProductCategory', ProductCategorySchema);
