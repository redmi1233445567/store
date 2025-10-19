"use client"
import { useState } from "react";
import { login } from "../data/login";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter()

  const [errors, setErrors] = useState({ email: "", password: "" });
  const [emailVal, setEmailVal] = useState();
  const [passwordVal, setPasswordVal] = useState();

  const handleLogin = async (e) => {
    e.preventDefault();

    const user = { email: emailVal, password: passwordVal };

    try {
      const res = await login(user);
      if (res[0]?.errors) {
        setErrors(res[0].errors);
      } else {
        console.log("تم تسجيل الدخول بنجاح:");
        Cookies.set("authUser", res.token);
        router.push("/")
        setErrors({ email: "", password: "" })
      }
    } catch (err) {
      console.error("خطأ أثناء تسجيل الدخول:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-sky-400/50 via-cyan-500/50 to-blue-600/50">
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-[90%] max-w-md border border-white/20">
        <h2 className="text-3xl font-bold text-white text-center mb-6">تسجيل الدخول</h2>

        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">البريد الإلكتروني<span className="text-red-500 mr-3">{errors.email}</span></label>
            <input
              type="email"
              onChange={(e) => setEmailVal(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">كلمة المرور<span className="text-red-500 mr-3">{errors.password}</span></label>
            <input
              type="password"
              onChange={(e) => setPasswordVal(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:ring-2 focus:ring-sky-300"
            />
          </div>

          <button
            onClick={(e) => handleLogin(e)}
            className="w-full py-2 cursor-pointer rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:scale-105 transition-transform"
          >
            تسجيل الدخول
          </button>
        </form>

        <p className="text-center text-white/80 mt-5 text-sm">
          ليس لديك حساب؟{" "}
          <Link href={"../signup"}>
            <span className="text-blue-600 cursor-pointer hover:text-white transition-colors">
              إنشاء حساب جديد
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}
