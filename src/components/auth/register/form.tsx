"use client";

import React, { useState } from "react";
import Link from "next/link";
import { registerSchema } from "@/validations/auth.validation";
import { authRegisterAction } from "@/actions/auth.action";
import { historyAction } from "@/actions/history.action";

import { toast } from "sonner";
import { FaSpinner } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

type Errors = {
  [key: string]: string | undefined;
} | null;

const Form = () => {
  const [errors, setErrors] = useState<Errors>(null);
  const [isMutation, setIsMutation] = useState<boolean>(false);

  const clientAction = async (formData: FormData) => {
    if (isMutation) return; // Prevent multiple submissions
    setIsMutation(true);

    try {
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        path: window.location.pathname,
        domain: window.location.hostname.replace("www.", ""),
      };

      const validations = registerSchema.safeParse(data);
      if (!validations.success) {
        const newErrors: Errors = {};
        validations.error.issues.forEach((issue) => {
          newErrors[issue.path[0]] = issue.message;
        });

        setErrors(newErrors);
        return;
      }

      setErrors(null); // Clear previous errors if any

      const res = await authRegisterAction(data);
      if (res.message === "Email already exists") {
        setErrors({ email: "Email already exists" });
      } else if (res.message === "User created successfully") {
        const userId = res.id?.toString();
        const historydata = {
          message: "has registered",
          userId: userId,
          link: window.location.href,
          path: window.location.pathname,
        };

        await historyAction(historydata);
        window.location.href = "/auth/login";
      }
    } catch (error) {
      console.error("[ERROR_CLIENT_ACTION]", error);
      toast("Something went wrong");
    } finally {
      setIsMutation(false); // Reset loading state after completion
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        clientAction(formData);
      }}
      className="flex flex-col gap-y-5"
    >
      {/* Name */}
      <div className="flex flex-col gap-y-1">
        <label htmlFor="name" className="label">
          Name
        </label>
        <input
          type="text"
          placeholder="Name"
          id="name"
          name="name"
          autoFocus
          className={`input ${errors?.name ? "input-error" : ""}`}
        />
        {errors?.name && (
          <p className="text-red-500 font-sans">{errors?.name}</p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-y-1">
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          name="email"
          className={`input ${errors?.email ? "input-error" : ""}`}
        />
        {errors?.email && (
          <p className="text-red-500 font-sans">{errors?.email}</p>
        )}
      </div>

      {/* Password */}
      <div className="flex flex-col gap-y-1">
        <label htmlFor="password" className="label">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          name="password"
          className={`input ${errors?.password ? "input-error" : ""}`}
        />
        {errors?.password && (
          <p className="text-red-500 font-sans">{errors?.password}</p>
        )}
      </div>

      {/* Redirect To Login Page */}
      <p className="text-primary font-sans">
        Have you registered?{" "}
        <Link
          href="/auth/login"
          className="text-indigo-600 underline hover:text-indigo-600/90"
        >
          Login now!
        </Link>
      </p>

      {/* Button Submit */}
      <button
        type="submit"
        className={`btn btn-primary ${isMutation ? "opacity-50" : ""}`}
        disabled={isMutation}
      >
        {isMutation ? (
          <>
            <CgSpinner className="animate-spin w-8 h-8" />
            Loading
          </>
        ) : (
          "Register"
        )}
      </button>
    </form>
  );
};

export default Form;
