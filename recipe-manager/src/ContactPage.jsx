import React, { useState } from 'react';
import { sendMessage } from '../services/api';

const ContactPage = () => {
  const [form, setForm] = useState({ subject: '', email: '', content: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(form)
      .then(() => alert('Message sent successfully!'))
      .catch((error) => console.error('Error sending message:', error));
  };

  return (
    <div className="container">
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <textarea
          placeholder="Message"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ContactPage;
