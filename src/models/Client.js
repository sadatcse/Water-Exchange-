import mongoose from 'mongoose';

// "Our happy clients" — logo strip on the home page and the grid on /clients
const ClientSchema = new mongoose.Schema(
  {
    // Optional: some logos are shown without a known company name
    name: { type: String, trim: true, default: '', maxlength: 160 },
    // Local path (/images/clients/…) or a full https URL
    logo: { type: String, required: [true, 'Logo is required'], trim: true, maxlength: 600 },
    sector: { type: String, trim: true, default: '', maxlength: 80 },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ClientSchema.index({ published: 1, order: 1 });

export default mongoose.models.Client || mongoose.model('Client', ClientSchema);
