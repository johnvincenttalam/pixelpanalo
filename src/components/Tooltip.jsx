
const Tooltip = ({ children, text }) => {
  return (
    <div className="relative flex items-center group font-inter">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:flex w-max max-w-xs bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-md z-10">
        {text}
      </div>
    </div>
  );
};

export default Tooltip;
