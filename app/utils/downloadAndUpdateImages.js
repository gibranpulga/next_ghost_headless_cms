const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { JSDOM } = require('jsdom');

async function processPosts(posts) {
  const urlMap = new Map();

  for (const post of posts) {
    const postUrlMap = await processSinglePost(post);
    // Add all values from postUrlMap to urlMap
    for (const [originalUrl, localUrl] of postUrlMap.entries()) {
      urlMap.set(originalUrl, localUrl);
    }
  }

  return urlMap;
}

async function processSinglePost(post) {
  const urlMap = new Map();
  const imageUrls = extractImageUrls(post.html);

  for (const imageUrl of imageUrls) {
    const imageFilename = getCleanImageFilename(imageUrl);
    console.log('imageFilename', imageFilename);

    const localPath = path.join(process.cwd(), 'public', 'images', imageFilename);

    // Ensure the directory exists
    fs.mkdirSync(path.dirname(localPath), { recursive: true });

    // Download the image
    await downloadImage(imageUrl, localPath);

    // Store the original and escaped URLs in the map
    const escapedImageUrl = imageUrl.replace(/&/g, '&amp;'); // Escape & characters
    urlMap.set(imageUrl, `/images/${imageFilename}`);
    urlMap.set(escapedImageUrl, `/images/${imageFilename}`);
  }

  // Update feature_image if it's null
  if (!post.feature_image && imageUrls.length > 0) {
    const firstImageUrl = imageUrls[0];
    const firstImageFilename = getCleanImageFilename(firstImageUrl);
    post.feature_image = `/images/${firstImageFilename}`;
  }

  return urlMap;
}

function extractImageUrls(html) {
  const dom = new JSDOM(html);
  const images = dom.window.document.querySelectorAll('img');
  return Array.from(images).map(img => img.src);
}

function getCleanImageFilename(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const extensionRegex = /\.(jpg|jpeg|png|gif|bmp|webp)$/i;
  const match = pathname.match(extensionRegex);
  if (match) {
    return pathname.substring(pathname.lastIndexOf('/') + 1, match.index + match[0].length);
  }
  console.log('cleaned: ', pathname.substring(pathname.lastIndexOf('/') + 1));
  return pathname.substring(pathname.lastIndexOf('/') + 1);
}

function replaceUrlsInPosts(posts, urlMap) {
  for (const post of posts) {
    replaceUrlsInSinglePost(urlMap, post);
  }

}

function replaceUrlsInSinglePost(urlMap, post) {

  for (const [originalUrl, localUrl] of urlMap) {
    post.html = post.html.replace(new RegExp(originalUrl.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), localUrl);
  }
  
  return post;
}

async function downloadImage(url, filepath) {
  let cleanPath = filepath.split('?')[0];

  const response = await axios({
    url,
    responseType: 'stream',
  }).catch(error => {
    console.error('Axios error: ', error);
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(cleanPath); // Use cleanPath here
    response.data.pipe(writer);
    let error = null;
    writer.on('error', (err) => {
      error = err;
      writer.close();
      reject(err);
    });
    writer.on('close', () => {
      if (!error) {
        resolve();
      }
    });
  });
}

module.exports = {
  processPosts,
  replaceUrlsInPosts,
  downloadImage,
  processSinglePost,
  replaceUrlsInSinglePost,
};
