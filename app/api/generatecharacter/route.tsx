import { NextRequest, NextResponse } from "next/server";
import { Agent, createTool, ZeeWorkflow } from "@covalenthq/ai-agent-sdk";
import { user } from "@covalenthq/ai-agent-sdk/dist/core/base";
import { StateFn } from "@covalenthq/ai-agent-sdk/dist/core/state";
import "dotenv/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.transaction) {
      return NextResponse.json({ error: "Missing transaction data" }, { status: 400 });
    }

    const user_prompt = body.transaction; // Extract transaction value from request body
    
    type Message = {
      role: string;
      content: string;
    };
    
    type Result = {
      messages: Message[];
    };
    function extractAssistantReply(result: Result): string | null {
      const assistantMessage = result.messages.find(msg => msg.role === "assistant");
      return assistantMessage ? assistantMessage.content : null;
    }
    

    const agent = new Agent({
      name: "transaction agent",
      model: {
        provider: "OPEN_AI",
        name: "gpt-4o-mini",
      },
      description: `This agent analyzes a user's Ethereum transaction history and generates a *highly detailed image generation prompt* for an AI model.  

The prompt must describe a *fantasy, cyberpunk, or futuristic character* that represents the user's *on-chain activity* with unique *traits, attire, and accessories.*  

### *Transaction Factors to Consider:*  
1. *Transaction Frequency* → Frequent user, occasional user, new user  
2. *Spending Behavior* → Small frequent payments, large transactions, gas fee struggles  
3. *Personality Traits* → Whale investor, high-risk gambler, cautious saver, gas fee victim  

### *Instructions for Output Format:*  
Respond strictly in the following format:  

*Title:* [Creative name for the character]  

*Character Description:*  
"A [fantasy/cyberpunk/medieval] character reflecting their blockchain behavior.  
- If they send frequent transactions, they wear *a cloak made of transaction receipts*, and their eyes glow from overwork.  
- If they are a new user, they are a *confused wizard staring at an endless loop of 'Transaction Failed' messages.*  
- If they pay excessive gas fees, they carry a *burning Ethereum gas canister* with a sad expression.  
- If they are a whale, they sit on a *throne made of Ethereum blocks*, overlooking the mere mortals below.  
- If they lost money in a bad trade, they clutch an *empty crypto wallet* with a teardrop falling.  

*Small Text in the Image:*  
- ‘Pending… Pending…’ (floating near them if they have failed transactions)  
- ‘Is $10 enough for gas?’ (written on their forehead if they struggle with gas fees)  
- ‘Bro, take a break.’ (graffiti on the wall if they spam transactions)  
- ‘Where did my ETH go?’ (written on their hand if they lost money in a bad trade)  

The background and character details should visually match their on-chain activity."
"Generated prompt must be less than 800 characters.`,

      instructions: [
        "Analyze the transaction history and determine spending behavior.",
        "Generate a structured and detailed image prompt in the exact format provided.",
        "Ensure the response follows the format exactly, including title, description, and small text references.",
        "Do not explain the reasoning behind the response—only generate the formatted image prompt.",
        "Don't use backticks (`) in the prompt.",
        "Don't use newline characters (`\\n`) in the prompt.",
        "Generated prompt must be less than 800 characters.",
        "make the generated prompt very shorter"
      ],
    });

    const state = StateFn.root(agent.description);
    state.messages.push(user(user_prompt)); // Add the user transaction data

    const result = await agent.run(state);
    const res=extractAssistantReply(result)

    return NextResponse.json({ res });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
