import { FaTwitter, FaFacebook } from "react-icons/fa";
import Link from "next/link";
import type { SettingsResponse, PagesOrPosts } from "@tryghost/content-api";
import Image from "next/image";

interface FooterProps {
  settings: SettingsResponse;
  pages: PagesOrPosts;
}

function Footer({ settings, pages }: FooterProps) {
  
  return (
    <footer className="px-2 sm:px-4 py-2.5 w-full" style={{ backgroundColor: "#009c3b" }}>
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <div className="flex items-center">
          <span className="self-center text-white text-sm font-semibold whitespace-nowrap ml-2">
            © 2023 Brasil No Ar
          </span>
        </div>

        <div className="flex md:order-2">
          <ul className="flex p-4 flex-row md:space-x-8 md:mt-0 md:text-sm font-medium text-white">
            {pages && pages.map((page: any) => (
              <li key={page.slug}>
                <Link href={`/${page.slug}`}>{page.title}</Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
