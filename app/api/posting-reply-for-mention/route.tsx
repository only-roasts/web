import { makeCastAdd, CastType } from "@farcaster/hub-nodejs";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { WarpcastPayload } from "pinata-fdk";
import {
  getPinataMetadataCID,
  sendMentionCast,
  signInWithWarpcast,
  checkAlreadyCasted,
  updateSupabaseTable,
} from "./utils";
import { getWebURL } from "@/lib/utils";

let intervalId: NodeJS.Timeout | null = null;

async function startBot() {
  if (intervalId) {
    console.log("Bot is already running.");
    return;
  }

  intervalId = setInterval(() => {
    checkAndPostMentions();
  }, 5000);

  console.log("Bot started, checking every 5 seconds.");
}

// Function to stop the bot
function stopBot() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("Bot stopped.");
  }
}

// Function to check mentions and post
async function checkAndPostMentions() {
  try {
    // Fetch mentions (casts) using the API
    const mentionedCastsResponse = await axios.get(
      `https://hub.pinata.cloud/v1/castsByMention?fid=${process.env.FARCASTER_DEVELOPER_FID}`
    );
    const casts = mentionedCastsResponse.data.messages;

    // Iterate over each cast and send a roast
    for (const cast of casts) {
      try {
        const alreadyCasted = await checkAlreadyCasted(cast.hash);

        if (alreadyCasted?.length == 0) {
          const addressResponse = await axios.get(
            `${getWebURL()}/api/getEthereumAddressByFid/${cast.data.fid}`
          );
          const { cid } = await getPinataMetadataCID(
            cast.data.castAddBody.mentions[1],
            89
          );

          const callerFid = cast.data.fid;
          console.log(cast.data.fid);
          const mentionedFid = cast.data.castAddBody.mentions[1];
          console.log(cast.data.castAddBody.mentions[1]);

          const result = await sendMentionCast(
            cid,
            "This you? , lol you just got roasted by your friend . Tag your friend to roast them too about their transactions onchain.",
            cast.hash,
            callerFid,
            mentionedFid,
            [10, 52]
          );

          await updateSupabaseTable(cast.hash);
        } else {
          console.log("Already casted this mention: " + cast.hash);
        }
      } catch (error) {
        console.error(`Failed to process cast ${cast.hash}:`, error);
      }
    }

    console.log("All casts have been processed and sent.");
  } catch (e) {
    console.error("Error in processing casts:", e);
  }
}

// POST endpoint to start or stop the bot
export async function POST(req: NextRequest) {
  try {
    const { action } = await req.json();

    if (action === "start") {
      startBot();
      return NextResponse.json({ result: "Bot started." }, { status: 200 });
    }

    if (action === "stop") {
      stopBot();
      return NextResponse.json({ result: "Bot stopped." }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
