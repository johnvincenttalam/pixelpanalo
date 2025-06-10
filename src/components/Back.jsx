import { Menu, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Back = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 py-3">
      <div className="w-full max-w-7xl px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            <button onClick={() => navigate(-1)} className="p-2 bg-[#1B1926] rounded-md shadow">
              <ArrowLeft />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Back;
