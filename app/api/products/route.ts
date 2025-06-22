import { type NextRequest, NextResponse } from "next/server"

const PAGE_SIZE = 20

async function retryFetch(url: string, init: RequestInit = {}, retries = 3, delayMs = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, {
        ...init,
        // avoid Next.js cache layer; always fresh
        cache: "no-store",
        headers: {
          // identify our app; some OF servers reject missing UA
          "User-Agent": "FoodProductExplorer/1.0 (+https://example.com)",
          ...(init.headers || {}),
        },
      })
      if (!res.ok) throw new Error(`status ${res.status}`)
      return res
    } catch (err) {
      if (i === retries - 1) throw err
      // exponential back-off
      await new Promise((r) => setTimeout(r, delayMs * (i + 1)))
    }
  }
  // Should never reach here
  throw new Error("retryFetch failed")
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const page = Number(searchParams.get("page") ?? 1)
  const searchTerm = searchParams.get("searchTerm") ?? ""
  const barcode = searchParams.get("barcode") ?? ""
  const category = searchParams.get("category") ?? "all-categories"

  let upstreamUrl = ""

  try {
    // --- Build correct OpenFoodFacts URL -------------------------------
    if (barcode) {
      upstreamUrl = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      const res = await retryFetch(upstreamUrl)
      const data = await res.json()

      if (data.status === 1 && data.product) {
        return NextResponse.json({
          products: [data.product],
          page: 1,
          pageCount: 1,
        })
      }
      return NextResponse.json({ products: [], page: 1, pageCount: 1 }, { status: 404 })
    }

    if (searchTerm) {
      upstreamUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
        searchTerm,
      )}&page=${page}&json=true&page_size=${PAGE_SIZE}`
    } else if (category !== "all-categories") {
      upstreamUrl = `https://world.openfoodfacts.org/category/${category}/${page}.json?page_size=${PAGE_SIZE}`
    } else {
      upstreamUrl = `https://world.openfoodfacts.org/cgi/search.pl?action=process&sort_by=popularity&page=${page}&json=true&page_size=${PAGE_SIZE}`
    }

    const res = await retryFetch(upstreamUrl)
    const data = await res.json()

    const pageCount = data.page_count ?? (data.count ? Math.ceil(data.count / PAGE_SIZE) : 1)

    return NextResponse.json({
      products: data.products ?? [],
      page,
      pageCount,
    })
  } catch (err) {
    console.error("Upstream fetch failed:", err)
    return NextResponse.json({ message: "Upstream fetch failed", error: String(err) }, { status: 500 })
  }
}
