import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function Page({ params }: { params: { reason: string } }) {
  const { reason } = await params;
  return (
    <div className="min-h-screen w-full flex justify-center">
      <div className="mt-24">
        <Card className="min-w-[400px]">
          <CardHeader>
            <CardTitle className="text-bold text-xl text-red-600" aria-label="error">
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CardDescription aria-label="error reason">Reason: {reason}</CardDescription>

            <Link
              className={`${buttonVariants({ variant: "default", size: "lg" })}`}
              href={"/landing"}
            >
              Home
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
