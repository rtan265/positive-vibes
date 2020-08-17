import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = "https://moodbook-backend.herokuapp.com";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = () => {
    fetch(API_URL + "/moodposts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
  }

  const savePost = () => {
    const post = {
      name: name,
      message: message
    };

    fetch(API_URL + "/createpost", {
      method: "POST",
      headers: { "content-type": "application/json"},
      body: JSON.stringify(post)
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success){
          setName("");
          setMessage("");
          getPosts();
        }
      })
  }

  return (
    <>
      <p>Messages</p>
      <input onChange={(e) => setMessage(e.target.value)}></input>
      <p>Name</p>
      <input onChange={(e) => setName(e.target.value)}></input>
      <button onClick={savePost}>Submit</button>
      {console.log(posts)}
      {posts.map((post) => {
        return (
          <>
            <h1>{post.name}</h1>
            <p>{post.message}</p>
          </>
        )
      })}
    </>
  );
}

export default App;
