import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://usfbtwsqfvygdatpcmyw.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey!);

export const getRoastCount = async () => {
  const { data, error } = await supabase
    .from("roast_count_table")
    .select("roast_count");

  if (error) {
    throw error;
  }

  return Number(data[0]);
};

export const updateRoastCount = async () => {
  const latest_roast_count = await getRoastCount();

  const { error } = await supabase
    .from("roast_count_table")
    .update({ roast_count: latest_roast_count + 1 });

  if (error) {
    throw error;
  }
};
