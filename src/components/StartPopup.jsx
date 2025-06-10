import { useEffect, useState } from "react";
import Logo from "../components/Logo";
import { X } from "lucide-react";
import GrandPrize from "../assets/grandprize.png";

const StartPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    // Delay content appearance slightly for smoother transition
    setTimeout(() => setShowContent(true), 10);
  }, []);

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
    // Wait for animation before hiding modal
    setTimeout(() => setIsOpen(false), 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div
        className={`bg-white text-[#1B1926] w-full max-w-lg mx-4 md:mx-auto rounded-lg px-4 py-4 shadow-lg text-center transform transition-all duration-300 ${
          showContent ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="max-h-[90vh] overflow-y-auto">
          {/* <div className="fixed top-3 right-3 flex justify-end">
            <X />
          </div> */}
          <h2 className="text-xs font-semibold">Welcome to</h2>
          <Logo className="mx-auto mb-4" />
          <p className="text-xs mb-4">
            Be the one of the lucky players to win these exciting prizes!
          </p>
          <h5 className="text-[#F2BC57] text-lg">Grand Prize</h5>
          <img
            src={GrandPrize}
            className="w-100 h-auto mb-4"
            alt="Grand Prize"
          />
          <div className="mb-4">
            <p className="text-xs">Louis Vuitton</p>
            <p className="font-bold text-lg text-[#F28557]">Liv Pochette</p>
            <p className="text-xs text-slate-500">or</p>
            <p className="text-xs">Convert to Cash</p>
            <p className="text-xs text-slate-700">Worth (P100,000.00)</p>
          </div>
          <div className="p-3 rounded bg-[#231933] text-[#f2bc57] text-sm mb-4">
            10 Lucky Players to Win P5,000 Cash
          </div>
          <div className="mb-4">
            <p className="text-xs text-slate-500">For only</p>
            <p className="font-bold text-sm">P60.00 Per Pixel</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Draw Date</p>
            <p className="text-sm">June 30, 2025 7:00PM</p>
          </div>
        </div>
        <div className="">
          <button onClick={closeModal} className="btn-primary mt-4 w-full">
            Let's Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartPopup;
