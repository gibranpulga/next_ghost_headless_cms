import Link from "next/link";
import { getPosts, getNavigation, getAllPages, getSinglePost } from "../../app/ghost-client";
import { GetStaticProps, GetStaticPaths } from "next";
import type { PostOrPage, PostsOrPages, SettingsResponse } from "@tryghost/content-api";
import { format } from "date-fns";
import RootLayout from "../../app/layout";
import "../../app/cards.min.css";
import Head from 'next/head';
import fs from 'fs';
import path from 'path';
import { FaAngleLeft } from "react-icons/fa";
import { processPosts, processSinglePost, replaceUrlInSinglePost, replaceUrlsInPosts } from "@/app/utils/downloadAndUpdateImages";
import { notFound } from "next/navigation";

interface NewsProps {
  post: PostOrPage;
  settings: SettingsResponse;
  pages: PostsOrPages;
}

// File paths for caching
const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');
const pagesFilePath = path.join(process.cwd(), 'data', 'pages.json');

export const getStaticPaths: GetStaticPaths = async () => {
  console.log("getStaticPaths slug");
  
  let posts: PostsOrPages = [];

  if (fs.existsSync(postsFilePath)) {
    posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  } else {
    posts = await getPosts();
    const urlMap = await processPosts(posts);
    replaceUrlsInPosts(posts, urlMap);

    fs.mkdirSync(path.dirname(postsFilePath), { recursive: true });
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  }
  
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  let settings;
  let post;
  let pages;

  try {
    if (fs.existsSync(postsFilePath) && fs.existsSync(settingsFilePath) && fs.existsSync(pagesFilePath)) {
      settings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));
      pages = JSON.parse(fs.readFileSync(pagesFilePath, 'utf8'));

      // Read data from existing JSON files
      let posts : PostsOrPages = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
      post = posts.find((p: PostOrPage) => p.slug === slug);

    }
    if (!post || !fs.existsSync(postsFilePath) || !fs.existsSync(settingsFilePath) || !fs.existsSync(pagesFilePath)) {
      console.log('Creating new data files from [slug].tsx...');

      const singlePostFilePath = path.join(process.cwd(), 'data', 'posts', `${slug}.json`);

      // Fetch data if JSON files do not exist
      settings = await getNavigation();
      post = await getSinglePost(slug);
      pages = await getAllPages();

      const urlMap = await processSinglePost(post);
      replaceUrlInSinglePost(urlMap, post);

      // Save fetched data to JSON files
      fs.mkdirSync(path.dirname(singlePostFilePath), { recursive: true });
      fs.writeFileSync(singlePostFilePath, JSON.stringify(post, null, 2));
      fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
      fs.writeFileSync(pagesFilePath, JSON.stringify(pages, null, 2));
    } 
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
      pages,
    },
    revalidate: 60, // Optional: Revalidate every 60 seconds
  };
};

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
