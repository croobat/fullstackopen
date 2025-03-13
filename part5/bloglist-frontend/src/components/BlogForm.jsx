import { useState } from "react";

const INITIAL_STATE = {
  title: "",
  author: "",
  url: "",
};

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState(INITIAL_STATE);

  const addBlog = async (event) => {
    event.preventDefault();

    createBlog(newBlog);

    setNewBlog(INITIAL_STATE);
  };

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            type="text"
            value={newBlog.title}
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, title: target.value })
            }
          />
        </div>

        <div>
          author:
          <input
            type="text"
            value={newBlog.author}
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, author: target.value })
            }
          />
        </div>

        <div>
          url:
          <input
            type="text"
            value={newBlog.url}
            onChange={({ target }) =>
              setNewBlog({ ...newBlog, url: target.value })
            }
          />
        </div>

        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default BlogForm;
