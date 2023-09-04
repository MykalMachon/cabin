import { useEffect, useState } from "preact/hooks"
import type { Post } from '@prisma/client';
import { usePosts } from "./PostsContext";


const PostList = () => {
  const { posts, meta } = usePosts();

  useEffect(() => {
    console.log(posts);
    console.log(meta);
  }, [posts, meta])

  return (
    <div className="cb-postList">
      {posts === null ? (
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