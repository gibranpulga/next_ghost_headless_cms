import GhostContentAPI from "@tryghost/content-api";
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { processPosts, replaceUrlsInPosts, downloadImage } from '../../app/utils/downloadAndUpdateImages';

const api = new GhostContentAPI({
  url: 'https://ghost-test-2.ghost.io',
  key: '04ff3be8c62bcfb70fc57d1b3d',
  version: "v5.0"
});

function extractFirstImageUrl(html) {
  const dom = new JSDOM(html);
  const img = dom.window.document.querySelector('img');
  return img ? img.src : null;
}

async function processPostInsidePosts(posts) {
  for (const post of posts) {
    await addFeatureImageFromFirstImage(post);
  }
  return posts;
}

async function addFeatureImageFromFirstImage(post) {
  if (post && !post.feature_image) {
    const firstImageUrl = extractFirstImageUrl(post.html);
    if (firstImageUrl) {
      const imageFilename = path.basename(firstImageUrl);
      const localPath = path.join(process.cwd(), 'public', 'images', imageFilename);

      fs.mkdirSync(path.dirname(localPath), { recursive: true });
      await downloadImage(firstImageUrl, localPath);

      post.feature_image = `/images/${imageFilename}`;
    }
  }
}

export default async function handler(req, res) {
  const { page = 1 } = req.query;

  try {
    const posts = await api.posts.browse({
      include: ["tags", "authors"],
      limit: 10,
      page
    });

    const urlMap = await processPosts(posts);
    replaceUrlsInPosts(posts, urlMap);

    const postsFilePath = path.join(process.cwd(), 'data', 'posts.json');
    fs.mkdirSync(path.dirname(postsFilePath), { recursive: true });
    fs.writeFileSync(postsFilePath, JSON.stringify(posts, null, 2));

    await processPostInsidePosts(posts);

    res.status(200).json({ posts: posts, meta: posts.meta });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}
