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
  currentPage: number; // Add currentPage to CmsData
}


export const getStaticProps: GetStaticProps = async (context) => {
  const currentPage = context.params?.page ? parseInt(context.params.page as string, 10) : 1;

  let settings;
  let posts = [];
  let popularPosts = [];
  let featuredPost = null;
  let sidePosts = [];
  let pages = [];
  let totalPages = 1;

  try {
    const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
    const settingsFilePath = path.join(process.cwd(), 'data', 'settings.json');
    const pagesFilePath = path.join(process.cwd(), 'data', 'pages.json');
    const popularPostsFilePath = path.join(process.cwd(), 'data', 'popular-posts.json');
    const featuredPostFilePath = path.join(process.cwd(), 'data', 'featured-post.json');
    const sidePostsFilePath = path.join(process.cwd(), 'data', 'side-posts.json');

    if (!fs.existsSync(postsFilePath) || !fs.existsSync(settingsFilePath) || !fs.existsSync(pagesFilePath) || 
    !fs.existsSync(popularPostsFilePath) || !fs.existsSync(featuredPostFilePath) || !fs.existsSync(sidePostsFilePath)) {
      console.log('Creating new data files from index...');

      posts = await getPosts();
      totalPages = Math.ceil(posts.length / 10);
      settings = await getNavigation();
      popularPosts = await getTagPosts('mais-lidos');
      pages = await getAllPages();
      sidePosts = await getTagPosts('side-post');
      let featuredPosts = await getFeaturedPost();
      featuredPost = featuredPosts.find(item => !item.meta);

      // Process and download images
      console.log('Processing posts...');
      const urlMap = await processPosts(posts);
      console.log('Processing popular posts...');
      const urlMapPopularPosts = await processPosts(popularPosts);
      console.log('Processing side posts...');
      const urlMapSidePosts = await processPosts(sidePosts);
      
      console.log('Replacing URLs in posts...');
      replaceUrlsInPosts(posts, urlMap);
      replaceUrlsInPosts(popularPosts, urlMapPopularPosts);
      replaceUrlsInPosts(sidePosts, urlMapSidePosts);
      
      fs.mkdirSync(path.dirname(postsFilePath), { recursive: true });
      fs.mkdirSync(path.dirname(popularPostsFilePath), { recursive: true });
      fs.mkdirSync(path.dirname(sidePostsFilePath), { recursive: true });
      fs.mkdirSync(path.dirname(featuredPostFilePath), { recursive: true });
      fs.mkdirSync(path.dirname(settingsFilePath), { recursive: true });
      fs.mkdirSync(path.dirname(pagesFilePath), { recursive: true });

      fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
      fs.writeFileSync(popularPostsFilePath, JSON.stringify(popularPosts, null, 2));
      fs.writeFileSync(sidePostsFilePath, JSON.stringify(sidePosts, null, 2));
      fs.writeFileSync(featuredPostFilePath, JSON.stringify(featuredPost, null, 2));
      fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
      fs.writeFileSync(pagesFilePath, JSON.stringify(pages, null, 2));
    } else {
      posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
      popularPosts = JSON.parse(fs.readFileSync(popularPostsFilePath, 'utf8'));
      sidePosts = JSON.parse(fs.readFileSync(sidePostsFilePath, 'utf8'));
      featuredPost = JSON.parse(fs.readFileSync(featuredPostFilePath, 'utf8'));
      settings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf8'));
      pages = JSON.parse(fs.readFileSync(pagesFilePath, 'utf8'));
    }
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
    currentPage,
  };

  return {
    props: {
      cmsData,
    },
    revalidate: 60,
  };
};



const Home = ({ cmsData }: { cmsData: CmsData }) => {
  const { posts, popularPosts, featuredPost, sidePosts, totalPages, currentPage } = cmsData;
  const initialPosts = posts.slice(0, 10); // Show the first 10 posts initially


  return (
    <main className="bg-gray-100 min-h-screen flex flex-col">
      <div className="container mx-auto max-w-7xl px-4">
        <FeaturedSection featuredPost={featuredPost} sidePosts={sidePosts} />
        <div className="flex flex-col md:flex-row mt-8">
          <div className="flex-grow md:w-3/4 md:pr-4">
          <PostsListIndex initialPosts={initialPosts} totalPages={totalPages} currentPage={currentPage} />
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
