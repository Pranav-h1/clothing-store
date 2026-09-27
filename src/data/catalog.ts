/**
 * CATALOG SOURCE — the one switch point between demo and real data.
 *
 * Today the storefront reads the demo catalog bundled in `./demo`. To go live,
 * replace these exports with the real catalog (a JSON file, a CMS, or a
 * database query) — pages and components only import from this module.
 */
export { demoProducts as baseProducts } from "./demo/products";
export { demoCategories as categories } from "./demo/categories";
