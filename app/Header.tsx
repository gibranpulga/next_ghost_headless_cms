import Link from "next/link";
import Image from "next/image";
import { FaBars, FaSearch } from "react-icons/fa";
import Head from "next/head";
import type { Settings } from "@tryghost/content-api";

function Header({ settings }: { settings: Settings }) {
  return (
    <>
      <Head>
        {/* Google Analytics and Facebook Pixel scripts are already included in _document.tsx */}
      </Head>
      <header className="px-2 sm:px-4 py-2.5 w-full" style={{ backgroundColor: "white" }}>
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          {/* Center: Logo */}
          <div className="flex flex-grow justify-center">
            <Link href="/" className="flex items-center">
              {settings && settings.logo ? (
                <Image
                  alt={settings.title}
                  width={100}
                  height={50}
                  src={settings.logo}
                  className="self-center"
                />
              ) : (settings && settings.title ?
                <span className="text-xl font-semibold whitespace-nowrap text-black">{settings.title}</span>
                : null
              )}
            </Link>
          </div>

          {/* Right side: Links */}
          <div className="flex space-x-8">
            <Link href="/tags/fgts" className="text-gray-500 hover:text-gray-700">
              FGTS
            </Link>
            <Link href="/tags/bolsa-familia" className="text-gray-500 hover:text-gray-700">
              Bolsa Família
            </Link>
            <Link href="/tags/irpf" className="text-gray-500 hover:text-gray-700">
              IRPF
            </Link>
            <Link href="/tags/bolsa-auxilio-estudantil" className="text-gray-500 hover:text-gray-700">
              Bolsa Auxílio Estudantil
            </Link>
          </div>

          {/* Optional: Search button */}
          {/* Uncomment if you want to include a search button on the right */}
          {/* <button className="flex items-center text-gray-500 hover:text-gray-700">
            <FaSearch className="mr-2" /> BUSCAR
          </button> */}
        </div>
      </header>
    </>
  );
}

export default Header;
