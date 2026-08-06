import type { MetadataRoute } from "next"

import { BASE_URL } from "@/lib/meta"

/** Admin i API se ne indeksiraju. /chef je uz to i noindex (korak 13). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/chef", "/api"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
