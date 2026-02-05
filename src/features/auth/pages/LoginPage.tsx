import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { useLogin } from "../hooks/useLogin";
import { useResendVerifyEmail } from "../hooks/useResendVerifyEmail";

const schema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

type FormValues = z.infer<typeof schema>;

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | string>;
};

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const resendMutation = useResendVerifyEmail();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => navigate("/", { replace: true }),
    });
  };

  const apiError = loginMutation.error as AxiosError<ApiErrorResponse> | null;
  const apiMessage =
    apiError?.response?.data?.message ??
    apiError?.message ??
    "Đăng nhập thất bại";

  const currentEmail = form.watch("email");
  const needVerify = apiMessage.toLowerCase().includes("verify your email");

  const onResend = () => {
    if (!currentEmail) return;
    resendMutation.mutate(currentEmail.trim());
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">Đăng nhập</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="Mật khẩu"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
        >
          {loginMutation.isPending ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        {loginMutation.isError && (
          <div className="text-sm text-red-500 text-center space-y-2">
            <p>Đăng nhập thất bại: {apiMessage}</p>

            {needVerify && (
              <button
                type="button"
                className="underline"
                onClick={onResend}
                disabled={!currentEmail || resendMutation.isPending}
              >
                {resendMutation.isPending
                  ? "Đang gửi lại..."
                  : "Gửi lại email xác thực"}
              </button>
            )}

            {resendMutation.isSuccess && (
              <p className="text-green-600">
                Đã gửi lại email xác thực. Kiểm tra inbox/spam.
              </p>
            )}

            {resendMutation.isError && (
              <p className="text-red-500">Gửi lại thất bại. Thử lại sau.</p>
            )}
          </div>
        )}
      </form>

      <p className="text-center text-sm">
        Chưa có tài khoản?{" "}
        <Link to="/register" className="underline">
          Đăng ký
        </Link>
      </p>
    </div>
  );
}
