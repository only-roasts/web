import {
  FarcasterNetwork,
  NobleEd25519Signer,
  CastType,
  makeCastAdd,
  Message,
} from "@farcaster/hub-nodejs";
import { FID, SIGNER } from "../posting-reply-for-mention/utils";
import { hexToBytes } from "@noble/hashes/utils";

export const roastAFriendCast = async (
  cid: string,
  message: string,
  parentCastFid: number,
  mentionedFid: number,
  mentionsPositions: [number, number]
) => {
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
      mentions: [mentionedFid, parentCastFid],
      mentionsPositions,
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
