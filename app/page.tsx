import Main from './Main'

interface Post {
  slug: string;
  date: string;
  title: string;
  summary?: string;
  tags?: string[];
}

export default async function Page() {
  const posts: Post[] = [] // Blog posts removed - contentlayer not used anymore
  return <Main posts={posts} />
}
