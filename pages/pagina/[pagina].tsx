import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import PostsListIndex from '../../app/components/PostsListIndex';
import RootLayout from '@/app/components/Layout';
import { getAllPages, getNavigation, getPosts } from '@/app/ghost/ghost-client';
import { processPosts, replaceUrlsInPosts } from '@/app/utils/downloadAndUpdateImages';


const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');

export const getStaticPaths: GetStaticPaths = async () => {
  let posts = await fetchPosts();
  
  const totalPages = Math.ceil(posts.length / 10);

  const paths = Array.from({ length: totalPages }, (_, index) => ({
    params: { pagina: (index + 1).toString() },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const pageArray = params?.pagina as string[];
  const page = pageArray ? parseInt(pageArray[0], 10) : 1;
  
  let posts = await fetchPosts();

  const start = (page - 1) * 10;
  const paginatedPosts = posts.slice(start, start + 10);
  const totalPages = Math.ceil(posts.length / 10);

  const settings = await getNavigation();
  const pages = await getAllPages();

  return {
    props: {
      initialPosts: paginatedPosts,
      totalPages,
      currentPage: page,
      settings,
      pages,
    },
    revalidate: 60,
  };
};

const PaginatedPage = ({ initialPosts, totalPages, currentPage, settings, pages }) => {
  return (
    <RootLayout settings={settings} pages={pages}>
      <PostsListIndex initialPosts={initialPosts} totalPages={totalPages} currentPage={currentPage} />
    </RootLayout>
  );
};

export default PaginatedPage;

async function fetchPosts() {
  let posts;

  if (fs.existsSync(postsFilePath)) {
    posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
  } else {
    posts = await getPosts();
    const urlMap = await processPosts(posts);
    replaceUrlsInPosts(posts, urlMap);

    fs.mkdirSync(path.dirname(postsFilePath), { recursive: true });
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  }
  return posts;
}

