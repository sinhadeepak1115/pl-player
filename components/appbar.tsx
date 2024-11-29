"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { signIn, useSession, signOut } from "next-auth/react";

const Appbar = () => {
  const session = useSession();
  console.log(session);
  return (
    <header className="bg-gradient-to-r from-blue-500 to-sky-300 p-4 shadow-lg">
      <nav className="flex justify-between items-center max-w-6xl mx-auto">
        <Link
          href="/"
          className="text-white text-2xl font-bold tracking-wide hover:text-blue-200 transition"
        >
          PL-Player
        </Link>
        <ul className="flex space-x-6">
          <li>
            <Link
              href="/workout"
              className="text-white text-xl font-medium hover:text-blue-50"
            >
              Workout
            </Link>
          </li>
          <li>
            <Link
              href="/report"
              className="text-white text-xl font-medium hover:text-blue-50"
            >
              Reports
            </Link>
          </li>
        </ul>
        {session.data?.user && (
          <Button onClick={() => signOut()}>Logout</Button>
        )}
        {!session.data?.user && <Button onClick={() => signIn()}>Login</Button>}
      </nav>
    </header>
  );
};

export default Appbar;
