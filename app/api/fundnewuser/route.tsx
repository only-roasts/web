import { NextResponse, NextRequest } from "next/server";
import { PrivyClient } from "@privy-io/server-auth";

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID!,
  process.env.PRIVY_SECRET_KEY!
);
//server wallet configuration to send funds to embedded wallets of new users

async function sendtransaction(address: `0x${string}`) {
  const data = await privy.walletApi.ethereum.sendTransaction({
    walletId: process.env.PRIVY_SERVER_WALLET_ID!,
    caip2: "eip155:84532",
    transaction: {
      to: address,
      value: 10000000000000000, // 0.01 ETH  to new users via sepolia eth network
      chainId: 84532,
    },
  });

  return data;
}
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const address = data.address;
    const result = await sendtransaction(address);
    return NextResponse.json({ result, status: 200 });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ status: 500 });
  }
}
