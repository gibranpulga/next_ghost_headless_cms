import GhostContentAPI, { GhostAPI } from "@tryghost/content-api";


// Create API instance with site credentials
export const api: GhostAPI = new GhostContentAPI({
  url: 'https://ghost-test-2.ghost.io',
  key: '04ff3be8c62bcfb70fc57d1b3d',
  version: "v5.0"
});

export async function getPosts() {
  return await api.posts
    .browse({
      include: ["tags", "authors"],
      limit: "all",
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getFeaturedPost() {
  return await api.posts.browse({ filter: "featured:true", limit: "all" })
    .catch((error) => {
      console.log(error);
    });
}

export async function getSinglePost(postSlug: string) {
  const post = await api.posts
    .read({
      slug: postSlug
    }, { include: ["tags", "authors"] })
    .catch((error) => {
      console.log(error);
    });

  return post;
}

export async function getAllPages() {
  return await api.pages
    .browse({
      limit: 'all'
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getSinglePage(pageSlug: string) {
  return await api.pages
    .read({
      slug: pageSlug
    }, { include: ["tags"] })
    .catch((error) => {
      console.log(error);
    });
}

export async function getSingleAuthor(authorSlug: string) {
  return await api.authors.read({
    slug: authorSlug
  }, { include: ["count.posts"] })
    .catch((error) => {
      console.log(error);
    });
}

export async function getSingleAuthorPosts(authorSlug: string, page: number = 1) {
  return await api.posts.browse({ 
    filter: `authors:${authorSlug}`,
    limit: 10,
    page: page
  })
    .catch((error) => {
      console.log(error);
    });
};

export async function getAllAuthors() {
  return await api.authors
    .browse({
      limit: "all"
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function getTagPosts(tagSlug: string) {
  return await api.posts.browse({
    filter: `tag:${tagSlug}`,
    include: ['tags', 'authors'],
    limit: "all",
  }).catch((error: Error) => {
    console.log(error);
  });
}


export async function getSingleTag(tagSlug: string) {
  return await api.tags.read({ slug: tagSlug })
    .catch((error) => {
      console.log(error);
    });
}

export async function getAllTags() {
  return await api.tags.browse({
    limit: "all"
  })
    .catch((error) => {
      console.log(error);
    });
}

export async function getSearchPosts() {
  return await api.posts.browse({ include: ["tags", "authors"], limit: "all" })
    .catch((error) => {
      console.log(error);
    });
}

export async function getNavigation() {
  return await api.settings.browse()
    .catch((error) => {
      console.log(error);
    });
}
