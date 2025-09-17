import Main from './Main'

export default async function Page() {
  const posts = [] // Blog posts removed - contentlayer not used anymore
  return <Main posts={posts} />
}
