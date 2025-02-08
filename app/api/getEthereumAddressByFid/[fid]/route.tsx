import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      fid: string;
    }>;
  }
) {
  // Introducing a 6-second delay
  //   await new Promise((resolve) => setTimeout(resolve, 6000));

  const fid = (await context.params).fid;

  const options = {
    method: "GET",
    headers: { Authorization: `Bearer ${process.env.PINATA_JWT}` },
  };

  const response = await axios.get(
    ` https://api.pinata.cloud/v3/farcaster/users/${fid}`,
    options
  );

  const address = response.data.user.verified_addresses.eth_addresses[0];

  return NextResponse.json({ address });
}
