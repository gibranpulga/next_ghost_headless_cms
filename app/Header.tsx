import Link from "next/link";
import Image from "next/image";
import { FaBars, FaSearch } from "react-icons/fa";
import type { Settings } from "@tryghost/content-api";

function Header({ settings }: { settings: Settings }) {
  return (
    <header className="px-2 sm:px-4 py-2.5 w-full" style={{ backgroundColor: "#009c3b" }}>
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        {/* Menu and Search Button */}
        <div className="flex items-center space-x-4">
          <button className="flex items-center text-white">
            <FaBars className="mr-2" /> MENU
          </button>
          <button className="flex items-center text-white">
            <FaSearch className="mr-2" /> BUSCAR
          </button>
        </div>

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

        {/* Blog Navigation */}
        <nav className="flex md:order-2">
          <ul className="flex flex-wrap p-4 md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            {settings.navigation
              ? settings.navigation.map((item) => (
                  <li key={item.label} className="block py-2 pl-3 pr-4 text-white rounded hover:text-blue-700 md:p-0">
                    <Link href={item.url}>{item.label}</Link>
                  </li>
                ))
              : null}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
