import { NextRequest, NextResponse } from "next/server";

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

  const params = await context.params;

  const address = params.id;

  return NextResponse.json({
    roast: " You've been rickrolled ",
    address: address,
  });
}
