import Logo from "../components/Logo";
import { useNavigate, useLocation } from "react-router-dom";
import Back from "../components/Back";
import Confirmation from "../components/ConfirmationPopup";
import { useState } from "react";
import Overview from "../components/Overview";

const Form = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleBackClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    navigate(-1); // go back
  };

  const location = useLocation();
  const {
    selectedTickets = [],
    totalPixels = 0,
    totalAmount = 0,
  } = location.state || {};

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
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

  const isFormValid = formData.name && formData.phone && formData.email;

  return (
    <>
      <Back onClick={handleBackClick} />

      <Confirmation
        isOpen={showConfirm}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirm(false)}
      />

      <section className="w-full max-w-[600px] mx-auto py-6 px-4">
        <div className="mb-6">
          <Logo />
          <p className="text-center text-sm lg:text-lg">
            Pick Your Lucky Pixel and Win
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <h1 className="text-center text-[#f2bc57] text-sm mb-6">
            Fill Your Information
          </h1>
          <div className="text-center mb-2">
            <p className="text-sm font-semibold font-inter mb-2">Full Name</p>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Enter Full Name"
            />
          </div>
          <div className="text-center mb-2">
            <p className="text-sm font-semibold font-inter mb-2">Phone #</p>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="Enter Phone #"
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
          <div className="border-b border-neutral-700/80 my-8"></div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center justify-center gap-2 mb-6">
              <p className="text-sm">Selected Pixels</p>
              <div className="card">
                <p className="text-[#1B1926] text-sm text-center font-bold font-inter">
                  {selectedTickets.join(", ")}
                </p>
              </div>
            </div>
            <div>
              <Overview totalPixels={totalPixels} totalAmount={totalAmount} />
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-2 px-4 rounded-md transition ${
                  isFormValid ? "btn-primary" : "btn-disabled"
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Form;
