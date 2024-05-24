import { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { getAllPages, getAllTags, getNavigation, getSingleTag, getTagPosts } from '../../app/ghost-client';
import type { Tag, PostsOrPages, SettingsResponse } from '@tryghost/content-api';
import RootLayout from '../../app/layout'; // Adjust the import path
import '../../app/cards.min.css';
import PostsList from '../../app/PostsList'; // Adjust the import path

interface TagPageProps {
  tag: Tag;
  posts: PostsOrPages;
  settings: SettingsResponse;
  pages: PostsOrPages;
}

// Generate static paths for each tag
export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getAllTags();
  const paths = tags.map(tag => ({
    params: { slug: tag.slug },
  }));

  return { paths, fallback: 'blocking' };
};

// Fetch data for each tag page
export const getStaticProps: GetStaticProps = async ({ params }) => {
  let tag;
  let posts;
  let settings;
  let pages;

  try {
    settings = await getNavigation();
    tag = await getSingleTag(params?.slug as string);
    posts = await getTagPosts(params?.slug as string);
    pages = await getAllPages();
  } catch (error) {
    return { notFound: true };
  }

  if (!tag || !posts) {
    return { notFound: true };
  }

  return {
    props: {
      tag,
      posts,
      settings,
      pages
    }
  };
};

// Component for displaying the tag and its posts
const TagPage = ({ tag, posts, settings, pages }: TagPageProps) => {
  return (
    <RootLayout settings={settings} pages={pages}>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 dark:bg-gray-900">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
          <article className="mx-auto w-full max-w-3xl prose prose-xl prose-p:text-gray-800 dark:prose-p:text-gray-100 sm:prose-base prose-a:no-underline prose-blue dark:prose-invert">
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
              #{tag.name}
            </h1>
            <section>
              <PostsList posts={posts} />
            </section>
          </article>
        </div>
      </main>
    </RootLayout>
  );
};

export default TagPage;
