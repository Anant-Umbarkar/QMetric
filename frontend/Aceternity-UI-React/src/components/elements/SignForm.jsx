"use client";
import React, { useState, useEffect } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../utils/cn.js";

export function SignupFormDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [captcha, setCaptcha] = useState(null);
  const [captchaId, setCaptchaId] = useState(null);

  // Pre-existing login credentials for reference
  const demoAccounts = [
    { email: "test@user1.com", password: "password123" },
    { email: "test@euser2.com", password: "password123" },
    { email: "test@euser3.com", password: "password123" },
    { email: "test@user4.com", password: "password123" },
    { email: "test@user5.com", password: "password123" },
  ];

  // Fetch CAPTCHA on component mount
  useEffect(() => {
    fetchCaptcha();
  }, []);

  const fetchCaptcha = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/captcha`);
      const data = await response.json();
      if (!data.error) {
        setCaptcha(data.captcha);
        setCaptchaId(data.captchaId);
        setCaptchaInput("");
        setError("");
      }
    } catch (err) {
      console.error("Error fetching CAPTCHA:", err);
      setError("Failed to load CAPTCHA");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (!email || !password || !captchaInput) {
      setError("All fields including CAPTCHA are required");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email, 
          password,
          captchaId,
          captchaInput 
        }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.message || "Login failed");
        // Reload CAPTCHA on wrong attempt
        if (data.message.includes("CAPTCHA")) {
          await fetchCaptcha();
        }
      } else {
        setSuccess("Login successful!");
        console.log("Access Token:", data.accessToken);
        // Store token in localStorage
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        setEmail("");
        setPassword("");
        setCaptchaInput("");
        setTimeout(() => setSuccess(""), 3000);
        // Redirect or update app state here
      }
    } catch (err) {
      setError("Error connecting to server");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-black bg-opacity-60">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to QMetric
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Sign in to your account to continue
      </p>

      {error && (
        <div className="mt-4 p-3 bg-red-500 text-white rounded-md text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 bg-green-500 text-white rounded-md text-sm">
          {success}
        </div>
      )}

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="your@email.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-8">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>

        {/* CAPTCHA Section */}
        <LabelInputContainer className="mb-6">
          <Label>Security Check (CAPTCHA)</Label>
          <div className="bg-neutral-700 dark:bg-neutral-900 p-4 rounded-md mb-3 border border-neutral-600">
            <div className="font-mono text-2xl font-bold text-center text-cyan-400 tracking-widest select-none">
              {captcha || "Loading..."}
            </div>
          </div>
          <div className="flex gap-2">
            <Input
              id="captcha"
              placeholder="Enter the text above"
              type="text"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
              className="flex-1"
            />
            <button
              type="button"
              onClick={fetchCaptcha}
              className="px-4 py-2 bg-neutral-700 hover:bg-neutral-600 rounded-md text-white text-sm font-medium transition-colors"
              title="Refresh CAPTCHA"
            >
              🔄
            </button>
          </div>
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In →"}
          <BottomGradient />
        </button>
      </form>

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

      <div className="mt-6">
        <p className="text-neutral-600 text-xs dark:text-neutral-400 mb-3 font-semibold">
          Demo Accounts (Click to auto-fill):
        </p>
        <div className="space-y-2">
          {demoAccounts.map((account, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDemoLogin(account.email, account.password)}
              className="w-full text-left px-3 py-2 rounded-md bg-neutral-800 dark:bg-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-800 text-neutral-300 text-xs transition-colors"
            >
              {account.email}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
