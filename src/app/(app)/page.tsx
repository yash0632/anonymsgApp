'use client'

import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Home() {
  const session = useSession();
  console.log(session);
  return (
    <div>
      Akshit
    </div>
  );
}
