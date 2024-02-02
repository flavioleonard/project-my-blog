import styles from "./Post.module.css";

import { useParams } from "react-router-dom";
import { useFetchDocument } from "../../hooks/useFetchSingleDocument"; //uitlizado para acessar os parametros da URL em rotas

const Post = () => {
  const { id } = useParams();
  const { document: post, loading } = useFetchDocument("posts", id);
  return (
    <div className={styles.post_container}>
      {loading && <p>Carregando post...</p>}
      {post && (
        <>
          <h1>{post.title}</h1>
          <div className={styles.image_container}>
            <img src={post.image} alt={post.title} className={styles.image} />
          </div>
          <p>{post.body}</p>
          <h3>O post trata sobre:</h3>
          <div className={styles.tags}>
            {post.tagsArray.map((tag) => (
              <p key={tag}>
                <span>#</span>
                {tag}
              </p>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Post;
