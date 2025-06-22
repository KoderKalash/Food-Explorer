"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Package, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ProductDetail {
  code: string
  product_name: string
  brands?: string
  image_url?: string
  ingredients_text?: string
  nutrition_grades?: string
  categories?: string
  labels?: string
  nutriments?: {
    energy_100g?: number
    fat_100g?: number
    "saturated-fat_100g"?: number
    carbohydrates_100g?: number
    sugars_100g?: number
    proteins_100g?: number
    salt_100g?: number
    fiber_100g?: number
  }
  allergens?: string
  traces?: string
  manufacturing_places?: string
  origins?: string
  packaging?: string
  stores?: string
  countries?: string
}

const NUTRITION_GRADE_COLORS = {
  a: "bg-green-500",
  b: "bg-lime-500",
  c: "bg-yellow-500",
  d: "bg-orange-500",
  e: "bg-red-500",
}

const NUTRITION_GRADE_DESCRIPTIONS = {
  a: "Very good nutritional quality",
  b: "Good nutritional quality",
  c: "Average nutritional quality",
  d: "Poor nutritional quality",
  e: "Very poor nutritional quality",
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const barcode = params.barcode as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`)
        const data = await response.json()

        if (data.status === 1 && data.product) {
          setProduct(data.product)
        } else {
          setError("Product not found")
        }
      } catch (err) {
        setError("Failed to fetch product details")
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    if (barcode) {
      fetchProduct()
    }
  }, [barcode])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 animate-pulse text-gray-400 mx-auto mb-4" />
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The requested product could not be found."}</p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const formatNutrientValue = (value: number | undefined, unit = "g") => {
    if (value === undefined || value === null) return "N/A"
    return `${value.toFixed(1)} ${unit}`
  }

  const getLabels = (labelsString?: string) => {
    if (!labelsString) return []
    return labelsString
      .split(",")
      .map((label) => label.trim())
      .filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image and Basic Info */}
          <div>
            <Card>
              <CardContent className="p-6">
                <div className="aspect-square relative mb-6 bg-gray-100 rounded-lg overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.product_name || "Product image"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-24 h-24 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{product.product_name || "Unknown Product"}</h1>
                    {product.brands && <p className="text-lg text-gray-600">{product.brands}</p>}
                  </div>

                  {product.nutrition_grades && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">Nutrition Grade:</span>
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                          NUTRITION_GRADE_COLORS[
                            product.nutrition_grades.toLowerCase() as keyof typeof NUTRITION_GRADE_COLORS
                          ] || "bg-gray-400"
                        }`}
                      >
                        {product.nutrition_grades.toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-600">
                        {
                          NUTRITION_GRADE_DESCRIPTIONS[
                            product.nutrition_grades.toLowerCase() as keyof typeof NUTRITION_GRADE_DESCRIPTIONS
                          ]
                        }
                      </span>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <strong>Barcode:</strong> {product.code}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Categories */}
            {product.categories && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.categories.split(",").map((category, index) => (
                      <Badge key={index} variant="secondary">
                        {category.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Labels */}
            {product.labels && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Labels & Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {getLabels(product.labels).map((label, index) => (
                      <Badge key={index} variant="outline" className="text-green-700 border-green-300">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Nutritional Information */}
            {product.nutriments && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nutritional Information (per 100g)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Energy:</span>
                        <span className="font-medium">{formatNutrientValue(product.nutriments.energy_100g, "kJ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span className="font-medium">{formatNutrientValue(product.nutriments.fat_100g)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="ml-4">Saturated fat:</span>
                        <span>{formatNutrientValue(product.nutriments["saturated-fat_100g"])}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbohydrates:</span>
                        <span className="font-medium">
                          {formatNutrientValue(product.nutriments.carbohydrates_100g)}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span className="ml-4">Sugars:</span>
                        <span>{formatNutrientValue(product.nutriments.sugars_100g)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Proteins:</span>
                        <span className="font-medium">{formatNutrientValue(product.nutriments.proteins_100g)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Salt:</span>
                        <span className="font-medium">{formatNutrientValue(product.nutriments.salt_100g)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fiber:</span>
                        <span className="font-medium">{formatNutrientValue(product.nutriments.fiber_100g)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ingredients */}
            {product.ingredients_text && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{product.ingredients_text}</p>
                </CardContent>
              </Card>
            )}

            {/* Allergens */}
            {product.allergens && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Allergens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.split(",").map((allergen, index) => (
                      <Badge key={index} variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        {allergen.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {product.manufacturing_places && (
                  <div>
                    <strong className="text-sm">Manufacturing places:</strong>
                    <p className="text-sm text-gray-600">{product.manufacturing_places}</p>
                  </div>
                )}
                {product.origins && (
                  <div>
                    <strong className="text-sm">Origins:</strong>
                    <p className="text-sm text-gray-600">{product.origins}</p>
                  </div>
                )}
                {product.packaging && (
                  <div>
                    <strong className="text-sm">Packaging:</strong>
                    <p className="text-sm text-gray-600">{product.packaging}</p>
                  </div>
                )}
                {product.stores && (
                  <div>
                    <strong className="text-sm">Stores:</strong>
                    <p className="text-sm text-gray-600">{product.stores}</p>
                  </div>
                )}
                {product.countries && (
                  <div>
                    <strong className="text-sm">Countries:</strong>
                    <p className="text-sm text-gray-600">{product.countries}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
