"use client";

import { useSession } from "next-auth/react";
import { api } from "@/convex/_generated/api";
import { User } from "@/lib/types";
import { useMutation } from "convex/react";
import Image from "next/image";
import { useEffect, useState } from "react";

function UserLabel() {
  const session = useSession();
  const createUser = useMutation(api.users.createUser);
  const [USER, setUser] = useState<User | null>(null);

  useEffect(() => {
    const createUserOrGet = async () => {
      const user = session?.data?.user;
      if (!user) return;
      if (user.email && user.image && user.name) {
        const u = await createUser({
          email: user.email,
          username: user.name,
          picture: user.image,
        });
        setUser(u);
      }
    };

    createUserOrGet();
  }, [session]);

  return (
    <div className="flex items-center gap-2">
      <Image
        src={USER?.picture || session.data?.user?.image || "/trash-bin.scg"}
        alt={
          USER?.username ||
          USER?.picture ||
          session.data?.user?.image ||
          "avarat"
        }
        width={100}
        height={100}
        className="w-8 h-8 rounded-full"
      />
      {USER?.username}
    </div>
  );
}

export default UserLabel;
