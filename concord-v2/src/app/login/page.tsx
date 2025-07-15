"use client";

import { AuthPage } from "@refinedev/mui";

export default function Login() {
  return (
    <AuthPage
      type="login"
      title="Sign in to your account"
      formProps={{
        defaultValues: {
          email: "",
          password: "",
        },
      }}
    />
  );
}
