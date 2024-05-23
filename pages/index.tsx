import FeaturedSection from '../app/FeaturedSection';
import PostsList from '../app/PostsList';
import { GetStaticProps } from 'next';
import type { PostsOrPages, SettingsResponse, PostOrPage } from '@tryghost/content-api';
import { getPosts, getNavigation, getTagPosts, getAllPages } from '../app/ghost-client';
import RootLayout from '@/app/layout';
import PopularPosts from '../app/PopularPosts'; // Import the new component
import CustomFinancialWidget from '@/app/TradingViewWidget';
import HoroscopeWidget from '@/app/HoroscopeWidget';


interface CmsData {
  posts: PostsOrPages;
  settings: SettingsResponse;
  popularPosts: PostsOrPages; // Add popularPosts to CmsData
  featuredPost: PostOrPage | null; // Add featuredPost to CmsData
  sidePosts: PostsOrPages; // Add sidePosts to CmsData
  pages: PostsOrPages; // Add pages to CmsData
}

export const getStaticProps: GetStaticProps = async () => {
  let settings;
  let posts: PostsOrPages | [];
  let popularPosts: PostsOrPages | [];
  let featuredPost: PostOrPage | null = null;
  let sidePosts: PostsOrPages | [] = [];
  let pages: PostsOrPages | [] = [];

  console.time('Index - getStaticProps');

  try {
    posts = await getPosts();
    settings = await getNavigation();
    popularPosts = await getTagPosts('mais-lidos'); // Fetch posts with the "mais-lidos" tag
    pages = await getAllPages();
  } catch (error) {
    throw new Error('Index creation failed.');
  }

  // Find the most recent featured post
  featuredPost = posts.find(post => post.featured) || null;

  // Filter out "mais-lidos" and "side-post" posts from the main posts
  const filteredPosts = posts.filter(post => !post.tags.some(tag => tag.slug === 'mais-lidos' || tag.slug === 'side-post'));

  // Filter side posts and get the most recent 2
  sidePosts = posts
    .filter(post => post.tags.some(tag => tag.slug === 'side-post'))
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
    .slice(0, 2);

  const cmsData = {
    settings,
    posts: filteredPosts,
    popularPosts, // Include popularPosts in cmsData
    featuredPost, // Include featuredPost in cmsData
    sidePosts, // Include sidePosts in cmsData
    pages, // Include pages in cmsData
  };

  console.timeEnd('Index - getStaticProps');

  return {
    props: {
      cmsData,
    },
  };
};

const Home = ({ cmsData }: { cmsData: CmsData }) => {
  const { posts, popularPosts, featuredPost, sidePosts, pages } = cmsData;

  // Remaining posts
  const remainingPosts = posts.slice();

  return (
    <main className="bg-gray-100 min-h-screen flex flex-col">
      <div className="container mx-auto max-w-7xl px-4">
        <FeaturedSection featuredPost={featuredPost} sidePosts={sidePosts} />
        <div className="flex flex-col md:flex-row mt-8">
          <div className="flex-grow md:w-3/4 md:pr-4">
            <PostsList posts={remainingPosts} />
          </div>
          <aside className="md:w-1/4 md:pl-4">
            <PopularPosts posts={popularPosts} />
            <CustomFinancialWidget /> 
            <HoroscopeWidget/>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default function Page({ cmsData }: { cmsData: CmsData }) {
  const { settings, pages } = cmsData;

  return (
    <RootLayout settings={settings} pages={pages}>
      <Home cmsData={cmsData} />
    </RootLayout>
  );
}
