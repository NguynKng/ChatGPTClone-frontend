import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill in all fields.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await login(loginForm.email, loginForm.password);
      if (response) {
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-2 p-2">
      <h1 className="p-4 font-bold text-[22px]">ChatGPT</h1>
      <div className="flex-1 justify-center self-center mt-6">
        <div className="flex flex-col items-center gap-6 w-full lg:w-86">
          <h1 className="text-3xl mb-2 font-medium text-center">Welcome back</h1>
          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <div className="relative w-full">
              <input
                type="email"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, email: e.target.value })
                }
                className="border border-gray-300 rounded-full py-4 px-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                placeholder=""
              />
              <label
                className={`
                    absolute left-4 -translate-y-1/2
                    bg-white px-1 transition-all duration-300
                    text-gray-400
                    peer-focus:-top-1.5 peer-focus:text-sm peer-focus:text-blue-500
                    ${
                      loginForm.email
                        ? "-top-1.5 text-sm text-blue-500"
                        : "top-1/2"
                    }
                  `}
              >
                Email address
              </label>
            </div>

            <div className="relative w-full">
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
                className="border border-gray-300 rounded-full py-4 px-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                placeholder=""
              />
              <label
                className={`
                    absolute left-4 -translate-y-1/2
                    bg-white px-1 transition-all duration-300
                    text-gray-400
                    peer-focus:-top-1.5 peer-focus:text-sm peer-focus:text-blue-500
                    ${
                      loginForm.password
                        ? "-top-1.5 text-sm text-blue-500"
                        : "top-1/2"
                    }
                  `}
              >
                Password
              </label>
            </div>

            <button
              type="submit"
              className="text-center p-4 bg-black text-white w-full rounded-full cursor-pointer hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p>
            {"Don't have an account?"}{" "}
            <Link
              to={"/create-account"}
              className="text-blue-500 cursor-pointer hover:underline hover:underline-offset-0"
            >
              {"Sign up"}
            </Link>
          </p>

          <p className="font-medium">OR</p>
          <div className="space-y-3 w-full">
            <button className="rounded-full border border-gray-300 py-3 px-6 w-full flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
              <img src="/google.png" alt="Google Icon" className="w-5 h-5" />
              <span className="text-black ml-2">Continue with Google</span>
            </button>
            <button className="rounded-full border border-gray-300 py-3 px-6 w-full flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
              <img
                src="/microsoft.png"
                alt="Microsoft Icon"
                className="w-5 h-5"
              />
              <span className="text-black ml-2">
                Continue with Microsoft Account
              </span>
            </button>
            <button className="rounded-full border border-gray-300 py-3 px-6 w-full flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
              <img src="/apple-logo.png" alt="Apple Icon" className="w-5 h-5" />
              <span className="text-black ml-2">Continue with Apple</span>
            </button>
            <button className="rounded-full border border-gray-300 py-3 px-6 w-full flex items-center gap-2 hover:bg-gray-100 cursor-pointer">
              <img src="/telephone.png" alt="Phone Icon" className="w-5 h-5" />
              <span className="text-black ml-2">Continue with phone</span>
            </button>
          </div>

          <div className="mt-4">
            <span className="text-gray-600 text-sm underline">
              Terms of Use
            </span>
            <span className="text-gray-600 text-sm mx-4">|</span>
            <span className="text-gray-600 text-sm underline">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
