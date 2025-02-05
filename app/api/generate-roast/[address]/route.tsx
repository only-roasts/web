import { NextRequest, NextResponse } from "next/server";
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import z from "zod";
import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
import "dotenv/config";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";

export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  // Introducing a 6-second delay
  //   await new Promise((resolve) => setTimeout(resolve, 6000));

  // const weather = createTool({
  //   id: "weather-tool",
  //   description: "Fetch the current weather in Vancouver, BC",
  // schema: z.object({
  //   temperature: z.number(),
  // }),
  // execute: async (_args) => {
  //   const lat = 49.2827,
  //     lon = -123.1207;

  //   const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

  //   const r = await fetch(url);
  //   const data = await r.json();

  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   return `Current temperature in Vancouver, BC is ${data.current_weather.temperature}°C`;
  // },
  // });

  // const agent = new Agent({
  //   name: "research agent",
  //   model: {
  //     provider: "OPEN_AI",
  //     name: "gpt-4o-mini",
  //   },
  //   description:
  //     "You are a senior NYT researcher writing an article on the current weather in Vancouver, BC.",
  //   instructions: ["Use the weather tool to get the current weather"],
  //   tools: {
  //     weather,
  //   },
  // });

  // Define the transaction tool that sends Sepolia ETH
  const transactionTool = createTool({
    id: "transaction-tool",
    description: "Send Sepolia ETH to another address",
    schema: z.object({
      to: z.string().describe("recipient address"),
      amount: z.number().describe("amount in ETH to send"),
    }),
    execute: async (_args) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      return `Transaction successful! ${_args.amount} Sepolia ETH sent to ${_args.to}`;
    },
  });

  const agent = new Agent({
    name: "transaction agent",
    model: {
      provider: "OPEN_AI",
      name: "gpt-4o-mini",
    },
    description:
      "You are a blockchain transaction agent that helps users send Sepolia ETH",
    instructions: [
      "Use the transaction tool to send Sepolia ETH to another address",
    ],
    tools: { transactionTool },
  });

  const state = StateFn.root(agent.description);
  state.messages.push(
    user(
      " recipient's address : 0x5352b10D192475cA7Fa799e502c29Ab3AA28657F, amount of Sepolia ETH: 0.1"
    )
  );

  const result = await agent.run(state);

  const params = await context.params;

  const address = params.id;

  return NextResponse.json({
    // roast: " You've been rickrolled ",
    // address: address,
    result: result,
  });
}
