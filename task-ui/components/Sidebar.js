"use client";
import { customFetch } from "@/utils/helper";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function Sidebar({ ...props }) {
  const router = useRouter();

  return (
    <div className="min-h-screen h-full bg-gray-800 text-white w-[200px] space-y-6 py-7 px-2">
      <div className="text-2xl font-semibold text-center">MyApp</div>
      <nav className="mt-10">
        <Link legacyBehavior href="/board/users">
          <a
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              router.pathname === "/board/users" ? "bg-gray-700" : ""
            }`}
          >
            User
          </a>
        </Link>
        <Link legacyBehavior href="/board">
          <a
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              router.pathname === "/board" ? "bg-gray-700" : ""
            }`}
          >
            Board
          </a>
        </Link>

        <Link legacyBehavior href="/tasks">
          <a
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 ${
              router.pathname === "/board" ? "bg-gray-700" : ""
            }`}
          >
            My tasks
          </a>
        </Link>

        <a
          onClick={async () => {
            await customFetch("/auth/logout");
            router.push("/auth");
          }}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700`}
          >
            Logout
          </a>
      </nav>
    </div>
  );
}
