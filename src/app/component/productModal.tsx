"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose, } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
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

interface ProductModalProps {
  product?: Product;
  onSave: (product: Product) => void;
}

interface FormInputs {
  name: string;
  productImg: string;
  price: number;
  quantity: number;
  status: ProductStatus;
  description: string;
}

export function ProductModal({ product, onSave }: ProductModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormInputs>();

  // When modal opens, set form values depending on mode
  useEffect(() => {
    if (open) {
      if (product) {
        // Editing Fill form
        reset({
          name: product.name,
          productImg: product.productImg,
          price: product.price,
          quantity: product.quantity,
          status: product.status,
          description: product.description,
        });
      } else {
        // Adding Empty form
        reset({ name: "", productImg: "", price: 0, quantity: 0, status: "active", description: "" });
      }
    }
  }, [open, product, reset]);

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setLoading(true);
    try {
      const token = Cookies.get("token");
      const isEdit = !!product;

      const url = isEdit
        ? `${API_BASE_URL}/api/products/${product!.id}`
        : `${API_BASE_URL}/api/products`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      console.log(result)
      if (!res.ok)
        throw new Error(
          result.message ||
          (isEdit ? "Failed to update product" : "Failed to add product")
        );

      // Update parent UI instantly
      onSave(result.data);

      setOpen(false);

      Swal.fire({
        icon: "success",
        title: isEdit ? "Updated!" : "Added!",
        text: `Product ${isEdit ? "updated" : "added"} successfully!`,
      });
    } catch (error: unknown) {
      let message = "Something went wrong";
      if (error instanceof Error) message = error.message;

      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className={
            product
              ? "bg-yellow-500 hover:opacity-90"
              : "bg-indigo-500 hover:opacity-90"
          }
          size="sm"
        >
          {product ? "Edit" : "Add Product"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            {product
              ? "Update product details below."
              : "Fill the form to add a product."}
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
          {/* NAME */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Name *</label>
            <Input {...register("name", { required: "Product name is required" })} />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>

          {/* IMAGE */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Image URL *</label>
            <Input
              {...register("productImg", { required: "Image URL is required" })}
            />
            {errors.productImg && (
              <span className="text-red-500 text-sm">
                {errors.productImg.message}
              </span>
            )}
          </div>

          {/* PRICE */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Price *</label>
            <Input
              type="number"
              step="any"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
              })}
            />

            {errors.price && (
              <span className="text-red-500 text-sm">{errors.price.message}</span>
            )}
          </div>

          {/* QUANTITY */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Quantity *</label>
            <Input
              type="number"
              {...register("quantity", {
                required: "Quantity is required",
                valueAsNumber: true,
              })}
            />
            {errors.quantity && (
              <span className="text-red-500 text-sm">
                {errors.quantity.message}
              </span>
            )}
          </div>

          {/* STATUS */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Status *</label>
            <Controller
              control={control}
              name="status"
              rules={{ required: "Status is required" }}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                >
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
            {errors.status && (
              <span className="text-red-500 text-sm">{errors.status.message}</span>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="grid gap-1">
            <label className="text-sm font-medium">Description *</label>
            <Textarea
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-end space-x-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>

            <Button type="submit" disabled={loading}>
              {loading
                ? product ? "Updating..." : "Adding..."
                : product ? "Update" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
