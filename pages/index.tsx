import FeaturedSection from '../app/FeaturedSection';
import PostsListIndex from '@/app/PostsListIndex';
import { GetStaticProps } from 'next';
import type { PostsOrPages, SettingsResponse, PostOrPage } from '@tryghost/content-api';
import { getPosts, getNavigation, getTagPosts, getAllPages, getFeaturedPost } from '../app/ghost-client';
import RootLayout from '@/app/layout';
import PopularPosts from '../app/PopularPosts'; // Import the new component
import CustomFinancialWidget from '@/app/TradingViewWidget';
import HoroscopeWidget from '@/app/HoroscopeWidget';
import { useState, useEffect } from "react";
import { processPosts, replaceUrlsInPosts } from '../app/utils/downloadAndUpdateImages';
import fs from 'fs';
import path from 'path';


interface CmsData {
  posts: PostsOrPages;
  settings: SettingsResponse;
  popularPosts: PostsOrPages; // Add popularPosts to CmsData
  featuredPost: PostOrPage | null; // Add featuredPost to CmsData
  sidePosts: PostsOrPages; // Add sidePosts to CmsData
  pages: PostsOrPages; // Add pages to CmsData
  totalPages: number; // Add totalPages to CmsData
}
//

export const getStaticProps: GetStaticProps = async () => {
  let settings;
  let posts = [];
  let popularPosts = [];
  let featuredPost = null;
  let sidePosts = [];
  let pages = [];
  let totalPages = 1;

  try {
    posts = await getPosts();
    totalPages = posts.meta.pagination.pages;
    settings = await getNavigation();
    popularPosts = await getTagPosts('mais-lidos');
    pages = await getAllPages();
    sidePosts = await getTagPosts('side-post');
    let featuredPosts = await getFeaturedPost();
    featuredPost = featuredPosts.find(item => !item.meta);

    // Process and download images
    const urlMap = await processPosts(posts);
    replaceUrlsInPosts(posts, urlMap);
    
    const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
    fs.mkdirSync(path.dirname(postsFilePath), { recursive: true });
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  } catch (error) {
    throw new Error('Index creation failed: ' + error);
  }

  const filteredPosts = posts.filter(post => !post.tags.some(tag => tag.slug === 'mais-lidos'));
  sidePosts = sidePosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()).slice(0, 2);

  const cmsData = {
    settings,
    posts: filteredPosts,
    popularPosts,
    featuredPost,
    sidePosts,
    pages,
    totalPages,
  };

  return {
    props: {
      cmsData,
    },
    revalidate: 60,
  };
};



const Home = ({ cmsData }: { cmsData: CmsData }) => {
  const { posts, popularPosts, featuredPost, sidePosts, totalPages } = cmsData;
  const [currentPosts, setCurrentPosts] = useState<PostOrPage[]>(posts);
  const [currentPage, setCurrentPage] = useState(1);


  return (
    <main className="bg-gray-100 min-h-screen flex flex-col">
      <div className="container mx-auto max-w-7xl px-4">
        <FeaturedSection featuredPost={featuredPost} sidePosts={sidePosts} />
        <div className="flex flex-col md:flex-row mt-8">
          <div className="flex-grow md:w-3/4 md:pr-4">
          <PostsListIndex initialPosts={posts} totalPages={totalPages} />
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
