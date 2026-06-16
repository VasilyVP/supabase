import { createClient } from "@/lib/server";

type Post = {
  id: string;
  title: string;
  content?: string;
  authorId: string;
  createdAt: string;
};

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const role = user ? "authenticated" : "anon";
  const canReadContent = role !== "anon";

  console.log("User:", user?.email, "Role:", role);

  // Invoke edge function to demonstrate auth context is passed correctly
  const functionResponse = await supabase.functions.invoke("edge-runner", {
    body: { name: "Supabase Functions" },
  });

  console.log("Function response:", functionResponse.data);

  let queryResponse: { data: Post[] | null; error: Error | null };

  if (canReadContent) {
    queryResponse = await supabase
      .from("Post")
      .select("id,title,content,authorId,createdAt")
      .order("createdAt", { ascending: false });
  } else {
    queryResponse = await supabase
      .from("Post")
      .select("id,title,authorId,createdAt")
      .order("createdAt", { ascending: false });
  }

  const { data, error } = queryResponse;

  const errorMessage = error?.message ?? null;
  const rows = data ?? [];

  const posts = rows.map((post) => ({
    id: post.id,
    title: post.title,
    authorId: post.authorId,
    createdAt: post.createdAt,
    content: canReadContent ? post.content : null,
  }));

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <main className="w-full max-w-3xl rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Posts
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Latest posts visible to your current role.
          </p>
        </div>

        {errorMessage ? (
          <p className="mt-8 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300">
            Could not load posts: {errorMessage}
          </p>
        ) : null}

        {!errorMessage && (!posts || posts.length === 0) ? (
          <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
            No posts found.
          </p>
        ) : null}

        {posts.length > 0 ? (
          <ul className="mt-8 space-y-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
              >
                <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                  {post.title}
                </h2>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  Author: {post.authorId} |{" "}
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                {canReadContent ? (
                  <div className="mt-3 rounded-md border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
                    <p className="text-[11px] uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                      Content
                    </p>
                    <p className="mt-1 min-h-8 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                      {post.content ?? ""}
                    </p>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </main>
    </div>
  );
}
