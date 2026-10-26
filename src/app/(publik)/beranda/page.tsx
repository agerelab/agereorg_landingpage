import { redirect } from "next/navigation";

/** Legacy /beranda route redirects to root "/" (FE-18, agereorg.com). */
export default function BerandaRedirect() {
  redirect("/");
}
