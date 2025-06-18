import { Home, Search, Phone, FileQuestion } from "lucide-react";

export const navItems = [
  { label: "Home", href: "/", icon: <Home className="w-5 h-5" /> },
  { label: "Search", href: "/search", icon: <Search className="w-5 h-5"/> },
  { label: "How to Play", href: "/how-to-play", icon: <FileQuestion className="w-5 h-5"/> },
  { label: "Contact Us", href: "/contact-us", icon: <Phone className="w-5 h-5"/> },
];

export const soldPixels = [
  {
    pixelNumber: 2325,
    drawDate: "May 30, 2025",
    email: "test@example.com",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    pixelNumber: 236,
    drawDate: "May 30, 2025",
    email: "test@example.com",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    pixelNumber: 2327,
    drawDate: "May 30, 2025",
    email: "test@example.com",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    pixelNumber: 4563,
    drawDate: "June 10, 2025",
    email: "johndoe@gmail.com",
    owner: "9878sas80as8a0sxdadade567890abcdef12345678",
  },
];

export const startPopup = {
  grandPrizeBrand: "Louis Vuitton",
  grandPrizeName: "Liv Pochette",
  grandPrizeWorth: "100,000.00",
  price: "60",
  drawDate: "June 30, 2025 7:00PM",
  otherPrizeTitle: "10 Lucky Players to Win P5,000 Cash",
};
