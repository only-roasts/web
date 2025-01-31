import { NextResponse, NextRequest } from "next/server";
import { generateRoastCardImage } from "./utils";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { roast, walletAddress, flameCount } = data;
    const image = await generateRoastCardImage(
      roast,
      walletAddress,
      flameCount
    );

    return NextResponse.json(
      {
        image,
      },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
