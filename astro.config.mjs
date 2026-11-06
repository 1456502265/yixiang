import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { siteUrl } from "./src/config/domain.mjs";
export default defineConfig({site:siteUrl,output:"static",trailingSlash:"always",integrations:[sitemap({filter:(url)=>!url.endsWith("/404/")})]});
