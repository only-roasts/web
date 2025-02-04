import { makeCastAdd, CastType } from "@farcaster/hub-nodejs";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { WarpcastPayload } from "pinata-fdk";
import { sendCast, signInWithWarpcast } from "./utils";

export async function POST(req: NextRequest) {
  try {
    // const signInData = await signInWithWarpcast();
    // if (!signInData) {
    //   return NextResponse.json(
    //     { error: "Failed to get farcaster user" },
    //     { status: 500 }
    //   );
    // }
    // if (signInData) {
    //   return NextResponse.json({
    //     deepLinkUrl: signInData?.signerApprovalUrl,
    //     pollingToken: signInData?.token,
    //     publicKey: signInData?.publicKey,
    //     privateKey: signInData?.privateKey,
    //   });
    // } else {
    //   return NextResponse.json(
    //     { error: "Failed to get farcaster user" },
    //     { status: 500 }
    //   );
    // }

    const mentionedCastsResponse = await axios.get(
      `https://hub.pinata.cloud/v1/castsByMention?fid=${process.env.FARCASTER_DEVELOPER_FID}`
    );
    const casts = mentionedCastsResponse.data.messages;

    casts.map(async (cast: any) => {
      const result = await sendCast(
        "---# ROAST OF THE DAY #--- \n This you? , lol you just got roasted by our ai agent. Tag your friend to roast them too about their transactions onchain.",
        cast.hash,
        cast.data.fid
      );
    });

    return NextResponse.json(
      {
        result: "All casts have been sent",
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
