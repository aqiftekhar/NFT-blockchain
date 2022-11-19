import Head from "next/head";
import Image from "next/image";
import { BaseLayout } from "../components/layout/baseLayout";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <BaseLayout>
      <div>Hello Word!</div>
    </BaseLayout>
  );
}
