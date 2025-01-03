import React, { useState } from 'react';
import { sendMessage } from '../api';

const ContactPage = () => {
  const [form, setForm] = useState({ subject: '', email: '', content: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage(form);
      alert('Message sent successfully!');
      setForm({ subject: '', email: '', content: '' }); // Clear form after successful submission
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
    </div>
  );
};

export default ContactPage;
