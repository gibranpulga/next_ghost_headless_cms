import { GetStaticPaths, GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import PostsListIndex from '../../app/PostsListIndex';
import RootLayout from '@/app/layout';
import { getAllPages, getNavigation } from '@/app/ghost-client';

export const getStaticPaths: GetStaticPaths = async () => {
  const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
  const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
  //console.log("posts", posts)
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
  const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
  
  const posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));

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
