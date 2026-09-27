import type { Metadata } from "next";
import View from "./view";

export const metadata: Metadata = { title: "Dashboard" };

export default function Page() {
  return <View />;
}
