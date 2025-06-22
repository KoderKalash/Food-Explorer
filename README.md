
# 🥫 Food Product Explorer

A responsive web application built with **Next.js** and **TypeScript** that lets users search, filter, and explore food products from around the world using the [OpenFoodFacts API](https://world.openfoodfacts.org/). Users can view product details, search by name or barcode, filter by category, and sort based on nutrition or name.

---
# 🧮 Filter Feature

**Search & Filter System**: Users can search by product name or barcode, filter by food categories (dairy, snacks, etc.), and sort by name or nutrition grade. All requests go through a Next.js API route that fetches data from OpenFoodFacts and returns filtered results to the frontend.

---

## ✨ Features

* 🔍 **Search** for products by **name** or **barcode**
* 🗂 **Filter** by food **category**
* ↕️ **Sort** by:

  * Product Name (A-Z / Z-A)
  * Nutrition Grade (A to E / E to A)
* 📄 **Product Detail Page** with:

  * Product image
  * Ingredients list
  * Nutritional values (energy, fat, carbs, etc.)
  * Labels (e.g., vegan, gluten-free)
* ⏬ **Load more / Infinite scroll**
* 📱 **Responsive Design** for mobile and desktop
* ⚡ Fast & optimized performance using **Next.js** with server-side rendering

---

## 🛠 Tech Stack

* **Framework**: [Next.js](https://nextjs.org/)
* **Language**: [TypeScript](https://www.typescriptlang.org/)
* **Styling**: [TailwindCSS](https://tailwindcss.com/)
* **API**: [OpenFoodFacts API](https://world.openfoodfacts.org/)
* **State Management**: React `useState`

---

## 🔗 API Endpoints Used

* **Search by name:**
  `https://world.openfoodfacts.org/cgi/search.pl?search_terms={name}&json=true`

* **Search by barcode:**
  `https://world.openfoodfacts.org/api/v0/product/{barcode}.json`

* **Get by category:**
  `https://world.openfoodfacts.org/category/{category}.json`

* **Sample product detail:**
  `https://world.openfoodfacts.org/api/v0/product/737628064502.json`

---

## 🧪 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/food-explorer.git
cd food-explorer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

### 4. Open in Browser

```
http://localhost:3000
```

---

## 🧼 Scripts

* `dev` – Start development server
* `build` – Build for production
* `start` – Start the production build
* `lint` – Run ESLint

---

## ✅ To-Do / Improvements

* [ ] Add cart functionality (bonus)
* [ ] Enhance error handling (offline API / fallback UI)
* [ ] Add unit tests with Jest or React Testing Library

---

## 🙌 Acknowledgements

* [OpenFoodFacts](https://world.openfoodfacts.org/) – for the open product data
* [TailwindCSS](https://tailwindcss.com/)
* [Next.js](https://nextjs.org/)


