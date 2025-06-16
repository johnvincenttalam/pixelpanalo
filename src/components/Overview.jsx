

const Overview = ({ totalPixels, totalAmount }) => {
  return (
    <section>
      <div className="flex flex-col p-4 bg-[#302D42] rounded font-inter mb-4">
        <div className="flex justify-between mb-2">
          <p className="text-sm md:text-sm">Total Pixels:</p>
          <p className="text-sm md:text-sm text-[#f2bc57] font-bold">{totalPixels}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm md:text-sm">Total Amount:</p>
          <p className="text-sm md:text-sm text-[#f2bc57] font-bold">P{totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </section>
  );
};

export default Overview;
