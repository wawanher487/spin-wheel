import { supabase } from "@/lib/supabase";
import { useState } from "react";


type Props = {
  onSubmit: (name: string, email: string) => void;
};


export default function RegistrationForm({onSubmit}: Props) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email ) {
        alert("Nama dan email wajib diisi!");
        return;
    }

    const {error} = await supabase.from("users").insert({
        name,
        email,
        language: "bilingual",
    });

    if(error) {
        console.error("ERROR:", error);
        alert("Gagal menyimpan data");
        return;
    }

    onSubmit(name, email);
    }

    return(
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto mt-10">
            <input
                type="text"
                placeholder="Nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 rounded"
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 rounded"
            />
            <button type="submit" className="bg-secondary text-white px-4 py-2 rounded">
                Daftar & Lanjut
            </button>
        </form>
    )
}