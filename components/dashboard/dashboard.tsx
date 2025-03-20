import Content from "./content";
import React from "react";
import Layout from "./layout";

export default function Dashboard() {
  return (
    <div data-theme="dark">
      <Layout>
        <Content />
      </Layout>
    </div>
  );
}
