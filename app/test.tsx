import { getPosts } from "./ghost-client";
import FeaturedSection from "./FeaturedSection";
import PostsList from "./PostsList";
import type { PostsOrPages } from "@tryghost/content-api";
import { notFound } from "next/navigation";
import RootLayout from './layout';

export default async function Test() {
  const getPost: PostsOrPages = await getPosts();
  if (getPost.length === 0) {
    notFound();
  }

  // Assuming the first post is the featured post
  const featuredPost = getPost[0];
  // Assuming the next two posts are for the side posts
  const sidePosts = getPost.slice(1, 3);
  // Remaining posts
  const remainingPosts = getPost.slice(3);

  return (
    <RootLayout>
      <main className="bg-gray-100 min-h-screen flex flex-col md:flex-row">
        <div className="flex-grow">
          <FeaturedSection featuredPost={featuredPost} sidePosts={sidePosts} />
          <PostsList posts={remainingPosts} />
        </div>
      </main>
    </RootLayout>
  );
}
