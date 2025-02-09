import { NextRequest, NextResponse } from "next/server";
import {
  checkAlreadyCasted,
  updateSupabaseTable,
} from "../posting-reply-for-mention/utils";

export async function POST(req: NextRequest) {
  try {
    const { cast_hash } = await req.json();
    await updateSupabaseTable(cast_hash);

    const data = await checkAlreadyCasted(cast_hash);
    return NextResponse.json({ data: data, status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
