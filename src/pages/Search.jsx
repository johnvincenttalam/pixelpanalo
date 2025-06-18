import NavBar from "../components/NavBar";
import PixelPanaloLogoWhite from "../components/PixelPanaloLogoWhite";
import { useState } from "react";
import { soldPixels } from "../constants";
// import { Search } from "lucide-react";
import { Search, Loader2 } from "lucide-react"; // or replace with any icon

const PixelSearch = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [purchasedPixels, setPurchasedPixels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate async delay like fetching from API
    setTimeout(() => {
      const results = soldPixels.filter(
        (pixel) => pixel.email.toLowerCase() === formData.email.toLowerCase()
      );
      setPurchasedPixels(results);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
      <NavBar />
      <section className="w-full max-w-[600px] mx-auto py-6 px-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <h1 className="text-center text-[#f2bc57] text-sm mb-3">
            Search your Pixels
          </h1>
          <div className="flex gap-2 text-center mb-2">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="input"
              placeholder="Enter Email"
              required
            />
            <button
              type="submit"
              className="btn-primary !w-fit flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <Search />
              )}
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-2 mt-6">
          {isLoading ? (
            <p className="text-center text-sm text-slate-500 animate-pulse">
              Searching pixels...
            </p>
          ) : purchasedPixels.length > 0 ? (
            purchasedPixels.map((pixel, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-slate-500 rounded-md"
              >
                <div className="flex gap-2 items-center">
                  <div className="w-5 h-5">
                    <PixelPanaloLogoWhite />
                  </div>
                  <p className="text-sm">
                    Pixel#{" "}
                    <span className="text-[#f2bc57]">{pixel.pixelNumber}</span>
                  </p>
                </div>
                <div className="font-inter font-thin text-slate-300 ms-auto me-4">|</div>
                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-500 font-inter">
                    Draw Date
                  </p>
                  <p className="text-[10px] font-inter">{pixel.drawDate}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-slate-500">
              No pixels found.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default PixelSearch;
