import Back from "../components/Back";
import NavBar from "../components/NavBar";
import Logo from "../components/Logo";
import { useState } from "react";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // You can add form validation or API submission here
  };
  return (
    <>
      <NavBar />
      <section className="w-full max-w-[600px] mx-auto py-6 px-4">
        <h1 className="text-xl font-bold mb-6 text-center">Contact Us</h1>

        <div className="mb-8 text-center font-inter">
          <p className="text-[#008CFF] font-bold text-md">Have questions, feedback, or need help?</p>
          <p className="text-sm">We’d love to hear from you!</p>
        </div>

        <div className="mb-8">
          <h2 className="text-md font-semibold mb-2 text-[#f2bc57]">
            Get in Touch
          </h2>
          <ul className="space-y-2 text-xs font-inter font-normal">
            <li>
              <strong>Email:</strong> support@pixelpanalo.com
            </li>
            <li>
              <strong>Phone:</strong> +63 912 345 6789
            </li>
            <li>
              <strong>Facebook:</strong>{" "}
              <a
                href="https://facebook.com/PixelPanalo"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                facebook.com/PixelPanalo
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-md font-semibold mb-4 text-[#f2bc57]">
            Send Us a Message
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center mb-2">
              <p className="text-sm font-semibold font-inter mb-2">Full Name</p>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter Name"
              />
            </div>
            <div className="text-center mb-2">
              <p className="text-sm font-semibold font-inter mb-2">Email</p>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter Email"
              />
            </div>
            <div className="text-center mb-2">
              <p className="text-sm font-semibold font-inter mb-2">Message</p>
              <textarea
                type="text"
                name="message"
                id="message"
                value={formData.message}
                onChange={handleChange}
                className="input"
                placeholder="Enter Message"
                rows="4"
              />
            </div>
            <button
              type="submit"
              className="btn-primary !w-full"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
