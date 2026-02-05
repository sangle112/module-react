import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AxiosError } from "axios";
import { useRegister } from "../hooks/useRegister";

const schema = z
  .object({
    fullName: z.string().min(1, "Họ tên bắt buộc"),
    username: z.string().min(3, "Username tối thiểu 3 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: z.string().min(6, "Nhập lại mật khẩu"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Mật khẩu nhập lại không khớp",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

type ApiErrorResponse = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[] | string>;
};

export function RegisterPage() {
  const navigate = useNavigate();
  const registerMutation = useRegister();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    const payload: FormValues = {
      fullName: values.fullName.trim(),
      username: values.username.trim(),
      email: values.email.trim(),
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    registerMutation.mutate(payload, {
      onSuccess: () => {
        navigate("/login", { replace: true });
      },
    });
  };

  const apiError =
    registerMutation.error as AxiosError<ApiErrorResponse> | null;
  const apiMessage =
    apiError?.response?.data?.message ??
    apiError?.message ??
    "Đăng ký thất bại";
  const apiFieldErrors = apiError?.response?.data?.errors;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-center">Đăng ký</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Họ tên"
            {...form.register("fullName")}
          />
          {form.formState.errors.fullName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <input
            className="w-full border px-3 py-2 rounded"
            placeholder="Username"
            {...form.register("username")}
          />
          {form.formState.errors.username && (
            <p className="text-sm text-red-500">
              {form.formState.errors.username.message}
            </p>
          )}
        </div>

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

        <div>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="Nhập lại mật khẩu"
            {...form.register("confirmPassword")}
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-500">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-60"
        >
          {registerMutation.isPending ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        {registerMutation.isError && (
          <div className="text-sm text-red-500 space-y-2">
            <p>Đăng ký thất bại: {apiMessage}</p>

            {apiFieldErrors && (
              <ul className="list-disc pl-5">
                {Object.entries(apiFieldErrors).map(([key, val]) => (
                  <li key={key}>
                    {key}: {Array.isArray(val) ? val.join(", ") : val}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </form>

      <p className="text-center text-sm">
        Đã có tài khoản?{" "}
        <Link to="/login" className="underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
