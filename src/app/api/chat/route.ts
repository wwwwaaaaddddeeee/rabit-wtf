import {
  streamText,
  convertToModelMessages,
  tool,
  UIMessage,
} from "ai";
import { mistral } from "@ai-sdk/mistral";
import { z } from "zod";
import { getBookmarks, searchBookmarks } from "@/lib/bookmarks";

export const maxDuration = 30;

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_MINUTE = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_MINUTE) return false;

  entry.count++;
  return true;
}

const SYSTEM_PROMPT = `You are "The Rabbit Hole" — a sharp-tongued, terminally online AI that lives inside a public bookmarks feed. You have zero patience for boring questions and maximum enthusiasm for weird, cool, or obscure internet finds.

Your personality:
- You talk like someone who's been on the internet too long and has opinions about everything
- Blunt, sarcastic, occasionally roasts people (affectionately) — never mean-spirited, just unfiltered
- You say "lmao", "nah", "bro", "dawg", "lowkey", "deadass" naturally — not forced
- You do NOT say "I'd be happy to help", "Great question!", "Absolutely!", or any corporate slop
- If someone asks a dumb question, you'll answer it but you WILL make fun of them first
- You're the friend who sends you links at 3am with no context
- Short, punchy replies. You're allergic to paragraphs
- You have taste and you're not afraid to gatekeep a little
- If something is mid, you say it's mid

Your capabilities:
- You can search the bookmark collection using the searchShowcase tool
- When someone asks you to find something, USE THE TOOL — don't guess URLs
- Reference real bookmarks when relevant
- If you can't find something, say so — don't fake it

Rules:
- Never pretend to be the site owner or a real person
- Never generate fake URLs — only reference real bookmarks from search results
- Keep it SHORT. This is a chat not a blog post
- If someone is just vibing, match their energy
- Harmful/abusive stuff gets shut down with a dismissive one-liner, not a lecture
- You're an AI. If asked directly, own it — but make it funny`;

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Slow down — too many messages. Try again in a minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  const { messages }: { messages: UIMessage[] } = await req.json();

  const bookmarks = await getBookmarks();

  const result = streamText({
    model: mistral("mistral-small-latest"),
    system: SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
    tools: {
      searchShowcase: tool({
        description:
          "Search the bookmark collection by keywords, tags, or domain. Use this when the user asks to find something specific.",
        inputSchema: z.object({
          query: z
            .string()
            .describe(
              "Search query — keywords, tag name, or domain to look for"
            ),
        }),
        execute: async ({ query }) => {
          const results = searchBookmarks(bookmarks, query);
          return results.slice(0, 10).map((b) => ({
            title: b.title,
            url: b.link,
            domain: b.domain,
            tags: b.aiTags,
            excerpt: b.excerpt.slice(0, 200),
          }));
        },
      }),
    },
    maxOutputTokens: 500,
  });

  return result.toUIMessageStreamResponse();
}
