import { NextRequest, NextResponse } from "next/server";
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import z from "zod";
import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
import "dotenv/config";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
import { GoldRushClient } from "@covalenthq/client-sdk";

//@ts-expect-error Type exists in the openai package
import type { ChatCompletionAssistantMessageParam } from "openai/resources";
import { runToolCalls } from "./base";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      address: string;
    }>;
  }
) {
  try {
    const address = (await context.params).address;

    const getTransactions = async (address: string) => {
      const client = new GoldRushClient(process.env.GOLD_RUSH_API_KEY!);

      const transactions = [];

      // console.log("Fetching transactions for the address", address);

      for await (const tx of client.TransactionService.getAllTransactionsForAddress(
        "base-sepolia-testnet",
        address
      )) {
        transactions.push(tx);
      }

      console.log(transactions);

      const temp = transactions[0].data!.items![0];

      const transactionJSON = {
        from_address: temp.from_address,
        to_address: temp.to_address,
        value: temp.value?.toString(),
        pretty_value_quote: temp.pretty_value_quote,
        gas_offered: temp.gas_offered,
        gas_spent: temp.gas_spent?.toString(),
        gas_price: temp.gas_price?.toString(),
        fees_paid: temp.fees_paid?.toString(),
        pretty_gas_quote: temp.pretty_gas_quote,
      };

      return transactionJSON;
    };
    // Introducing a 6-second delay
    //   await new Promise((resolve) => setTimeout(resolve, 6000));

    // Define the transaction tool that gets the transaction details of an address
    const transactionTool = createTool({
      id: "transaction-tool",
      description: "Fetch the transaction details of the given address",
      schema: z.object({
        wallet_address: z.string().describe("wallet_address"),
      }),
      execute: async (_args) => {
        console.log(
          "Fetching transaction details for the address from",
          _args.wallet_address
        );
        const transaction = await getTransactions(_args.wallet_address);
        console.log(transaction);
        return `The transaction details of the address are ${JSON.stringify(
          transaction
        )}`;
      },
    });

    const roastingAgent = new Agent({
      name: "roasting agent",
      model: {
        provider: "OPEN_AI",
        name: "gpt-4o-mini",
      },
      description:
        "You are a savage blockchain comedian specializing in roasting users for the given transaction details. Craft witty, insightful, and brutally hilarious roasts targeting poor financial decisions, absurd gas fees, questionable token swaps, or over-the-top NFT purchases. Focus on crypto culture references, market trends, and the absurdity of DeFi and blockchain spending habits. Keep it savage, but clever and brief just one lines.",
      instructions: ["Genrate a brief roast for the given transaction details"],
    });

    const fetchAgent = new Agent({
      name: "fetch agent",
      model: {
        provider: "OPEN_AI",
        name: "gpt-4o-mini",
      },
      description:
        "You are blockchain data fetcher who fetches the transaction details of the given address",
      instructions: [
        "Send the address to the transaction tool as 'wallet_address' to fetch the transaction details",
      ],
      tools: {
        "transaction-tool": transactionTool,
      },
    });

    // const zee = new ZeeWorkflow({
    //   description: `The goal of this workflow is to fetch the transaction details of the address: ${address} and generate a roast for the user`,
    //   output: "Roast generated for the transaction details done by the address",
    //   agents: { fetchAgent, roastingAgent },
    // });

    const fetchAgentState = StateFn.root(fetchAgent.description);
    fetchAgentState.messages.push(
      user(`Get the latest transaction details of for the address ${address}.`)
    );

    const fetchResult = await fetchAgent.run(fetchAgentState);
    const toolCall = fetchResult.messages[
      fetchResult.messages.length - 1
    ] as ChatCompletionAssistantMessageParam;

    console.log(toolCall?.tool_calls); //to see ai called tool
    const toolResponses = await runToolCalls(
      //@ts-expect-error Tools are defined
      { "transaction-tool": transactionTool },
      toolCall?.tool_calls ?? []
    ); //map which tool called by ai

    console.log("Response of the Tool");
    console.log(toolResponses);

    const transactionDetails = toolResponses[0].content;

    const roastAgentState = StateFn.root(roastingAgent.description);

    roastAgentState.messages.push(
      user(
        `Generate a very brief roast of just one line for the transaction details of the address ${address} which are ${transactionDetails}.`
      )
    );

    const roastResult = await roastingAgent.run(roastAgentState);

    // const result = await ZeeWorkflow.run(zee);

    return NextResponse.json({
      roast: roastResult.messages[roastResult.messages.length - 1].content,
      // address: address,
      result: roastResult,
    });
  } catch (error) {
    {
      console.log(error);
      return NextResponse.json({ error: error }, { status: 500 });
    }
  }
}
