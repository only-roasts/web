import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/lib/config";
import { getRoastCount, updateRoastCount } from "./utils";

export async function POST(request: NextRequest) {
  try {
    const { roastNFTData, pngBuffer } = await request.json();
    const file = Buffer.from(pngBuffer, "base64");

    const tokenID = await getRoastCount();
    const fileObject = new File([file], `${tokenID}.png`, {
      type: "image/png",
    });
    const uploadImageData = await pinata.upload.file(fileObject);
    const imageURL = `https://white-official-scallop-559.mypinata.cloud/ipfs/${uploadImageData.IpfsHash}`;

    const uploadJsonData = await pinata.upload
      .json({
        name: `OnlyRoasts #${tokenID}`,
        description:
          "A savage roast generated based on your blockchain transaction history.",
        image: imageURL,
        external_url: "https://onlyroasts.com/mint/1",
        attributes: [
          {
            trait_type: "Wallet Status",
            value: roastNFTData.walletStatus,
          },
          {
            trait_type: "ETH Spent",
            value: roastNFTData.ethSpent,
          },
          {
            trait_type: "Roast",
            value: roastNFTData.roast,
          },
          {
            trait_type: "Roast Intensity",
            value: roastNFTData.intensity,
          },
          {
            trait_type: "Advice",
            value: roastNFTData.advice,
          },
        ],
      })
      .addMetadata({
        name: `${tokenID}.json`,
      });

    await updateRoastCount();

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
