import Link from "next/link";
import { getSinglePost, getPosts, getNavigation } from "../../app/ghost-client";
import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa";
import { notFound } from 'next/navigation';
import { GetStaticProps, GetStaticPaths } from "next";
import type { PostOrPage, PostsOrPages, SettingsResponse } from "@tryghost/content-api";
import { format } from "date-fns";
import RootLayout from "../../app/layout"; // Adjust the import path
import "../../app/cards.min.css";

interface ReadProps {
  post: PostOrPage;
  settings: SettingsResponse;
}

// generateStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  const posts: PostsOrPages = await getPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: "blocking" };
};

// generateStaticProps
export const getStaticProps: GetStaticProps = async ({ params }) => {
  let settings;
  let post;
  
  try {
    settings = await getNavigation();
    post = await getSinglePost(params?.slug as string);

  } catch (error) {
    throw new Error('Getting posts failed.');
  }

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
      settings
    },
    revalidate: 60, // Optional: Revalidate every 60 seconds
  };
};

// Component
const Read = ({ post, settings }: ReadProps) => {
  console.log('settings getStaticProps', settings);
  console.log('post getStaticProps', post);


  if (!post) {
    return notFound();
  }
  
  return (
    <RootLayout settings={settings}>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 dark:bg-gray-900">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
          <article className="mx-auto w-full max-w-3xl prose prose-xl prose-p:text-gray-800 dark:prose-p:text-gray-100 sm:prose-base prose-a:no-underline prose-blue dark:prose-invert">
            <div className="flex mb-4 w-full justify-between">
              <Link className="inline-flex items-center" href={`/`}>
                <FaAngleLeft /> Back
              </Link>

              {post.primary_tag ? (
                <Link href={`/tags/${post.primary_tag.slug}`}>
                  # {post.primary_tag.name}
                </Link>
              ) : (
                ""
              )}
            </div>

            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
              {post.title}
            </h1>

            <header className="mb-4 lg:mb-6 not-format">
              <address className="flex items-center mb-6 not-italic">
                <div className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
                  <Image
                    width={32}
                    height={32}
                    className="mr-4 w-10 h-10 rounded-full"
                    src={post.primary_author.profile_image}
                    alt={post.primary_author.name}
                  />
                  {post.primary_author ? (
                    <Link
                      href={`/authors/${post.primary_author.slug}`}
                      rel="author"
                      className="text-xl font-bold text-gray-800 dark:text-white"
                    >
                      {post.primary_author.name}
                    </Link>
                  ) : (
                    " "
                  )}

                  {post.published_at ? (
                    <time
                      className="text-base font-light text-gray-800 dark:text-white mx-1"
                      dateTime={post.published_at}
                      title={format(new Date(post.published_at), "dd-MM-yyyy")}
                    >
                      {format(new Date(post.published_at), "dd-MM-yyyy")}
                    </time>
                  ) : (
                    ""
                  )}

                  <div className="text-base w-1 h-1 rounded-full bg-black dark:bg-white mx-1"></div>

                  <p className="text-base font-light text-gray-500 dark:text-gray-400">
                    {post.reading_time} Min de Leitura
                  </p>
                </div>
              </address>
            </header>

            <figure>
              <Image
                className="mx-auto"
                width={1000}
                height={250}
                src={post.feature_image}
                alt={post.feature_image_alt}
              />
              <figcaption
                className="text-center"
                dangerouslySetInnerHTML={{ __html: post.feature_image_caption }}
              ></figcaption>
            </figure>

            <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
          </article>
        </div>
      </main>
    </RootLayout>
  );
};

export default Read;
