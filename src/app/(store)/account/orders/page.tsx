import type { Metadata } from "next";
import View from "./view";

export const metadata: Metadata = { title: "Orders" };

export default function Page() {
  return <View />;
}
