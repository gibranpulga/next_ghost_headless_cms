import Link from "next/link";
import { getSinglePage, getAllPages, getNavigation } from "../app/ghost/ghost-client";
import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa";
import { notFound } from 'next/navigation';
import { GetStaticProps, GetStaticPaths } from "next";
import type { PostOrPage, PostsOrPages, SettingsResponse } from "@tryghost/content-api";
import { format } from "date-fns";
import RootLayout from "../app/components/Layout"; // Adjust the import path
import "../app/components/css/cards.min.css";

interface PageProps {
  page: PostOrPage;
  settings: SettingsResponse;
  pages: PostsOrPages;
}

// generateStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  const pages: PostsOrPages = await getAllPages();
  const paths = pages.map((page) => ({
    params: { slug: page.slug },
  }));

  return { paths, fallback: "blocking" };
};

// generateStaticProps
export const getStaticProps: GetStaticProps = async ({ params }) => {
  let settings;
  let page;
  let pages;

  try {
    settings = await getNavigation();
    page = await getSinglePage(params?.slug as string);
    pages = await getAllPages();

  } catch (error) {
    throw new Error('Getting pages failed.');
  }

  if (!page) {
    return { notFound: true };
  }

  return {
    props: {
      page,
      settings,
      pages
    },
    revalidate: 60, // Optional: Revalidate every 60 seconds
  };
};

// Component
const Page = ({ page, settings, pages }: PageProps) => {


  if (!page) {
    return notFound();
  }
  
  return (
    <RootLayout settings={settings} pages={pages}>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 dark:bg-gray-900">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
          <article className="mx-auto w-full max-w-3xl prose prose-xl prose-p:text-gray-800 dark:prose-p:text-gray-100 sm:prose-base prose-a:no-underline prose-blue dark:prose-invert">
            <div className="flex mb-4 w-full justify-between">
              <Link className="inline-flex items-center" href={`/`}>
                <FaAngleLeft /> Voltar
              </Link>
            </div>

            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
              {page.title}
            </h1>

            {page.feature_image && (
              <figure>
                <Image
                  className="mx-auto"
                  width={1000}
                  height={250}
                  src={page.feature_image}
                  alt={page.feature_image_alt}
                />
                <figcaption
                  className="text-center"
                  dangerouslySetInnerHTML={{ __html: page.feature_image_caption }}
                ></figcaption>
              </figure>
            )}

            <div dangerouslySetInnerHTML={{ __html: page.html }}></div>
          </article>
        </div>
      </main>
    </RootLayout>
  );
};

export default Page;