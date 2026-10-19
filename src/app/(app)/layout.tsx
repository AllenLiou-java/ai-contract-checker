export default function AppLayout({ children }: LayoutProps<"/">) {
  return <main className="mx-auto w-full max-w-5xl flex-1 px-5 py-12">{children}</main>;
}
