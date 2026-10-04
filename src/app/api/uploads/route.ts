import { NextResponse } from "next/server";
import { ipfsUrl, uploadToPinata } from "@/lib/ipfs/pinata";

const MAX_IMAGE_BYTES = 1_000_000;

export async function POST(request: Request) {
  try {
    if (!process.env.PINATA_JWT) {
      return NextResponse.json(
        { error: "PINATA_JWT is not configured on the server" },
        { status: 500 },
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const isImage = file.type.startsWith("image/");
    if (isImage && file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Images must be 1MB or smaller" },
        { status: 400 },
      );
    }

    const { cid } = await uploadToPinata(file, file.name || "upload.bin");
    return NextResponse.json({
      cid,
      url: ipfsUrl(cid),
      filename: file.name || "upload.bin",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
