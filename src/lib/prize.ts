import { supabase } from "./supabase";

export const getAvailablePrizes = async () => {
    const { data, error } = await supabase.from("stock").select("*").gt("quantity", 0);

    if (error) {
        console.error("ERROR SUPABASE:", error);
        return [];
    }

    return data;
};



export const decreasePrizeStock = async (id: string) => {
    const { data, error } = await supabase
        .from("stock")
        .select("quantity")
        .eq("id", id)
        .single();

    if (error || !data) {
        console.error("ERROR GET:", error);
        return;
    }

    if (data.quantity <= 0) return;

    const { error: updateError } = await supabase
        .from("stock")
        .update({
        quantity: data.quantity - 1,
        })
        .eq("id", id);

    if (updateError) {
        console.error("ERROR UPDATE:", updateError);
    }
};