"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { API_BASE_URL } from "../services/apiClient";

export type ProductStatus = "active" | "inactive" | "archived";

export interface Product {
  id: string;
  name: string;
  productImg: string;
  price: number;
  quantity: number;
  status: ProductStatus;
  description: string;
}

interface AddProductModalProps {
  onAddProduct: (product: Product) => void;
}

interface FormInputs {
  name: string;
  productImg: string;
  price: number;
  quantity: number;
  status: ProductStatus;
  description: string;
}

export function AddProduct({ onAddProduct }: AddProductModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { status: "active" },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to add product");
      }

      onAddProduct(result); // Add new product to parent list
      reset(); // Clear form
      setOpen(false);

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product added successfully!",
      });
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (error instanceof Error) message = error.message;

      Swal.fire({
        icon: "error",
        title: "Error",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90">
          Add Product
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Fill the form below to add a new product.</DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Name *</label>
            <Input {...register("name", { required: "Product name is required" })} placeholder="Product name" />
            {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
          </div>

          {/* Image URL */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Image URL *</label>
            <Input {...register("productImg", { required: "Image URL is required" })} placeholder="Provide image URL" />
            {errors.productImg && <span className="text-red-500 text-sm">{errors.productImg.message}</span>}
          </div>

          {/* Price */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Price *</label>
            <Input
              type="number"
              step="0.01"
              {...register("price", {
                required: "Price is required",
                min: { value: 0.01, message: "Price must be > 0" },
                valueAsNumber: true,
              })}
              placeholder="100"
            />
            {errors.price && <span className="text-red-500 text-sm">{errors.price.message}</span>}
          </div>

          {/* Quantity */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Quantity *</label>
            <Input
              type="number"
              step="1"
              {...register("quantity", {
                required: "Quantity is required",
                min: { value: 0, message: "Quantity must be >= 0" },
                valueAsNumber: true,
              })}
              placeholder="10"
            />
            {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity.message}</span>}
          </div>

          {/* Status */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Status *</label>
            <Controller
              control={control}
              name="status"
              defaultValue="active"
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <span className="text-red-500 text-sm">{errors.status.message}</span>}
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Description *</label>
            <Textarea {...register("description", { required: "Description is required" })} placeholder="Description" />
            {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
