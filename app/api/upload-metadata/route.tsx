import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const { pngBuffer, tokenID } = await request.json();
    const file = Buffer.from(pngBuffer, "base64");
    const fileObject = new File([file], `image/${tokenID}.png`, {
      type: "image/png",
    });
    const uploadImageData = await pinata.upload.file(fileObject);
    const imageURL = `https://white-official-scallop-559.mypinata.cloud/ipfs/${uploadImageData.IpfsHash}/${tokenID}.png`;

    const uploadJsonData = await pinata.upload
      .json({
        name: "NewGrayson",
        description: "Invincible",
        external_url: "https://pinata.cloud",
        image: imageURL,

        attributes: [
          {
            trait_type: "Lit",
            value: 10,
          },
          {
            trait_type: "Creator",
            value: "YourName",
          },
        ],
      })
      .addMetadata({
        name: `metadata/${tokenID}`,
      });

    return NextResponse.json(
      {
        cid: uploadJsonData.IpfsHash,
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
