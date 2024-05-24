import Link from "next/link";
import Image from "next/image";
import { FaBars, FaSearch } from "react-icons/fa";
import type { Settings } from "@tryghost/content-api";

function Header({ settings }: { settings: Settings }) {
  return (
    <header className="px-2 sm:px-4 py-2.5 w-full" style={{ backgroundColor: "white" }}>
      <div className="container flex flex-wrap items-center justify-between mx-auto">

        {/* Logo for blog */}
        <Link href="/" className="flex items-center">
          {settings.logo ? (
            <Image
              alt={settings.title}
              width={100}
              height={50}
              src={settings.logo}
              className="self-center"
            />
          ) : (
            <span className="text-xl font-semibold whitespace-nowrap text-white">{settings.title}</span>
          )}
        </Link>

        <button className="flex items-center text-white">
            <FaSearch className="mr-2" /> BUSCAR
          </button>
      </div>
    </header>
  );
}

export default Header;
