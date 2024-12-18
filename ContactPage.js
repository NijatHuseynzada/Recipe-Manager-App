import React from 'react';
import Header from '../components/Header';
import ContactForm from '../components/ContactForm';
import { sendMessage } from '../services/api';

const ContactPage = () => {
  const handleSubmit = async (data) => {
    await sendMessage(data);
    alert('Message sent!');
  };

  return (
    <>
      <Header />
      <ContactForm onSubmit={handleSubmit} />
    </>
  );
};

export default ContactPage;
