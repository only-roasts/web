import { NextResponse, NextRequest } from "next/server";
import {PrivyClient} from '@privy-io/server-auth';
const app_id=process.env.app_id;
const secret_key=process.env.secret_key;
const wallet_id=process.env.wallet_id;
const privy = new PrivyClient(app_id,secret_key);
//server wallet configuration to send funds to embedded wallets of new users

async function sendtransaction(address:`0x${string}`) {
    const data = await privy.walletApi.ethereum.sendTransaction({
        walletId: wallet_id,
        caip2: "eip155:11155111",  
        transaction: {
          to: address, 
          value: 10000000000000000,  // 0.01 ETH  to new users via sepolia eth network
          chainId: 11155111,  
        },
      });
      
      return data;
      

   
}
export async function POST(request: NextRequest) {
    try {
      const data = await request.json();
      const address=data.address;
      const result=await sendtransaction(address);
      return NextResponse.json(
        { status: 200 }
      );
    }
    catch(e){ 
        console.log(e);
        return NextResponse.json(
        { status: 500 }
          );

    }
}