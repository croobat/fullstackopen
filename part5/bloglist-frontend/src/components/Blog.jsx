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

  const handleRemove = async () => {
    const confirm = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`,
    );

    if (!confirm) return;

    try {
      await blogService.remove(blog.id);
      onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.blog}>
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

          <button style={styles.removeButton} onClick={handleRemove}>
            remove
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  blog: {
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
  removeButton: {
    backgroundColor: "red",
    color: "white",
  },
};

export default Blog;
