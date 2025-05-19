"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import CartButton from "@/components/layout/cart-button";
import { auth } from "@/auth";
import HeaderClient from "@/components/layout/header-client";

// This server component fetches the session and passes it to the client component
export default async function Header() {
  // Use auth() directly instead of getServerSession
  const session = await auth();

  return <HeaderClient session={session} />;
}
