import { isValidObjectId } from "mongoose";
import { getCurrentUser } from "@/lib/dal";
import { Contract } from "@/models/Contract";

// 經過登入與擁有者檢查後才轉送原始檔案，不把 Blob 網址直接交給瀏覽器
export async function GET(_request: Request, { params }: RouteContext<"/api/contracts/[id]/file">) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: "請先登入" }, { status: 401 });

  const { id } = await params;
  if (!isValidObjectId(id)) return Response.json({ error: "找不到檔案" }, { status: 404 });

  const contract = await Contract.findOne({ _id: id, user: user.id }).select("blobUrl fileName mimeType").lean();
  if (!contract) return Response.json({ error: "找不到檔案" }, { status: 404 });

  const blobResponse = await fetch(contract.blobUrl);
  if (!blobResponse.ok || !blobResponse.body) {
    return Response.json({ error: "讀取檔案失敗" }, { status: 502 });
  }

  return new Response(blobResponse.body, {
    headers: {
      "Content-Type": contract.mimeType || "application/octet-stream",
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(contract.fileName)}`,
      "Cache-Control": "private, no-store",
    },
  });
}
