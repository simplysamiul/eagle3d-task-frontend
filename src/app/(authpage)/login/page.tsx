"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data:object) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#2d006b] relative overflow-hidden p-4">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-700 via-fuchsia-600 to-indigo-700 opacity-50 blur-3xl"></div>

      <Card className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-[#0f0025]/70 backdrop-blur-xl border-none shadow-2xl rounded-2xl overflow-hidden">
        {/* Left side form */}
        <CardContent className="flex flex-col justify-center p-10 space-y-6">
          <div className="flex flex-col items-center text-white">
            <div className="w-20 h-20 rounded-full border-2 border-purple-400 flex items-center justify-center text-purple-300 text-5xl">
              👤
            </div>
            <h2 className="mt-4 text-2xl font-bold">Login</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="userName" className="text-white">UserName</Label>
              <Input
                id="userName"
                type="text"
                placeholder="Enter your username"
                className="bg-white/20 text-white placeholder:text-gray-300 border-white/30"
                {...register("userName", { required: "userName is required" })}
              />
              {errors.userName && (
                <p className="text-red-400 text-sm mt-1">{`${errors.userName.message}`}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="bg-white/20 text-white placeholder:text-gray-300 border-white/30"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{`${errors.password.message}`}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white py-6 text-lg rounded-xl">
              Login
            </Button>
          </form>
        </CardContent>

        {/* Right side gradient welcome section */}
        <div className="hidden md:flex flex-col justify-center items-center text-white p-10 bg-linear-to-br from-purple-900/40 to-indigo-900/40 backdrop-blur-xl">
          <h1 className="text-4xl font-bold mb-4">Welcome.</h1>
          <p className="text-gray-200 max-w-sm text-center">
            Use the default credentials below to login and access your dashboard.
          </p>

          <div className="mt-8 bg-white/10 p-6 rounded-xl w-full max-w-xs text-sm space-y-2">
            <p><span className="font-bold">Default UserName:</span> eagle3dstreaming.com</p>
            <p><span className="font-bold">Default Password:</span> eagle3dstreaming</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
