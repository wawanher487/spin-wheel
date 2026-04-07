import { supabase } from "./supabase";

export const getAvailablePrizes = async () => {
    const { data, error } = await supabase.from("stock").select("*");

    if (error) {
        console.error("ERROR SUPABASE:", error);
        return [];
    }

    console.log("DATA STOCK:", data); // Log the data

    return data?.filter((item) => item.quantity > 0) || [];
};



export const decreasePrizeStock = async (itemName: string) => {
  // ambil data sekarang
  const { data, error } = await supabase
    .from("stock")
    .select("*")
    .ilike("item", itemName)
    .single();

  if (error || !data) {
    console.error("ERROR GET STOCK:", error);
    return;
  }

  if(data.quantity <= 0)  return;

  // kurangi quantity
  const { error: updateError } = await supabase
    .from("stock")
    .update({
      quantity: data.quantity - 1,
    })
    .ilike("item", itemName);

  if (updateError) {
    console.error("ERROR UPDATE STOCK:", updateError);
  }
};