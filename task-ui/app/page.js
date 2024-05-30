import Link from "next/link";
import Hello from "../components/hello";

export default function Home() {
  return (
    <div>
      <Hello/>
      <Link href={'/board'}>Board</Link>
    </div>
  )
}
