import dns from "node:dns";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

// Windows 本機上 Node 常無法透過系統 DNS 解析 mongodb+srv 的 SRV 紀錄（querySrv ECONNREFUSED），
// 開發環境改用公開 DNS；部署到 Vercel 時不受影響
const PUBLIC_DNS = ["8.8.8.8", "1.1.1.1"];
const usePublicDns = process.env.NODE_ENV !== "production";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// 開發模式下 hot reload 會重複執行模組，把連線快取在 global 上避免連線數暴增
const globalForMongoose = globalThis as unknown as { mongoose?: MongooseCache };
const cached: MongooseCache = globalForMongoose.mongoose ?? { conn: null, promise: null };
globalForMongoose.mongoose = cached;

function isSrvError(error: unknown) {
  return error instanceof Error && error.message.includes("querySrv");
}

async function connect(uri: string, retries = 1): Promise<typeof mongoose> {
  // 在連線前一刻才設定，確保這次的 SRV 查詢一定使用公開 DNS
  if (usePublicDns) dns.setServers(PUBLIC_DNS);
  try {
    return await mongoose.connect(uri, { bufferCommands: false });
  } catch (error) {
    if (retries > 0 && isSrvError(error)) {
      console.warn("MongoDB SRV 查詢失敗，重試中…", error);
      return connect(uri, retries - 1);
    }
    throw error;
  }
}

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("缺少環境變數 MONGODB_URI");
  }
  if (cached.conn) return cached.conn;

  cached.promise ??= connect(MONGODB_URI);
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
