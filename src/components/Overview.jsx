

const Overview = ({ totalPixels, totalAmount }) => {
  return (
    <section>
      <div className="flex flex-col p-4 bg-[#302D42] rounded mb-4">
        <div className="flex justify-between mb-2">
          <p className="text-xs md:text-sm">Total Pixels:</p>
          <p className="text-xs md:text-sm text-[#f2bc57]">{totalPixels}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-xs md:text-sm">Total Amount:</p>
          <p className="text-xs md:text-sm text-[#f2bc57]">P{totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
};

export default Overview;
