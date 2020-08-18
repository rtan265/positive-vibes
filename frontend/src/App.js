import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'reactstrap';
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
    {/* <Particles> */}
      <Container>
        <Row>
        <Col sm="12" md={{ size: 6, offset: 3 }}>
         {/* eslint-disable jsx-a11y/accessible-emoji  */}
          <h1 className = "title">🥳 Positive Vibes Only 🥳</h1>
          <div className = "message-group"> 
            <p>Name</p>
            <input onChange={(e) => setName(e.target.value)}></input>
            <p>Messages</p>
            <textarea onChange={(e) => setMessage(e.target.value)}></textarea>
            <button className = "button-input" onClick={savePost}>Submit</button>
          </div>
          <p className = "recent-posts">The 10 most recent posts</p>
          <div className = "posts-group">
            {posts.reverse().slice(0, 10).map((post) => {
              return (
                <div>
                  <h1>{post.name}</h1>
                  <p>{post.message}</p>
                </div>
              )})
            }
          </div>
          </Col>
        </Row>
      </Container>
      {/* </Particles> */}
    </>
  );
  
}

export default App;