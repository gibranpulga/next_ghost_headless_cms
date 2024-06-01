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
            <Link href={`/noticia/${post.slug}`} legacyBehavior>
              <a className="flex items-center">
                {post.feature_image && (
                  <Image
                    src={post.feature_image}
                    alt={post.feature_image_alt || post.title}
                    width={95}
                    height={95}
                    className="mr-4 rounded-lg"
                  />
                )}
                <div>
                  <h3 className="text-sm font-bold">{post.title}</h3>
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
