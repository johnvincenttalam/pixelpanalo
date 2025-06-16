import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import GrandPrize from "../assets/grandprize.png";
import { startPopup } from "../constants";

const StartPopup = ({ isOpen, onClose, autoShow = true }) => {
  // const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen && autoShow) {
      // Delay content appearance slightly for smoother transition
      setTimeout(() => setShowContent(true), 10);
    }
  }, [isOpen, autoShow]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const closeModal = () => {
    setShowContent(false);
    setTimeout(() => onClose(), 200); // Call parent-provided onClose
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center font-inter">
      <div
        className={`bg-white text-[#1B1926] w-full max-w-lg mx-4 md:mx-auto rounded-lg px-4 py-4 shadow-lg text-center transform transition-all duration-300 ${
          showContent ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="max-h-[90vh] overflow-y-auto">
          <h2 className="text-sm">Welcome to</h2>
          <Logo className="mx-auto mb-4" />
          <p className="text-sm mb-4">
            Be the one of the lucky players to win these exciting prizes!
          </p>
          <h5 className="text-[#F2BC57] text-lg font-monument">Grand Prize</h5>
          <img
            src={GrandPrize}
            className="w-100 h-auto mb-4"
            alt="Grand Prize"
          />
          <div className="mb-4">
            <p className="text-xs font-semibold">{startPopup.grandPrizeBrand}</p>
            <p className="font-bold text-lg text-[#F28557]">{startPopup.grandPrizeName}</p>
            <p className="text-xs text-slate-500">or</p>
            <p className="text-sm font-semibold">Convert to Cash</p>
            <p className="text-xs text-slate-700">Worth (P{startPopup.grandPrizeWorth})</p>
          </div>
          <div className="p-3 rounded bg-[#231933] text-[#f2bc57] text-sm font-bold mb-4">
            {startPopup.otherPrizeTitle}
          </div>
          <div className="mb-4">
            <p className="text-xs text-slate-500">For only</p>
            <p className="font-bold text-md">P{startPopup.price} Per Pixel</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Draw Date</p>
            <p className="text-sm font-semibold">{startPopup.drawDate}</p>
          </div>
        </div>
        <div className="">
          <button
            onClick={closeModal}
            className="btn-primary mt-4 w-full font-monument"
          >
            Let's Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPopup;
