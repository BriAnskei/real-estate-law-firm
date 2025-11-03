import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api", // your Express backend URL
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signupWithProvider: builder.mutation({
      query: (providerData) => ({
        url: "/auth/signup/provider",
        method: "POST",
        body: providerData,
      }),
    }),
    signinWithProvider: builder.mutation({
      query: (providerData) => ({
        url: "/auth/signin/provider",
        method: "POST",
        body: providerData,
      }),
    }),
  }),
});

export const { useSignupWithProviderMutation, useSigninWithProviderMutation } =
  authApi;
