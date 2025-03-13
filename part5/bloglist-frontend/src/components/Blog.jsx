import { useState } from "react";

const Blog = ({ blog }) => {
  const [expanded, setExpanded] = useState(false);

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
            likes: {blog.likes}{" "}
            <button onClick={() => console.log("like")}>like</button>
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
