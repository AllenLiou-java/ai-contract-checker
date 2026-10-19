import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const RiskSchema = new Schema(
  {
    clause: String,
    issue: String,
    severity: { type: String, enum: ["low", "medium", "high"] },
    suggestion: String,
  },
  { _id: false },
);

const KeyTermSchema = new Schema({ title: String, content: String }, { _id: false });

const AnalysisSchema = new Schema(
  {
    contractType: String,
    summary: String,
    overallRisk: { type: String, enum: ["low", "medium", "high"] },
    parties: [String],
    keyTerms: [KeyTermSchema],
    risks: [RiskSchema],
    missingClauses: [String],
    recommendations: [String],
  },
  { _id: false },
);

const ContractSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    blobUrl: { type: String, required: true },
    blobPathname: { type: String, required: true },
    status: { type: String, enum: ["completed"], required: true },
    model: String,
    analysis: AnalysisSchema,
  },
  { timestamps: true },
);

export type ContractDoc = InferSchemaType<typeof ContractSchema>;

// 開發模式 hot reload 後 schema 可能已變更，先移除舊的 model 再重新註冊，避免新欄位被 strict 模式丟掉
if (mongoose.models.Contract) mongoose.deleteModel("Contract");
export const Contract: Model<ContractDoc> = mongoose.model("Contract", ContractSchema);
