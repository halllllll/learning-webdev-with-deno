import { serveDir } from 'https://deno.land/std@0.208.0/http/file_server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.5';
import 'https://deno.land/std@0.193.0/dotenv/load.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_API_KEY = Deno.env.get("SUPABASE_API_KEY");

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_API_KEY);

Deno.serve(async (req) => {
    const pathname = new URL(req.url).pathname;
    console.log(req.method, pathname);

    if (req.method === "GET" && pathname === "/messages") {
        // all
        const { data, error } = await supabaseClient.from("messages").select("*");
        if (error) {
            return new Response(JSON.stringify(error), { status: 500 })
        }

        return new Response(JSON.stringify(data))
    }

    if (req.method === "POST" && pathname === "/messages") {
        console.log("きた？？・")
        const requestParams = await req.json();
        const { error } = await supabaseClient.from("messages").insert({
            author: requestParams.author,
            message: requestParams.message
        });
        if (error) {
            return new Response(JSON.stringify(error), { error: 500 });
        }

        return new Response(JSON.stringify({
            resp: "success",
        }))
    }

    const putNicePattern = new URLPattern({
        pathname: "/messages/:id/nice"
    });

    // testとexecをこういう感じで使い分けてるのが良い
    if (req.method === "PUT" && putNicePattern.test({ pathname })) {
        const messageId = putNicePattern.exec({ pathname }).pathname.groups.id;
        const requestParams = await req.json();

        const { error } = await supabaseClient.from("messages").update({ nice_count: requestParams.nice_count }).eq("id", Number(messageId));

        if (error) {
            return new Response(JSON.stringify(error), { status: 500 });
        }
        // success NICE
        return new Response(
            JSON.stringify(
                {
                    resp: "success"
                })
        );
    }
    const deletePattern = new URLPattern({ pathname: "/messages/:id" });
    if (req.method === "DELETE" && deletePattern.test({ pathname })) {
        const messsageId = deletePattern.exec({ pathname }).pathname.group;

        const { error } = await supabaseClient.from("messages").delete().eq("id", Number(messsageId));

        if (error) {
            return new Response(JSON.stringify(error), { status: 500 });
        }

        return new Response(JSON.stringify({
            resp: "success"
        }));
    }

    return serveDir(req, {
        fsRoot: 'public',
        urlRoot: '',
        showDirListing: true,
        enableCors: true,
    });

});
