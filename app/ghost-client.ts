import GhostContentAPI, { PostOrPage, GhostAPI, GhostError, PostsOrPages } from "@tryghost/content-api";
import fs from 'fs';
import path from 'path';
import { processPosts, replaceUrlsInPosts, downloadImage } from './utils/downloadAndUpdateImages'; // Import the new function

// Create API instance with site credentials
export const api: GhostAPI = new GhostContentAPI({
  url: 'https://ghost-test-2.ghost.io',
  key: '04ff3be8c62bcfb70fc57d1b3d',
  version: "v5.0"
});

// Helper function to extract the first image URL from HTML content
import { JSDOM } from 'jsdom';

function extractFirstImageUrl(html: string): string | null {
  const dom = new JSDOM(html);
  const img = dom.window.document.querySelector('img');
  return img ? img.src : null;
}

// Posts (Home page)
export async function getPosts() {
  let posts: PostsOrPages;

  const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');

  if (fs.existsSync(postsFilePath)) {
    posts = JSON.parse(fs.readFileSync(postsFilePath, 'utf-8'));
  } else {
    posts = await api.posts
      .browse({
        include: ["tags", "authors"],
        limit: 50
      })
      .catch((error: GhostError) => {
        throw error;
      });

    const urlMap = await processPosts(posts);

    console.log('posts: ', posts);

    replaceUrlsInPosts(posts, urlMap);

    fs.mkdirSync(path.dirname(postsFilePath), { recursive: true });
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));
  }

  await processPostInsidePosts(posts);
  return posts;
}

async function processPostInsidePosts(posts: PostsOrPages) {
  for (const post of posts) {
    await addFeatureImageFromFirstImage(post);
  }
  return posts;
}

// Pagination
export async function getPaginationPosts(page: number) {
  return await api.posts
    .browse({
      include: ["tags", "authors"],
      limit: 10,
      page: page
    })
    .catch((error: Error) => {
      console.log(error);
    });
}

export async function getSinglePost(postSlug: string) {
  const post = await api.posts
    .read({
      slug: postSlug
    }, { include: ["tags", "authors"] })
    .catch((error: Error) => {
      console.log(error);
    });

  // Replace feature_image with the first image in the html if feature_image is null
  await addFeatureImageFromFirstImage(post);

  if (post) {
    const urlMap = await processPosts([post]);
    replaceUrlsInPosts([post], urlMap);
  }

  return post;
}

async function addFeatureImageFromFirstImage(post: void | PostOrPage) {
  if (post && !post.feature_image) {
    const firstImageUrl = extractFirstImageUrl(post.html);
    if (firstImageUrl) {
      const imageFilename = path.basename(firstImageUrl);
      const localPath = path.join(process.cwd(), 'public', 'images', imageFilename);

      // Ensure the directory exists
      fs.mkdirSync(path.dirname(localPath), { recursive: true });

      // Download the image
      await downloadImage(firstImageUrl, localPath);

      // Update the feature_image URL to the local path
      post.feature_image = `/images/${imageFilename}`;
    }
  }
}

// Pages (Page)
export async function getAllPages() {
  return await api.pages
    .browse({
      limit: 'all'
    })
    .catch((error: Error) => {
      console.log(error);
    });
}

export async function getSinglePage(pageSlug: string) {
  return await api.pages
    .read({
      slug: pageSlug
    }, { include: ["tags"] })
    .catch((error: Error) => {
      console.log(error);
    });
}

// Author (Author page)
export async function getSingleAuthor(authorSlug: string) {
  return await api.authors.read({
    slug: authorSlug
  }, { include: ["count.posts"] })
    .catch((error: Error) => {
      console.log(error);
    });
}

export async function getSingleAuthorPosts(authorSlug: string) {
  return await api.posts.browse({ filter: `authors:${authorSlug}` })
    .catch((error: Error) => {
      console.log(error);
    });
};

export async function getAllAuthors() {
  return await api.authors
    .browse({
      limit: "all"
    })
    .catch((error: Error) => {
      console.log(error);
    });
}

// Tag (Tag page)
export async function getTagPosts(tagSlug: string) {
  return await api.posts.browse({ filter: `tag:${tagSlug}`, include: ['tags', 'count.posts'] })
  .then((posts) => {
    return processPostInsidePosts(posts);
  })
  .catch((error: Error) => {
    console.log(error);
  });
}

export async function getSingleTag(tagSlug: string) {
  return await api.tags.read({ slug: tagSlug })
    .catch((error: Error) => {
      console.log(error);
    });
}

export async function getAllTags() {
  return await api.tags.browse({
    limit: "all"
  })
    .catch((error: Error) => {
      console.log(error);
    });
}

// Search
export async function getSearchPosts() {
  return await api.posts.browse({ include: ["tags", "authors"], limit: "all" })
    .catch((error: Error) => {
      console.log(error);
    });
}

// Navigation
export async function getNavigation() {
  return await api.settings.browse()
    .catch((error: Error) => {
      console.log(error);
    });
}
