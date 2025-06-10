import Back from "../components/Back";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { soldPixels } from "../constants";
// import { Search } from "lucide-react";
import { Search } from "lucide-react"; // or replace with any icon

const PixelSearch = () => {
  const [formData, setFormData] = useState({ email: "" });
  const [purchasedPixels, setPurchasedPixels] = useState([]);
  const [allPixels, setAllPixels] = useState([
    // Example dataset
    { email: "test@example.com", pixelNumber: 101, drawDate: "2025-06-01" },
    { email: "user@example.com", pixelNumber: 102, drawDate: "2025-06-05" },
    { email: "test@example.com", pixelNumber: 103, drawDate: "2025-06-10" },
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const results = soldPixels.filter(
      (pixel) => pixel.email.toLowerCase() === formData.email.toLowerCase()
    );
    setPurchasedPixels(results);
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
            <button type="submit" className="btn-primary !w-fit">
              <Search />
            </button>
          </div>
        </form>

        <div className="flex flex-col gap-2 mt-6">
          {purchasedPixels.length > 0 ? (
            purchasedPixels.map((pixel, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-slate-500 rounded-md"
              >
                <p className="text-md">
                  Pixel#{" "}
                  <span className="text-[#f2bc57]">{pixel.pixelNumber}</span>
                </p>
                <div className="flex flex-col">
                  <p className="text-[10px] text-slate-500">Draw Date</p>
                  <p className="text-[10px]">{pixel.drawDate}</p>
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
