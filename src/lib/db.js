import mongoose from 'mongoose';

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export default async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error('MONGO_URI is not defined in .env');

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    // Small pool + timeouts suit shared hosting (cPanel may run several app processes)
    cached.promise = mongoose.connect(uri, { bufferCommands: false, maxPoolSize: 10, serverSelectionTimeoutMS: 10000, socketTimeoutMS: 45000 });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    // Atlas's message always blames the IP list; log the real reason per server once a minute
    // (e.g. "connect ETIMEDOUT" = a firewall blocks port 27017, "bad auth" = wrong password)
    if (!cached.loggedAt || Date.now() - cached.loggedAt > 60000) {
      cached.loggedAt = Date.now();
      const reasons = [...(e?.reason?.servers?.values?.() || [])].map((s) => `${s.address}: ${s.error?.message || s.type}`);
      console.error(`MongoDB connection failed — ${reasons.length ? reasons.join(' | ') : e.message}`);
    }
    throw e;
  }
  return cached.conn;
}
