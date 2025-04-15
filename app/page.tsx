import { auth, signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  return (
    <div className="h-full w-full sm:container mx-auto py-5">
      <div className="w-full flex justify-between">
        {!session?.user && (
          <div className="flex gap-2">
            <form
              action={async () => {
                "use server";
                await signIn("github");
              }}
            >
              <Button type="submit" size="xs" variant={"outline"}>
                sign in with Github
              </Button>
            </form>
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button type="submit" size="xs" variant={"outline"}>
                sign in with Google
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
