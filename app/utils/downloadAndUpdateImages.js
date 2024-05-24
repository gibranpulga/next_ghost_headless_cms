const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { JSDOM } = require('jsdom');

async function downloadImage(url, filepath) {
  const response = await axios({
    url,
    responseType: 'stream',
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filepath);
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

function extractImageUrls(html) {
  const dom = new JSDOM(html);
  const images = dom.window.document.querySelectorAll('img');
  return Array.from(images).map(img => img.src);
}

async function processPosts(posts) {
  for (const post of posts) {
    const imageUrls = extractImageUrls(post.html);
    
    for (const imageUrl of imageUrls) {
      const imageFilename = path.basename(imageUrl);
      const localPath = path.join(process.cwd(), 'public', 'images', imageFilename);

      // Ensure the directory exists
      fs.mkdirSync(path.dirname(localPath), { recursive: true });

      // Download the image
      await downloadImage(imageUrl, localPath);

      // Replace the image URL in the post HTML with the local path
      post.html = post.html.replace(imageUrl, `/images/${imageFilename}`);
    }

    // Update feature_image if it's null
    if (!post.feature_image && imageUrls.length > 0) {
      const firstImageUrl = imageUrls[0];
      const firstImageFilename = path.basename(firstImageUrl);
      post.feature_image = `/images/${firstImageFilename}`;
    }
  }
}

module.exports = {
  processPosts,
  downloadImage
};
