import { GetStaticPaths, GetStaticProps } from 'next';
import { getNavigation, getSingleTag, getAllPages, getPosts, getAllTags } from '../../app/ghost-client';
import type { Tag, PostsOrPages, SettingsResponse } from '@tryghost/content-api';
import RootLayout from '../../app/layout';
import '../../app/cards.min.css';
import PostsListTag from '@/app/PostsListTag';
import { ensureTagDataFiles } from '../../app/utils/dataUtils';
import fs from 'fs';
import path from 'path';
import { processPosts, replaceUrlsInPosts } from '@/app/utils/downloadAndUpdateImages';

interface TagPageProps {
  tag: Tag;
  initialPosts: PostsOrPages;
  settings: SettingsResponse;
  pages: PostsOrPages;
  totalPages: number;
}

const tagsFilePath = path.join(process.cwd(), 'data', 'tags.json');
const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');
const pagesFilePath = path.join(process.cwd(), 'data', 'pages.json');


export const getStaticPaths: GetStaticPaths = async () => {
  let tags;
  
  if (!fs.existsSync(tagsFilePath)) {
    tags = await getAllTags();
    fs.writeFileSync(tagsFilePath, JSON.stringify(tags, null, 2));
  } else {
    tags = JSON.parse(fs.readFileSync(tagsFilePath, 'utf8'));
  }
  const paths = tags.map((tag: Tag) => ({
    params: { slug: tag.slug },
  }));

  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  

  let tag;
  let posts;
  let settings;
  let pages;
  let totalPages = 1;

  try {
    if (!fs.existsSync(postsFilePath) || !fs.existsSync(tagsFilePath) || !fs.existsSync(settingsFilePath) || !fs.existsSync(pagesFilePath)) {
      console.log('Creating new data files from tags/[slug]...');

      // Fetch data if JSON files do not exist
      tag = await getSingleTag(slug);
      posts = await getPosts();
      settings = await getNavigation();
      pages = await getAllPages();

      const urlMap = await processPosts(posts);
      replaceUrlsInPosts(posts, urlMap);

      fs.mkdirSync(path.dirname(tagsFilePath), { recursive: true });
      fs.mkdirSync(path.dirname(settingsFilePath), { recursive: true });
      fs.mkdirSync(path.dirname(pagesFilePath), { recursive: true });
      fs.mkdirSync(path.dirname(postsFilePath), { recursive: true });


      fs.writeFileSync(tagsFilePath, JSON.stringify(tags, null, 2));
      fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
      fs.writeFileSync(pagesFilePath, JSON.stringify(pages, null, 2));
      fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
    } else {
      // Read data from existing JSON files
      posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
      settings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));
      pages = JSON.parse(fs.readFileSync(pagesFilePath, 'utf8'));
      let tags = JSON.parse(fs.readFileSync(tagsFilePath, 'utf8'));
      tag = tags.find((t: Tag) => t.slug === slug);
    }
    totalPages = posts.meta.pagination.pages;
  } catch (error) {
    return { notFound: true };
  }

  if (!tag || !posts) {
    return { notFound: true };
  }

  return {
    props: {
      tag,
      initialPosts: posts,
      settings,
      pages,
      totalPages,
    },
    revalidate: 60,
  };
};

const TagPage = ({ tag, initialPosts, settings, pages, totalPages }: TagPageProps) => {
  return (
    <RootLayout settings={settings} pages={pages}>
      <main className="pt-8 pb-16 lg:pt-16 lg:pb-24 dark:bg-gray-900">
        <div className="flex justify-between px-4 mx-auto max-w-screen-xl">
          <article className="mx-auto w-full max-w-3xl prose prose-xl prose-p:text-gray-800 dark:prose-p:text-gray-100 sm:prose-base prose-a:no-underline prose-blue dark:prose-invert">
            <h1 className="mb-4 text-3xl font-extrabold leading-tight text-gray-900 lg:mb-6 lg:text-4xl dark:text-white">
              #{tag.name}
            </h1>
            <section>
              <PostsListTag initialPosts={initialPosts} totalPages={totalPages} tagSlug={tag.slug} />
            </section>
          </article>
        </div>
      </main>
    </RootLayout>
  );
};

export default TagPage;
