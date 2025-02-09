import { NextResponse, NextRequest } from "next/server";
import { generateRoastCardImage } from "./utils";
import { useReadContract } from "wagmi";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { roast, walletAddress, litCount, dropletCount, tokenID } = data;

    const image = await generateRoastCardImage(
      roast,
      walletAddress,
      Number(litCount),
      Number(litCount),
      Number(dropletCount)
    );

    return NextResponse.json(
      {
        pngBuffer: image,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error:", e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
