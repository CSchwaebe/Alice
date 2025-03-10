"use client";

import Link from "next/link";
import HamburgerMenu from "./HamburgerMenu";
import { modal } from '@/app/providers';
import { ConnectButton } from "@/components/ConnectButton";


export default function Header() {
  return (
    <header className="bg-dark-800 border-b border-dark-600 py-4 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <HamburgerMenu />
          <Link
            href="/"
            className="text-2xl text-neon-300 font-bold tracking-wider ml-2"
          >
            RAGNAROK
          </Link>
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
