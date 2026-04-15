/**
 * AI chat is disabled. Restore streaming + tools from git history when
 * re-enabling; wire `<ChatDrawer />` back into `src/app/page.tsx`.
 */
export async function POST() {
  return Response.json(
    { error: "Chat is temporarily unavailable." },
    { status: 503 }
  );
}
