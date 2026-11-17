// POST /api/choice  {num, choice: "interested"|"not_interested"|"none"}
// GET  /api/choice  -> all choices
// Standard Pages Function. When a D1 database is bound to this Pages project
// as DB, choices are written to D1 at once. Until that binding exists (the
// account token used to publish holds Pages permission only; D1 create was
// refused with HTTP 401 on 2026-11-17), it answers stored:false and the page
// keeps the choice on the reader's own device instead. No lock, no passcode.
export async function onRequest(context) {
  const { request, env } = context;
  const headers = { "Content-Type": "application/json" };
  if (!env.DB) {
    return new Response(JSON.stringify({ ok: true, stored: false, reason: "D1 store not connected yet; choice kept on this device" }), { headers });
  }
  if (request.method === "GET") {
    const { results } = await env.DB.prepare("SELECT num, choice FROM listings WHERE choice != 'none'").all();
    return new Response(JSON.stringify({ ok: true, stored: true, choices: results }), { headers });
  }
  if (request.method === "POST") {
    const body = await request.json();
    const num = parseInt(body.num, 10);
    const choice = ["interested", "not_interested", "none"].includes(body.choice) ? body.choice : null;
    if (!num || !choice) return new Response(JSON.stringify({ ok: false, error: "bad num or choice" }), { status: 400, headers });
    await env.DB.prepare("UPDATE listings SET choice = ? WHERE num = ?").bind(choice, num).run();
    return new Response(JSON.stringify({ ok: true, stored: true, num, choice }), { headers });
  }
  return new Response(JSON.stringify({ ok: false, error: "method not allowed" }), { status: 405, headers });
}
