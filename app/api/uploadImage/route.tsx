import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";
import "dotenv/config";


// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: "https://ik.imagekit.io/ycg1urlz8",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.image) {
      return NextResponse.json({ error: "Missing image data" }, { status: 400 });
    }

    const base64Image = body.image; 

    const response = await imagekit.upload({
      file: base64Image, 
      fileName: `generated_${Date.now()}.png`,
      folder: "/uploads",
    });

    return NextResponse.json({ imageUrl: response.url });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}
