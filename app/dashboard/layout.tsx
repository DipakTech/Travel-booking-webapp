import Layout from "@/components/dashboard/layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="dark">
      <Layout>{children}</Layout>
    </div>
  );
}
