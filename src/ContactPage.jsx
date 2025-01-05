import React, { useState, useEffect } from 'react';
import { sendMessage } from '../api';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

const ContactPage = () => {
  const [form, setForm] = useState({ subject: '', email: '', content: '' });
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]); 

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages`);
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
        alert('Failed to load sent messages.');
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (form.email) {
      const senderMessages = messages.filter(
        (message) => message.email === form.email
      );
      setFilteredMessages(senderMessages);
    } else {
      setFilteredMessages([]);
    }
  }, [form.email, messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendMessage(form);
      alert('Message sent successfully!');
      setForm({ subject: '', email: '', content: '' }); 

      setMessages((prevMessages) => [...prevMessages, response.data]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send the message. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            placeholder="Enter your subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Message</label>
          <textarea
            id="content"
            placeholder="Write your message here"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
          ></textarea>
        </div>

        <button type="submit" className="btn-submit">Send Message</button>
      </form>

      <h2 className="sent-messages-title">Your Sent Messages <br></br><h6> For seeing previous messages, please write your email!</h6></h2>
      <div className="sent-messages-thumbnails">
        {filteredMessages.length === 0 ? (
          <p>No messages sent yet.</p>
        ) : (
          filteredMessages.map((message) => (
            <div key={message.id} className="message-thumbnail">
              <h3>{message.subject}</h3>
              <p><strong>Email:</strong> {message.email}</p>
              <p><strong>Content:</strong> {message.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ContactPage;
