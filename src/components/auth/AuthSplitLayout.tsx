import React from "react";
import EagleMark from "./EagleMark";

type Props = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export default function AuthSplitLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body">
      <section className="relative md:w-1/2 min-h-[40vh] md:min-h-screen overflow-hidden bg-neutral-900">
        <img
          src={`http://localhost:8000/assets/2.png`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover grayscale contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10 flex min-h-[40vh] md:min-h-screen items-center justify-center p-8 md:p-12">
          <div className="max-w-md rounded-2xl border border-white/15 bg-white/10 px-8 py-10 shadow-2xl backdrop-blur-md">
            <p className="text-lg md:text-xl font-semibold leading-snug text-white tracking-tight">
              Premium clothing designed for comfort, confidence, and
              individuality.
            </p>
            <p className="mt-8 text-sm text-white/80">
              crafted for modern lifestyles since 2025
            </p>
          </div>
        </div>
      </section>

      <section className="flex flex-1 flex-col justify-center bg-white px-8 py-12 md:w-1/2 md:px-16 lg:px-24">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2 text-gray-900">
            <EagleMark className="h-9 w-9 shrink-0" />
            <span className="text-xl font-semibold tracking-[0.2em] uppercase">
              MIS EAGLES
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-500">{subtitle}</p>

          {children}
        </div>
      </section>
    </div>
  );
}
