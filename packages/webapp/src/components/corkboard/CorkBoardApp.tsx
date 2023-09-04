import { PostProvider } from "./PostsContext";
import PostForm from "./PostForm";
import PostList from "./PostList";


const CorkBoardApp = () => {
  return (
    <PostProvider>
      <PostForm />
      <PostList initPosts={[]} />
    </PostProvider>
  );
}

export default CorkBoardApp;