"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_BASE_URL } from "../services/apiClient";
import { AddProduct, Product } from "./addProduct";
import Swal from "sweetalert2";

export default function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const token = Cookies.get("token");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });
                const data = await res.json();
                setProducts(data?.data || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [token, products]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700";
            case "inactive":
                return "bg-yellow-100 text-yellow-700";
            case "archived":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    // handle product add
    const handleAddProduct = (newProduct: Product) => {
        setProducts(prev => [newProduct, ...prev]);
    };

    if (loading) {
        return (
            <div className="p-4 text-center text-muted-foreground">
                Loading products...
            </div>
        );
    }


    // handel product  delete 
    const handleDeleteProduct = async (id: string) => {
        const token = Cookies.get("token");

        // Show SweetAlert confirmation
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#6A0DAD",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.message || "Failed to delete product");
                }

                // Update UI instantly by filtering out deleted product
                setProducts((prev) => prev.filter((product) => product.id !== id));

                Swal.fire({
                    icon: "success",
                    title: "Deleted!",
                    text: "Product has been deleted successfully.",
                });
            } catch (error: unknown) {
                let message = "Something went wrong";
                if (error instanceof Error) message = error.message;

                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: message,
                });
            }
        }
    };


    return (
        <div className="bg-white rounded-xl p-4 shadow-sm">
            {/* Top header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-xl">Product List</h2>
                <AddProduct onAddProduct={handleAddProduct} />
            </div>

            {/* Responsive table */}
            <ScrollArea className="w-full overflow-x-auto">
                <Table className="min-w-[900px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6">
                                    No products found
                                </TableCell>
                            </TableRow>
                        )}

                        {products.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Image
                                        src={product.productImg}
                                        alt={product.name}
                                        width={30}
                                        height={30}
                                        className="rounded-lg border"
                                    />
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price}</TableCell>
                                <TableCell>{product.quantity}</TableCell>
                                <TableCell>
                                    <Badge className={getStatusColor(product.status)}>
                                        {product.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button size="sm" variant="outline">Edit</Button>
                                    <Button onClick={() => handleDeleteProduct(product.id)} size="sm" variant="destructive">Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </ScrollArea>
        </div>
    );
}
