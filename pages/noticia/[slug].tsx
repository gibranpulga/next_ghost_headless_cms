import Link from "next/link";
import { getPosts, getNavigation, getAllPages, getSinglePost } from "../../app/ghost-client";
import Image from "next/image";
import { FaAngleLeft } from "react-icons/fa";
import { notFound } from 'next/navigation';
import { GetStaticProps, GetStaticPaths } from "next";
import type { PostOrPage, PostsOrPages, SettingsResponse } from "@tryghost/content-api";
import { format } from "date-fns";
import RootLayout from "../../app/layout"; // Adjust the import path
import "../../app/cards.min.css";
import Head from 'next/head';

interface NewsProps {
  post: PostOrPage;
  settings: SettingsResponse;
  pages: PostsOrPages;
}

// generateStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  console.log("getStaticPaths slug")
  const postsData: PostsOrPages = await getPosts();
  const posts = postsData.posts;
  
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  console.log("slug paths", paths)

  return { paths, fallback: "blocking" };
};

// generateStaticProps
export const getStaticProps: GetStaticProps = async ({ params }) => {
  let settings;
  let post;
  let pages;
  
  try {
    settings = await getNavigation();
    post = await getSinglePost(params?.slug as string);
    pages = await getAllPages();

  } catch (error) {
    throw new Error('Getting posts failed: ' + error);
  }

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
      settings,
      pages
    },
    revalidate: 60, // Optional: Revalidate every 60 seconds
  };
};

// Component
const News = ({ post, settings, pages }: NewsProps) => {

  if (!post) {
    return notFound();
  }

  const postUrl = `https://www.brasilnoar.com.br/noticia/${post.slug}`;
  const postTitle = post.title;
  const postDescription = post.excerpt || 'Bem-vindo ao Brasil No Ar, o seu portal de notícias confiável e dinâmico.';
  const postImage = post.feature_image || '/images/Brasilnoar.png';

  return (
    <RootLayout settings={settings} pages={pages}>
      <Head>
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={postTitle} />
        <meta property="og:description" content={postDescription} />
        <meta property="og:image" content={postImage} />
        <meta property="og:image:width" content="1200" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={postTitle} />
        <meta name="twitter:description" content={postDescription} />
        <meta name="twitter:image" content={postImage} />
        <title>{postTitle}</title>
      </Head>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 dark:bg-gray-900">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
          <article className="mx-auto w-full max-w-3xl prose prose-xl prose-p:text-gray-800 dark:prose-p:text-gray-100 sm:prose-base prose-a:no-underline prose-blue dark:prose-invert">
            <div className="flex mb-4 w-full justify-between">
              <Link className="inline-flex items-center" href={`/`}>
                <FaAngleLeft /> Voltar
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

            <section className="mb-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 italic">{post.excerpt}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                <a className="font-semibold text-gray-900 dark:text-white mr-2">
                  Por: {post.primary_author?.name} 
                </a>
                <time className="mr-2" dateTime={post.published_at}>
                  em {format(new Date(post.published_at), "dd/MM/yyyy 'as' HH:mm")}
                </time>
                <span>•</span>
                <span className="ml-2">{post.reading_time} minutos de leitura</span>
              </div>
            </section>

            <div dangerouslySetInnerHTML={{ __html: post.html }}></div>
          </article>
        </div>
      </main>
    </RootLayout>
  );
};

export default News;
