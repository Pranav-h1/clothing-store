import type { Metadata } from "next";
import View from "./view";

export const metadata: Metadata = { title: { absolute: "Admin sign in" } };

export default function Page() {
  return <View />;
}
