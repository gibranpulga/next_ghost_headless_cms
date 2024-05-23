import Link from 'next/link';
import Image from 'next/image';
import type { PostOrPage } from '@tryghost/content-api';

interface PopularPostsProps {
  posts: PostOrPage[];
}

const PopularPosts = ({ posts }: PopularPostsProps) => {
  return (
    <div className="bg-white p-4 border border-gray-200 shadow-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Mais lidos</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id} className="mb-4">
            <Link href={`/read/${post.slug}`} legacyBehavior>
              <a className="flex items-center">
                {post.feature_image && (
                  <Image
                    src={post.feature_image}
                    alt={post.feature_image_alt || post.title}
                    width={50}
                    height={50}
                    className="mr-4 rounded-lg"
                  />
                )}
                <div>
                  <h3 className="text-lg font-bold">{post.title}</h3>
                  <p className="text-sm text-gray-500">{post.excerpt}</p>
                </div>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PopularPosts;
