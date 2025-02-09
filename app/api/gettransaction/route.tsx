import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import { GoldRushClient } from "@covalenthq/client-sdk";


export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
  
      if (!body.address) {
        return NextResponse.json({ error: "Missing transaction data" }, { status: 400 });
      }
  
      const address = body.address; // Extract transaction value from request body     change address
      const client = new GoldRushClient(process.env.GOLD_RUSH_API_KEY!);

    const transactions: any[] = []; // Ensure it's an array

        for await (const tx of client.TransactionService.getAllTransactionsForAddress(
            "base-sepolia-testnet",
            address,
            //"0x4E9DE56262c7108C23e74658CE6489e4576c8263"
        )) {
            // Check if items exist and is an array before spreading
            if (tx.data?.items && Array.isArray(tx.data.items)) {-
                transactions.push(...tx.data.items);
            }
        }

        const firstFiveTransactions = transactions.slice(0, 5); // Get first 5 transactions

        const singleString = JSON.stringify(firstFiveTransactions, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
        );


      return NextResponse.json({ transactiondetail:singleString });
    } catch (error) {
      console.error("Error processing request:", error);
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }