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


