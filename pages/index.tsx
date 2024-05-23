import Image from 'next/image';
import Card from '../app/Card'; // Adjust the import paths as necessary
import FeaturedSection from '../app/FeaturedSection';
import PostsList from '../app/PostsList';
import { GetStaticProps } from 'next';
import type { PostsOrPages, SettingsResponse } from '@tryghost/content-api';
import { getPosts, getNavigation } from '../app/ghost-client';
import BlogLayout from '@/app/BlogLayout';
import RootLayout from '@/app/layout';

interface CmsData {
  posts: PostsOrPages;
  settings: SettingsResponse;
  previewPosts?: PostsOrPages;
  prevPost?: PostsOrPages;
  nextPost?: PostsOrPages;
  bodyClass: string;
}

export const getStaticProps: GetStaticProps = async () => {
  let settings;
  let posts: PostsOrPages | [];

  console.time('Index - getStaticProps');

  try {
    posts = await getPosts();
    settings = await getNavigation();
    console.log('settings getStaticProps', settings);

  } catch (error) {
    throw new Error('Index creation failed.');
  }

  const cmsData = {
    settings,
    posts,
  };

  console.timeEnd('Index - getStaticProps');

  return {
    props: {
      cmsData,
    },
  };
};

const Home = ({ cmsData }: { cmsData: CmsData }) => {
  const { posts } = cmsData;

  // Assuming the first post is the featured post
  const featuredPost = posts[0];
  // Assuming the next two posts are for the side posts
  const sidePosts = posts.slice(1, 3);
  // Remaining posts
  const remainingPosts = posts.slice(3);

  return (
      <main className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
        <div className="flex-grow">
          <FeaturedSection featuredPost={featuredPost} sidePosts={sidePosts} />
          <PostsList posts={remainingPosts} />
        </div>
      </main>
  );
};

export default function Page({ cmsData }: { cmsData: CmsData }) {
  const { settings } = cmsData;
  console.log('settings 2', settings)
  
  return (
    <RootLayout settings={settings}>
      <Home cmsData={cmsData} />
    </RootLayout>
  );
}
