import { useState, useEffect } from "react";

import loginService from "./services/login";
import blogService from "./services/blogs";

import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import { useMemo } from "react";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  const sortedBlogs = useMemo(() => {
    return blogs.sort((a, b) => b.likes - a.likes);
  }, [blogs]);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      console.info("wrong credentials");
      setMessage("Wrong credentials");

      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject);
      setBlogs(blogs.concat(returnedBlog));
      setMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
      );
    } catch (exception) {
      console.error(exception);
      setMessage("Failed to create blog");
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    }
  };

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        {message && <div>MESSAGE: {message}</div>}
        {loginForm()}
      </div>
    );
  }

  return (
    <div>
      <h2>blogs</h2>
      {message && <div>MESSAGE: {message}</div>}
      <p>{user.name} logged-in</p>
      <button onClick={handleLogout}>logout</button>

      <BlogForm createBlog={createBlog} />

      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          onUpdate={() => {
            blogService.getAll().then((blogs) => setBlogs(blogs));
          }}
        />
      ))}
    </div>
  );
};

export default App;
