import React, { ChangeEvent, FormEvent, useState } from 'react';
import emailjs from '@emailjs/browser';
import aboutus from '../../assets/images/aboutus.png';
import Footer from '../../components/user/Footer/Footer';
import Navbar from '../../components/user/Navbar/Navbar';

interface FormData {
  name: string;
  mobilenumber: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  mobilenumber?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    mobilenumber: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [msg, setMsg] = useState<string>(''); 
  const [msgType, setMsgType] = useState<'success' | 'error' | ''>(''); // State to hold message type
  const [isLoading, setIsLoading] = useState<boolean>(false); // State to handle loading indicator

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const validateForm = (): boolean => {
    const { name, mobilenumber, email, subject, message } = formData;
    let formErrors: FormErrors = {};
    let isValid = true;

    if (!name.trim()) {
      isValid = false;
      formErrors.name = 'Name must be filled out';
    } else if (!/^[a-zA-Z.\s]+$/.test(name)) {
      isValid = false;
      formErrors.name = 'Name must contain only alphabets and dot';
    }

    if (!mobilenumber.trim()) {
      isValid = false;
      formErrors.mobilenumber = 'Mobile Number must be filled out';
    } else if (isNaN(Number(mobilenumber))) {
      isValid = false;
      formErrors.mobilenumber = 'Mobile Number must be Digits';
    } else if (mobilenumber.length !== 10) {
      isValid = false;
      formErrors.mobilenumber = 'Mobile Number must have exactly 10 digits';
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email.trim())) {
      isValid = false;
      formErrors.email = 'Email must be a valid email address';
    }

    if (!subject.trim()) {
      isValid = false;
      formErrors.subject = 'Subject must be filled out';
    }

    if (!message.trim()) {
      isValid = false;
      formErrors.message = 'Message must be filled out';
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true); 
      const serviceId = 'service_du0rege'; 
      const templateId = 'template_920mifg'; 
      const publicKey = '31yLImajK30M6Zkt6'; 

      const { name, email, mobilenumber, subject, message } = formData;

      const templateParams = {
        name: name,
        email: email,
        mobilenumber: mobilenumber,
        subject: subject,
        message: message,
      };

      emailjs.send(serviceId, templateId, templateParams, publicKey)
        .then(() => {
          setMsgType('success');
          setMsg('Message sent successfully!');
          
          setFormData({
            name: '',
            mobilenumber: '',
            email: '',
            subject: '',
            message: '',
          });
          setErrors({});
          setTimeout(() => {
            setMsg('');
            setMsgType('');
            
          }, 3000); 
          setIsLoading(false); 
        })
        .catch((error) => {
          console.error('Error sending email:', error);
          setMsgType('error');
          setMsg('Failed to send message. Please try again.');
          setTimeout(() => {
            setMsg('');
            setMsgType('');
            
          }, 3000); 
          setIsLoading(false); 
        });
    }
  };

  return (
    <section id="contact" className="py-8 bg-white flex justify-center items-center min-h-screen">
      <div className="w-full max-w-2xl p-8 bg-gray-100 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center mb-6">Contact Us</h2>
        <form id="form" method="post" role="form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              className={`form-control form-color w-full p-3 border border-gray-300 rounded-md ${errors.name && 'is-invalid'}`}
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <span className="text-red-500">{errors.name}</span>}
          </div>
          <div className="form-group">
            <input
              type="text"
              id="mobilenumber"
              className={`form-control form-color w-full p-3 border border-gray-300 rounded-md ${errors.mobilenumber && 'is-invalid'}`}
              placeholder="Mobile Number"
              value={formData.mobilenumber}
              onChange={handleInputChange}
            />
            {errors.mobilenumber && <span className="text-red-500">{errors.mobilenumber}</span>}
          </div>
          <div className="form-group">
            <input
              type="email"
              id="email"
              className={`form-control form-color w-full p-3 border border-gray-300 rounded-md ${errors.email && 'is-invalid'}`}
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="text-red-500">{errors.email}</span>}
          </div>
          <div className="form-group">
            <input
              type="text"
              id="subject"
              className={`form-control form-color w-full p-3 border border-gray-300 rounded-md ${errors.subject && 'is-invalid'}`}
              placeholder="Subject"
              value={formData.subject}
              onChange={handleInputChange}
            />
            {errors.subject && <span className="text-red-500">{errors.subject}</span>}
          </div>
          <div className="form-group">
            <textarea
              id="message"
              className={`form-control form-color w-full p-3 border border-gray-300 rounded-md ${errors.message && 'is-invalid'}`}
              rows={5}
              placeholder="Message"
              value={formData.message}
              onChange={handleInputChange}
            ></textarea>
            {errors.message && <span className="text-red-500">{errors.message}</span>}
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-600 text-white p-3 rounded-md"
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
          {msg && (
            <div className={`mt-4 text-center ${msgType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
              {msg}
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

const AboutPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <div className="relative w-full h-[70vh] bg-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-medium text-white mb-6">Contact QuickDoc</h1>
          <h2 className="text-2xl font-semibold text-white mb-8">
            Help us enable the best healthcare experience in India.
          </h2>
          <img src={aboutus} alt="Contact us" className="mx-auto h-56 w-auto" />
        </div>
      </div>
      <ContactSection />
      <Footer />
    </>
  );
};

export default AboutPage;
