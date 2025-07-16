import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

export default function SignupPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuthStore();
  const [signupForm, setSignupForm] = useState({
    firstName: "",
    surname: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    birthDate: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      toast("Passwords do not match.");
      return;
    }
    setIsLoading(true);

    try {
      const isRegistered = await register(signupForm);
      if (isRegistered) {
        navigate(`/verify-code?email=${signupForm.email}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <h1 className="p-4 font-bold text-[22px]">ChatGPT</h1>
      <div className="flex-1 justify-center self-center mt-6">
        <div className="flex flex-col items-center gap-6 w-full lg:w-[30rem]">
          <h1 className="text-3xl mb-2 font-medium text-center">Create your account</h1>
          <form
            className="flex flex-col items-center gap-6"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-between gap-2 w-full">
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={signupForm.firstName}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, firstName: e.target.value })
                  }
                  className="border border-gray-300 rounded-full py-3 px-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                  placeholder=""
                  required
                />
                <label
                  className={`
                  absolute left-4 -translate-y-1/2
                  bg-white px-1 transition-all duration-300
                  text-gray-400
                  peer-focus:-top-1.5 peer-focus:text-sm peer-focus:text-blue-500
                  ${
                    signupForm.firstName
                      ? "-top-1.5 text-sm text-blue-500"
                      : "top-1/2"
                  }
                `}
                >
                  First Name
                </label>
              </div>
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={signupForm.surname}
                  onChange={(e) =>
                    setSignupForm({ ...signupForm, surname: e.target.value })
                  }
                  className="border border-gray-300 rounded-full py-3 px-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                  placeholder=""
                  required
                />
                <label
                  className={`
                  absolute left-4 -translate-y-1/2
                  bg-white px-1 transition-all duration-300
                  text-gray-400
                  peer-focus:-top-1.5 peer-focus:text-sm peer-focus:text-blue-500
                  ${
                    signupForm.surname
                      ? "-top-1.5 text-sm text-blue-500"
                      : "top-1/2"
                  }
                `}
                >
                  Surname
                </label>
              </div>
            </div>

            {/* Birth Date */}
            <div className="relative w-full">
              <input
                type="date"
                value={signupForm.birthDate}
                onChange={(e) => {
                  setSignupForm({ ...signupForm, birthDate: e.target.value });
                }}
                className="border border-gray-300 rounded-full py-3 px-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <label
                className={`
                absolute left-4 -translate-y-1/2
                bg-white px-1 transition-all duration-300
                text-gray-400
                ${
                  signupForm.birthDate
                    ? "-top-1.5 text-sm text-blue-500"
                    : "top-1/2"
                }
              `}
              >
                {signupForm.birthDate ? "Birth Date" : ""}
              </label>
            </div>

            {/* Phone Number */}
            <div className="relative w-full">
              <input
                type="text"
                value={signupForm.phoneNumber}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, phoneNumber: e.target.value })
                }
                className="border border-gray-300 rounded-full py-3 px-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                placeholder=""
                required
              />
              <label
                className={`
                absolute left-4 -translate-y-1/2
                bg-white px-1 transition-all duration-300
                text-gray-400
                peer-focus:-top-1.5 peer-focus:text-sm peer-focus:text-blue-500
                ${
                  signupForm.phoneNumber
                    ? "-top-1.5 text-sm text-blue-500"
                    : "top-1/2"
                }
              `}
              >
                Phone Number
              </label>
            </div>

            {/* Email */}
            <div className="relative w-full">
              <input
                type="email"
                value={signupForm.email}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, email: e.target.value })
                }
                className="border border-gray-300 rounded-full py-3 px-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                placeholder=""
                required
              />
              <label
                className={`
                absolute left-4 -translate-y-1/2
                bg-white px-1 transition-all duration-300
                text-gray-400
                peer-focus:-top-1.5 peer-focus:text-sm peer-focus:text-blue-500
                ${
                  signupForm.email
                    ? "-top-1.5 text-sm text-blue-500"
                    : "top-1/2"
                }
              `}
              >
                Email Address
              </label>
            </div>
            {/* Password */}
            <div className="relative w-full">
              <input
                type="password"
                value={signupForm.password}
                onChange={(e) =>
                  setSignupForm({ ...signupForm, password: e.target.value })
                }
                className="border border-gray-300 rounded-full py-3 px-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                placeholder=""
                required
              />
              <label
                className={`
                absolute left-4 -translate-y-1/2
                bg-white px-1 transition-all duration-300
                text-gray-400
                peer-focus:-top-1.5 peer-focus:text-sm peer-focus:text-blue-500
                ${
                  signupForm.password
                    ? "-top-1.5 text-sm text-blue-500"
                    : "top-1/2"
                }
              `}
              >
                Password
              </label>
            </div>

            {/* Confirm Password */}
            <div className="relative w-full">
              <input
                type="password"
                value={signupForm.confirmPassword}
                onChange={(e) =>
                  setSignupForm({
                    ...signupForm,
                    confirmPassword: e.target.value,
                  })
                }
                className="border border-gray-300 rounded-full py-3 px-5 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 peer"
                placeholder=""
                required
              />
              <label
                className={`
                absolute left-4 -translate-y-1/2
                bg-white px-1 transition-all duration-300
                text-gray-400
                peer-focus:-top-1.5 peer-focus:text-sm peer-focus:text-blue-500
                ${
                  signupForm.confirmPassword
                    ? "-top-1.5 text-sm text-blue-500"
                    : "top-1/2"
                }
              `}
              >
                Confirm Password
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`text-center p-4 w-full rounded-full cursor-pointer transition
    ${
      isLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-black hover:bg-gray-800 text-white"
    }
  `}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
          {/* First Name and Surname side by side */}

          <p>
            {"Already have an account?"}{" "}
            <Link
              to={"/log-in"}
              className="text-blue-500 cursor-pointer hover:underline hover:underline-offset-0"
            >
              {"Log in"}
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
