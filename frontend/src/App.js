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
      .then((data) => setPosts(data.reverse()))
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
          setName('');
          setMessage('');
          getPosts();
        }
      })
  }

  return (
    <>
    {/* <Particles> */}
      <Container>
        <Row>
          {/* eslint-disable jsx-a11y/accessible-emoji  */}
          <h1 className = "title">🥳 Positive Vibes Only 🥳</h1>
        </Row>
        <Row>
          <Col sm="12" md="6">
            <div className = "message-group"> 
              <p>Name</p>
              <input className = "input-name" onChange={(e) => setName(e.target.value)}></input>
              <p>Messages</p>
              <textarea className = "text-area-message" onChange={(e) => setMessage(e.target.value)}></textarea>
              <p><button className = "button-input" onClick={savePost}>Submit</button></p>
            </div>
          </Col>
          <Col sm="12" md="6" className="messages-container">
            <h1>Most recent posts</h1>
            <div className = "posts-group">
              {posts.slice(0, 10).map((post) => {
                return (
                  <div>
                    <p className = "post-message">{post.message}</p>
                    <p className = "post-name">- {post.name}</p>
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