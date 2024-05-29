import GhostContentAPI from "@tryghost/content-api";
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';
import { downloadImage } from '../../app/utils/downloadAndUpdateImages';

function extractFirstImageUrl(html) {
  const dom = new JSDOM(html);
  const img = dom.window.document.querySelector('img');
  return img ? img.src : null;
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

