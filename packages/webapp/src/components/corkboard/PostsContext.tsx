// react context for posts that uses a reducer 
// to manage state and actions for posts

import { createContext } from 'preact';
import type { ComponentChildren } from "preact";
import { useContext, useEffect, useState } from 'preact/hooks';

import type { Post } from '@prisma/client';

type PostContextType = {
  posts: Array<Post> | null;
  meta: any;
  getPosts: () => Promise<void>;
};

type PostProviderProps = {
  children: ComponentChildren;
}

const PostContext = createContext<PostContextType>({
  posts: null,
  meta: null,
  getPosts: async () => {
    console.log('STUB: getPosts');
  },
});

export const PostProvider = ({ children }: PostProviderProps) => {
  const [posts, setPosts] = useState<Array<Post> | null>(null);
  const [meta, setMeta] = useState<any>(null);

  const getPosts = async () => {
    const { posts: newPosts, meta: newMeta } = await fetch('/api/corkboard/posts').then(res => res.json());
    setPosts(newPosts);
    setMeta(newMeta);
  };

  const updatePost = async (postId: string, newPost: Post) => {
    return newPost;
  }

  const defaultPostContext = {
    posts,
    meta,
    getPosts,
    updatePost
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <PostContext.Provider value={defaultPostContext}>
      {children}
    </PostContext.Provider>
  )
};

export const usePosts = () => useContext(PostContext);
