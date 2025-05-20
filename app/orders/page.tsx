import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | BlackVault",
  description: "View your order history and track current orders",
};

export default async function OrdersRedirectPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/profile/orders");
  }

  // Redirect to the profile orders page
  redirect("/profile/orders");
}
