import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyCode } from "../services/api/authApi";

export default function VerifyCodePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const [code, setCode] = useState("");
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      toast.error("Email is required.");
      return;
    }
    if (!code) {
      toast.error("Please enter the verification code.");
      return;
    }
    try {
      const response = await verifyCode(email, code, "verifyAccount");
      if (response.data.success) {
        toast.success("Verification successful! You can now log in.");
        navigate("/log-in");
      }
    } catch (error: any) {
        toast.error(error.response?.data.message || "Verification failed");
        console.error("Verification error:", error);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Verify Code</h2>
        <p className="text-gray-600 mb-4">
          {`Please enter the verification code sent to ${email}`} .
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Verification Code
            </label>
            <input
              type="text"
              name="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your code"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 cursor-pointer transition duration-200"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
