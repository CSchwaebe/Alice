"use client";

import Link from "next/link";
import HamburgerMenu from "./HamburgerMenu";
import { ConnectButton } from "@/components/walletconnect/ConnectButton";

export default function Header() {
  return (
    <header className=" py-4 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <HamburgerMenu />
          
        </div>
        <div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
