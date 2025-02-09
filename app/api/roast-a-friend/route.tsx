import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import {
  getPinataMetadataCID,
  sendMentionCast,
} from "../posting-reply-for-mention/utils";
import { roastAFriendCast } from "./utils";

export async function POST(req: NextRequest) {
  try {
    const { username, userFid } = await req.json();

    const fidResponse = await axios.get(
      `https://fnames.farcaster.xyz/transfers/current?name=${username}`
    );

    const taggedFid = fidResponse.data.fid;
    const { cid } = await getPinataMetadataCID(taggedFid);

    const message =
      "This you? , lol you just got roasted by your friend . Tag your friend to roast them too about their transactions onchain.";

    const result = await roastAFriendCast(
      cid,
      message,
      userFid,
      taggedFid,
      [10, 52]
    );

    return NextResponse.json({ data: result, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
