import Image from "next/image"
import Link from "next/link"
import type { PostOrPage } from "@tryghost/content-api";

function FeaturedSection({ featuredPost, sidePosts }: { featuredPost: PostOrPage, sidePosts: PostOrPage[] }) {

  return (
    <div className="container mx-auto my-12 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl px-4">
      <div className="col-span-2 bg-white p-6 border border-gray-200 shadow-lg flex flex-col justify-center">
        <h2 className="text-3xl font-bold text-red-600">
          {featuredPost.title}
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          {featuredPost.excerpt}
        </p>
      </div>
      <div className="grid grid-rows-2 gap-4">
        {sidePosts.map((post, index) => (
          <Link href={`/read/${post.slug}`} key={index}>
            <div className="relative h-48 overflow-hidden rounded-lg shadow-lg">
              <Image src={post.feature_image} alt={post.feature_image_alt || post.title} layout="fill" objectFit="cover" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent text-white">
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-sm">{post.excerpt}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default FeaturedSection;
