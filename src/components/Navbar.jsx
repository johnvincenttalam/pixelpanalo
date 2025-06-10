import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "../constants";

const NavBar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  return (
    <nav className="sticky top-0 z-50 py-3">
      <div className="w-full max-w-7xl px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex justify-center items-center">
            <button onClick={toggleNavbar} className="p-2 bg-[#1B1926] rounded-md shadow">
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Overlay */}
        {mobileDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleNavbar}
          />
        )}

        {/* Slide-in Sidebar */}
        <div
          className={`fixed top-0 left-0 z-50 h-full w-3/4 max-w-xs bg-[#1B1926] transform transition-transform duration-300 ease-in-out ${
            mobileDrawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full justify-between p-5">
            <div className="flex flex-col">
              <button className="mb-6 ml-auto" onClick={toggleNavbar}>
                <X />
              </button>
              <ul>
                {navItems.map((item, index) => (
                  <li key={index} className="py-4">
                    <a href={item.href} onClick={toggleNavbar}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
