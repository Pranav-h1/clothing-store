import type { Metadata } from "next";
import View from "./view";

export const metadata: Metadata = { title: "Inventory" };

export default function Page() {
  return <View />;
}
