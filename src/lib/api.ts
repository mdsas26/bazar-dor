import type { ProductDetails } from "../types/product";

const BASE_URL =
    "https://openapi.programming-hero.com/api/bazardor";

// Category-এর Type
export type Category = {
    id: string;
    slug: string;
    nameBn: string;
    icon: string;
};

// সব products আনার ফাংশন
export async function getProducts(): Promise<ProductDetails[]> {
    const response = await fetch(`${BASE_URL}/products`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    return response.json();
}

// Category অনুযায়ী products আনার ফাংশন
export async function getProductsByCategory(
    category: string
): Promise<ProductDetails[]> {
    const response = await fetch(
        `${BASE_URL}/products?category=${encodeURIComponent(category)}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch category products");
    }

    return response.json();
}

// ID দিয়ে একটি নির্দিষ্ট product আনার ফাংশন
export async function getProductById(
    id: number
): Promise<ProductDetails> {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch product");
    }

    return response.json();
}

// সব categories আনার ফাংশন
export async function getCategories(): Promise<Category[]> {
    const response = await fetch(`${BASE_URL}/categories`, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    return response.json();
}

// ID অথবা slug দিয়ে একটি নির্দিষ্ট category আনার ফাংশন
export async function getCategoryById(
    category: string
): Promise<Category> {
    const response = await fetch(
        `${BASE_URL}/categories/${encodeURIComponent(category)}`,
        {
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch category");
    }

    return response.json();
}

// Slug দিয়ে একটি নির্দিষ্ট product আনা
export async function getProductBySlug(
    slug: string
): Promise<ProductDetails> {
    const products = await getProducts();

    const product = products.find(
        (item) => item.slug === slug
    );

    if (!product) {
        throw new Error("Product not found");
    }

    return product;
}