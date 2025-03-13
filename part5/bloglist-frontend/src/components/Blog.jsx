import { useState } from "react";

import blogService from "../services/blogs";

const Blog = ({ blog, onUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  const handleLike = async () => {
    try {
      const updatedBlog = {
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1,
      };

      await blogService.update(blog.id, updatedBlog);

      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.blogStyle}>
      <div style={styles.row}>
        <div>
          {blog.title} - {blog.author}
        </div>

        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? "hide" : "view"}
        </button>
      </div>

      {expanded && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes: {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user.name}</div>
        </div>
      )}
    </div>
  );
};

const styles = {
  blogStyle: {
    padding: 8,
    border: "solid",
    borderWidth: 1,
    marginBottom: 10,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
};

export default Blog;
