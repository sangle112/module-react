import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";
import { authApi } from "@/shared/api";

type ApiErrorResponse = { message?: string };

export function VerifyEmailPage() {
  const { token: tokenParam } = useParams<{ token: string }>();
  const [params] = useSearchParams();
  const tokenQuery = params.get("token");

  const token = tokenParam ?? tokenQuery ?? "";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Thiếu token xác thực.");
      return;
    }

    setStatus("loading");
    authApi
      .verifyEmail(token)
      .then(() => {
        setStatus("success");
        setMessage("Xác thực email thành công. Bạn có thể đăng nhập.");
      })
      .catch((err: AxiosError<ApiErrorResponse>) => {
        setStatus("error");
        setMessage(
          err.response?.data?.message ?? err.message ?? "Xác thực thất bại.",
        );
      });
  }, [token]);

  return (
    <div className="p-6 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Xác thực email</h1>

      {status === "loading" && <p>Đang xác thực...</p>}
      {status !== "loading" && <p>{message}</p>}

      <Link className="underline" to="/login">
        Về trang đăng nhập
      </Link>
    </div>
  );
}
