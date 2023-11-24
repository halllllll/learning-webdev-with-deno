import { serveDir } from 'https://deno.land/std@0.208.0/http/file_server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5';
import 'https://deno.land/std@0.193.0/dotenv/load.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_API_KEY = Deno.env.get("SUPABASE_API_KEY");

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

Deno.serve(async (req) => {
    const pathname = new URL(req.url).pathname;

    if (req.method === "GET" && pathname === "/messages") {
        // all
        const { data, error } = await supabaseClient.from("messages").select("*");
        if (error) {
            return new Response(JSON.stringify(error), { status: 500 })
        }

        return new Response(JSON.stringify(data))
    }

    return serveDir(req, {
        fsRoot: 'public',
        urlRoot: '',
        showDirListing: true,
        enableCors: true,
    });

});
