import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const EncryptedSchema = new Schema(
  { ciphertext: String, iv: String, tag: String },
  { _id: false },
);

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // 只存 bcrypt 雜湊後的密碼，查詢時預設不取出
    passwordHash: { type: String, required: true, select: false },
    // BYOK：使用者自己的 OpenAI API Key，以 AES-256-GCM 加密保存，查詢時預設不取出
    openaiKey: { type: EncryptedSchema, select: false },
    // 只用來在畫面上顯示 sk-…abcd
    openaiKeyLast4: String,
  },
  { timestamps: true },
);

export type UserDoc = InferSchemaType<typeof UserSchema>;

// 開發模式 hot reload 後 schema 可能已變更，先移除舊的 model 再重新註冊，避免新欄位被 strict 模式丟掉
if (mongoose.models.User) mongoose.deleteModel("User");
export const User: Model<UserDoc> = mongoose.model("User", UserSchema);
