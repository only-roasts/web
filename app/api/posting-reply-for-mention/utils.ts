import {
  makeCastAdd,
  makeCastRemove,
  makeLinkAdd,
  makeLinkRemove,
  makeReactionAdd,
  Message,
  makeReactionRemove,
  makeUserDataAdd,
  NobleEd25519Signer,
  FarcasterNetwork,
  CastType,
  hexStringToBytes,
} from "@farcaster/core";
import { hexToBytes } from "@noble/hashes/utils";
import * as ed from "@noble/ed25519";
import { mnemonicToAccount } from "viem/accounts";
import { getWebURL } from "@/lib/utils";
import axios from "axios";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://usfbtwsqfvygdatpcmyw.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

export type FarcasterUser = {
  signature: string;
  requestFid: number;
  deadline: number;
  requestSigner: string;
  publicKey: string;
  token: string;
  signerApprovalUrl: string;
  privateKey: string;
  status: string;
};

export const FID = process.env.FARCASTER_DEVELOPER_FID
  ? parseInt(process.env.FARCASTER_DEVELOPER_FID)
  : 0;

export const SIGNER = process.env.FARCASTER_PRIVATE_KEY || "";

export const SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN = {
  name: "Farcaster SignedKeyRequestValidator",
  version: "1",
  chainId: 10,
  verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
} as const;

export const SIGNED_KEY_REQUEST_TYPE = [
  { name: "requestFid", type: "uint256" },
  { name: "key", type: "bytes" },
  { name: "deadline", type: "uint256" },
] as const;

export const sendMentionCast = async (
  cid: string,
  message: string,
  parentUrl: string,
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

    const castHashBytes = hexStringToBytes(parentUrl)._unsafeUnwrap();

    const castBody = {
      type: CastType.CAST,
      text: message,
      embeds: [
        { url: `https://only-roasts-frame.vercel.app/api/initial/${cid}` },
      ],
      embedsDeprecated: [],
      mentions: [mentionedFid, parentCastFid],
      mentionsPositions,
      parentCastId: {
        hash: castHashBytes,
        fid: parentCastFid,
      },
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

export const signInWithWarpcast = async () => {
  const privateKeyBytes = ed.utils.randomPrivateKey();
  const publicKeyBytes = await ed.getPublicKeyAsync(privateKeyBytes);

  const keypairString = {
    publicKey: "0x" + Buffer.from(publicKeyBytes).toString("hex"),
    privateKey: "0x" + Buffer.from(privateKeyBytes).toString("hex"),
  };
  const appFid = process.env.FARCASTER_DEVELOPER_FID!;
  const account = mnemonicToAccount(process.env.FARCASTER_DEVELOPER_MNEMONIC!);

  const deadline = Math.floor(Date.now() / 1000) + 86400; // signature is valid for 1 day
  const requestFid = parseInt(appFid);
  const signature = await account.signTypedData({
    domain: SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_DOMAIN,
    types: {
      SignedKeyRequest: SIGNED_KEY_REQUEST_TYPE,
    },
    primaryType: "SignedKeyRequest",
    message: {
      requestFid: BigInt(appFid),
      key: keypairString.publicKey as `0x`,
      deadline: BigInt(deadline),
    },
  });
  const authData = {
    signature: signature,
    requestFid: requestFid,
    deadline: deadline,
    requestSigner: account.address,
  };
  const {
    result: { signedKeyRequest },
  } = (await (
    await fetch(`https://api.warpcast.com/v2/signed-key-requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: keypairString.publicKey,
        signature,
        requestFid,
        deadline,
      }),
    })
  ).json()) as {
    result: { signedKeyRequest: { token: string; deeplinkUrl: string } };
  };
  const user: FarcasterUser = {
    ...authData,
    publicKey: keypairString.publicKey,
    deadline: deadline,
    token: signedKeyRequest.token,
    signerApprovalUrl: signedKeyRequest.deeplinkUrl,
    privateKey: keypairString.privateKey,
    status: "pending_approval",
  };
  return user;
};

export const checkAlreadyCasted = async (cast_hash: string) => {
  const { data, error } = await supabase
    .from("mention-casts")
    .select("cast_hash")
    .eq("cast_hash", cast_hash);
  return data;
};

export const updateSupabaseTable = async (cast_hash: string) => {
  const { error } = await supabase.from("mention-casts").insert({
    cast_hash,
    posted: true,
  });
  return error;
};

export const getPinataMetadataCID = async (
  address: string,
  tokenID: number
) => {
  // const roastData = await getRoastData(address);

  const roastData = {
    roast: "You’ve spent more on gas fees than on your coffee this month! ☕",
    walletAddress: "0x1234567890",
    flameCount: 0,
    litCount: 0,
    dropletCount: 0,
  };

  const roastImage = await getRoastImage(roastData);

  const roastNFTData = {
    walletStatus: "Defi Degenerate",
    ethSpent: 0,
    roast: roastData.roast,
    intensity: "Mild",
    advice: "You should probably stop trading on Uniswap.",
  };

  const uploadMetadataResponse = await axios.post(
    `${getWebURL()}/api/upload-metadata`,
    {
      pngBuffer: roastImage,
      tokenID,
      roastNFTData,
    }
  );

  const cid = uploadMetadataResponse.data.cid;
  return { cid, roastData };
};

export const getRoastData = async (address: string) => {
  const roastResponse = await axios.get(
    `${getWebURL()}/api/generate-roast/${address}`
  );
  console.log(roastResponse.data.roast);

  const roastData = {
    roast: roastResponse.data.roast,
    walletAddress: address,
    flameCount: 0,
    litCount: 0,
    dropletCount: 0,
  };
  return roastData;
};

export const getRoastImage = async (roastData: any) => {
  const roastImageResponse = await axios.post(
    `${getWebURL()}/api/generate-image`,
    {
      roast: roastData.roast,
      walletAddress: roastData.walletAddress,
      flameCount: roastData.flameCount,
      litCount: roastData.litCount,
      dropletCount: roastData.dropletCount,
    }
  );

  return roastImageResponse.data.pngBuffer;
};
