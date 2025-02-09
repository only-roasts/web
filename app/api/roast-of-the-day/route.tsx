import {
  FarcasterNetwork,
  NobleEd25519Signer,
  hexStringToBytes,
  CastType,
  makeCastAdd,
  Message,
} from "@farcaster/hub-nodejs";
import { NextRequest, NextResponse } from "next/server";
import {
  FID,
  getPinataMetadataCID,
  SIGNER,
} from "../posting-reply-for-mention/utils";
import { hexToBytes } from "@noble/hashes/utils";
import axios from "axios";
import { getWebURL } from "@/lib/utils";

import cron from "node-cron";

export async function POST(req: NextRequest) {
  try {
    cron.schedule("@daily", async () => {
      console.log("# Running scheduler daily#");

      const randomTransaction = await getRandomTransactionOfTheDay();

      const address = randomTransaction.from_address;

      const { cid } = await getPinataMetadataCID(address);
      sendDailyCast(
        cid,
        `---# ROAST OF THE DAY #--- ${address} just got roasted by our ai agent. Tag your friend to roast them too about their transactions onchain.`
      );
    });

    return NextResponse.json({ data: "Success", status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

const getRandomTransactionOfTheDay = async () => {
  const options = {
    headers: {
      Authorization: `Bearer ${process.env.GOLD_RUSH_API_KEY}`,
    },
  };
  const latestBlockTransaction = await axios.get(
    `https://api.covalenthq.com/v1/base-sepolia-testnet/block/latest/transactions_v3/page/0/`,
    options
  );

  const randomTransaction =
    latestBlockTransaction.data.data.items[
      Math.floor(Math.random() * latestBlockTransaction.data.data.items.length)
    ];

  console.log(randomTransaction);

  return randomTransaction;
};

const sendDailyCast = async (cid: string, message: string) => {
  try {
    const dataOptions = {
      fid: FID,
      network: FarcasterNetwork.MAINNET,
    };

    const privateKeyBytes = hexToBytes(SIGNER.slice(2));

    const ed25519Signer = new NobleEd25519Signer(privateKeyBytes);

    const castBody = {
      type: CastType.CAST,
      text: message,
      embeds: [
        { url: `https://only-roasts-frame.vercel.app/api/postedByBot/${cid}` },
      ],
      embedsDeprecated: [],
      mentions: [],
      mentionsPositions: [],
    };

    const castAddReq = await makeCastAdd(castBody, dataOptions, ed25519Signer);
    const castAdd = castAddReq._unsafeUnwrap();
    const messageBytes = Buffer.from(Message.encode(castAdd).finish());

    // Make API request
    const castRequest = await fetch(
      "https://hub.pinata.cloud/v1/submitMessage",
      {
        method: "POST",
        headers: { "Content-Type": "application/octet-stream" },
        body: messageBytes,
      }
    );
    // Parse API request results
    const castResult = await castRequest.json();
    return castResult;
  } catch (error) {
    console.log("problem sending cast:", error);
  }
};
