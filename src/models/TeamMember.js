import mongoose from 'mongoose';

// People shown in "Meet the team" (home and /about). The featured member gets the large card.
const TeamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 120 },
    role: { type: String, required: [true, 'Role is required'], trim: true, maxlength: 120 },
    credentials: { type: String, trim: true, default: '', maxlength: 200 },
    // Optional photo: local path or full https URL. Initials are shown without one.
    photo: { type: String, trim: true, default: '', maxlength: 600 },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

TeamMemberSchema.index({ published: 1, order: 1 });

export default mongoose.models.TeamMember || mongoose.model('TeamMember', TeamMemberSchema);
