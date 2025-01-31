import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/config";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const uploadImageData = await pinata.upload.file(file);
    const imageURL = await pinata.gateways.convert(uploadImageData.IpfsHash);

    console.log(uploadImageData);

    const uploadJsonData = await pinata.upload.json({
      name: "Mark Grayson",
      description: "Invincible",
      external_url: "https://pinata.cloud",
      image: `ipfs://${uploadImageData.IpfsHash}`,

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
    });

    const jsonURL = await pinata.gateways.convert(uploadJsonData.IpfsHash);

    return NextResponse.json(
      {
        image: imageURL,
        json: jsonURL,
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
