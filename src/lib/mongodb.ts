import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

// Basic validation & helpful diagnostics
if (!MONGODB_URI) {
  throw new Error(
    "[DB] MONGODB_URI tanımlı değil. .env.local dosyanıza mongodb:// veya mongodb+srv:// ile başlayan bir bağlantı stringi ekleyin. Örn: mongodb://localhost:27017/interview-question-creator"
  );
}

if (!/^mongodb(\+srv)?:\/\//.test(MONGODB_URI)) {
  throw new Error(
    `[DB] Geçersiz MONGODB_URI şeması: '${MONGODB_URI}'. 'mongodb://' veya 'mongodb+srv://' ile başlamalıdır.`
  );
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectToDatabase;
