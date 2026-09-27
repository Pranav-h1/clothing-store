import type { Category } from "@/lib/types";
import { photo } from "./photo";

/** DEMO DATA — replace with the real store categories. */
export const demoCategories: Category[] = [
  {
    slug: "dresses",
    name: "Dresses",
    description: "Fluid silhouettes for long lunches, late dinners and everything between.",
    image: photo("1595777457583-95e059d581b8", "Woman in a flowing red maxi dress walking outdoors"),
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    description: "Coats and jackets cut to layer, built to last for seasons.",
    image: photo("1539533018447-63fcce2678e3", "Camel belted trench coat worn on stone steps"),
  },
  {
    slug: "knitwear",
    name: "Knitwear",
    description: "Soft, substantial knits in natural tones.",
    image: photo("1558769132-cb1aea458c5e", "Neutral knit sweaters hanging on a wooden rail"),
  },
  {
    slug: "shirts-tops",
    name: "Shirts & Tops",
    description: "Crisp poplins, easy blouses and shirting for every week.",
    image: photo("1609505848912-b7c3b8b4beda", "Woman in a white ruffled off-shoulder blouse"),
  },
  {
    slug: "tailoring",
    name: "Tailoring",
    description: "Sharp, softly structured suiting with a modern cut.",
    image: photo("1552374196-1ab2a1c593e8", "Man in a camel blazer seated on a wooden stool"),
  },
  {
    slug: "trousers-denim",
    name: "Trousers & Denim",
    description: "Straight legs, easy joggers and honest denim.",
    image: photo("1604176354204-9268737828e4", "Stack of folded denim jeans in several washes"),
  },
  {
    slug: "essentials",
    name: "Essentials",
    description: "The tees and sweatshirts you reach for first.",
    image: photo("1586790170083-2f9ceadc732d", "Man in a plain white crew-neck t-shirt"),
  },
];
