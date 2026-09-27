import type { Metadata } from "next";
import { AccountShell } from "./account-shell";

export const metadata: Metadata = {
  title: { default: "My account", template: "%s · My account" },
  robots: { index: false },
};

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return <AccountShell>{children}</AccountShell>;
}
