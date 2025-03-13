import { signIn } from "@/auth";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="h-screen w-full flex justify-center items-center">
      <div className="flex flex-col gap-2">
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
    </div>
  );
}
