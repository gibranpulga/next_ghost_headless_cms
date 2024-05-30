import Image from "next/image";
import Link from "next/link";
import type { PostOrPage } from "@tryghost/content-api";
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Pagination from './Pagination';

function PostsListIndex({ initialPosts, totalPages, currentPage }) {
  const posts = initialPosts;

  return (
    <div className="container mx-auto my-12 max-w-7xl px-4">
      {posts.length > 0 ? (
        posts.map((post, index) => (
          <div key={index} className="flex flex-col md:flex-row bg-gray-100 rounded-lg overflow-hidden mb-8 pb-4 border-b border-gray-300">
            <div className="relative w-full md:w-2/5 rounded-lg" style={{ width: '379px', height: '171px' }}>
              {post.feature_image && (
                <Link href={`/noticia/${post.slug}`}>
                  <Image 
                    src={post.feature_image} 
                    alt={post.feature_image_alt || post.title} 
                    width={379} 
                    height={171} 
                    className="object-cover hover:opacity-90 transition duration-300 ease-in-out rounded-lg" 
                    style={{ width: '379px', height: '171px' }} 
                  />
                </Link>
              )}
            </div>
            <div className="p-6 flex flex-col justify-between w-full md:w-3/5">
              <div>
                <h3 className="text-lg font-semibold text-red-600">
                  <Link href={`/noticia/${post.slug}`} className="hover:underline">{post.title}</Link>
                </h3>
                <p className="text-sm text-gray-700 mb-4">{post.excerpt}</p>
              </div>
              <div className="text-sm text-gray-500">
                <p>{formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No posts found.</p>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => window.location.href = `/pagina/${page}`}
      />
    </div>
  );
}

export default PostsListIndex;
