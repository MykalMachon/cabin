import { useEffect, useState } from "preact/hooks"
import type { Post } from '@prisma/client';

interface PostsListProps {
  initPosts: Array<Post>
}

const PostList = ({ initPosts }: PostsListProps) => {

  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    const getPosts = async () => {
      setPostsLoading(true);
      const res = await fetch('/api/corkboard/posts');
      const data = await res.json();
      setPosts(data.posts);
      setPostsLoading(false);
    }
    getPosts();
  }, [])

  return (
    <div className="cb-postList">
      {postsLoading === true ? (
        <p>loading...</p>
      ) : (
        <>
          {posts.length === 0 ?
            (<p>no posts...</p>) :
            (
              <>
                {posts.map((post: Post) => (
                  <article className="cb-postList__post">
                    <header>
                      <strong>{post.user.name}</strong>
                      <p><i>posted on {new Date(post.createdAt).toDateString()}</i></p>
                    </header>
                    <main>
                      <p>{post.content}</p>
                    </main>
                  </article>
                ))}
              </>
            )}
        </>
      )}
    </div>
  )
}

export default PostList;