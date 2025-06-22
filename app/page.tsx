"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Search, Filter, SortAsc, SortDesc, Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface Product {
  _id: string
  product_name: string
  image_url?: string
  categories?: string
  ingredients_text?: string
  nutrition_grades?: string
  brands?: string
  code: string
}

interface ApiResponse {
  products: Product[]
  page: number
  pageCount: number
}

const NUTRITION_GRADE_COLORS = {
  a: "bg-green-500",
  b: "bg-lime-500",
  c: "bg-yellow-500",
  d: "bg-orange-500",
  e: "bg-red-500",
}

const CATEGORIES = [
  "beverages",
  "dairy",
  "snacks",
  "breakfast-cereals",
  "bread",
  "chocolate",
  "cookies",
  "frozen-foods",
  "meat",
  "fish",
  "fruits",
  "vegetables",
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [barcode, setBarcode] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all-categories")
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState("")

  const fetchProducts = useCallback(
    async (pageNum = 1, reset = false) => {
      try {
        if (pageNum === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }
        setError("");

        const params = new URLSearchParams({
          page: pageNum.toString(),
          searchTerm,
          barcode,
          category: selectedCategory,
        })

        const res = await fetch(`/api/products?${params.toString()}`)
        if (!res.ok) throw new Error("Request failed")

        const data: ApiResponse = await res.json()

        if (reset || pageNum === 1) {
          setProducts(data.products || [])
        } else {
          setProducts((prev) => [...prev, ...(data.products || [])])
        }

        setHasMore(pageNum < (data.pageCount || 1))
      } catch (err) {
        console.error("Error fetching products:", err)
        setError("Failed to fetch products. Please try again.")
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    [searchTerm, barcode, selectedCategory],
  )

  useEffect(() => {
    setPage(1)
    fetchProducts(1, true)
  }, [fetchProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setBarcode("") // Clear barcode when searching by name
    fetchProducts(1, true)
  }

  const handleBarcodeSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setSearchTerm("")
    fetchProducts(1, true)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSearchTerm("")
    setBarcode("")
    setPage(1)
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchProducts(nextPage, false)
  }

  const sortedProducts = [...products].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case "name":
        comparison = (a.product_name || "").localeCompare(b.product_name || "")
        break
      case "grade":
        const gradeA = a.nutrition_grades || "z"
        const gradeB = b.nutrition_grades || "z"
        comparison = gradeA.localeCompare(gradeB)
        break
      default:
        comparison = 0
    }

    return sortOrder === "desc" ? -comparison : comparison
  })

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Food Product Explorer</h1>
          <p className="text-gray-600">Discover and explore food products from around the world</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Name Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" type="submit" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </form>

            {/* Barcode Search */}
            <form onSubmit={handleBarcodeSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="Search by barcode..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline" type="submit" size="sm">
                <Package className="w-4 h-4" />
              </Button>
            </form>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2 " />
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all-categories">All Categories</SelectItem>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="name">Product Name</SelectItem>
                  <SelectItem value="grade">Nutrition Grade</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={toggleSortOrder}>
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2">
            {searchTerm && (
              <Badge variant="secondary">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1 text-xs">
                  ×
                </button>
              </Badge>
            )}
            {barcode && (
              <Badge variant="secondary">
                Barcode: {barcode}
                <button onClick={() => setBarcode("")} className="ml-1 text-xs">
                  ×
                </button>
              </Badge>
            )}
            {selectedCategory !== "all-categories" && (
              <Badge variant="secondary">
                Category: {selectedCategory.replace("-", " ")}
                <button onClick={() => setSelectedCategory("all-categories")} className="ml-1 text-xs">
                  ×
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {sortedProducts.map((product) => (
                <Link key={product._id || product.code} href={`/product/${product.code || product._id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="aspect-square relative mb-4 bg-gray-100 rounded-lg overflow-hidden">
                        {product.image_url ? (
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.product_name || "Product image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>

                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">
                        {product.product_name || "Unknown Product"}
                      </h3>

                      {product.brands && <p className="text-xs text-gray-600 mb-2">{product.brands}</p>}

                      <div className="flex items-center justify-between mb-2">
                        {product.nutrition_grades && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-600">Grade:</span>
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${NUTRITION_GRADE_COLORS[
                                product.nutrition_grades.toLowerCase() as keyof typeof NUTRITION_GRADE_COLORS
                                ] || "bg-gray-400"
                                }`}
                            >
                              {product.nutrition_grades.toUpperCase()}
                            </div>
                          </div>
                        )}
                      </div>

                      {product.categories && (
                        <p className="text-xs text-gray-500 line-clamp-1">{product.categories.split(",")[0]}</p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && products.length > 0 && (
              <div className="text-center">
                <Button onClick={handleLoadMore} disabled={loadingMore} size="lg">
                  {loadingMore ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Loading more...
                    </>
                  ) : (
                    "Load More Products"
                  )}
                </Button>
              </div>
            )}

            {/* No Products Found */}
            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
