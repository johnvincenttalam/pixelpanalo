import Back from "../components/Back";
import NavBar from "../components/NavBar";
import Logo from "../components/Logo";

const HowToPlay = () => {
  return (
    <>
      <NavBar />
      <section className="w-full max-w-[600px] mx-auto py-6 px-4">
        <div className="mb-8 flex flex-col items-center">
            <h1 className="text-xl font-bold text-center">
                How to Play
            </h1>
            <Logo />
        </div>

        <section className="mb-6">
          <h2 className="text-md font-semibold mb-2 text-[#f2bc57]">
            Objective
          </h2>
          <p className="text-xs">
            PixelPanalo is a fun and exciting raffle game where players select a
            pixel from an image. Each pixel has a unique number or value. During
            the draw event, lucky players with selected winning pixels will win
            amazing prizes!
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-md font-semibold mb-2 text-[#f2bc57]">
            How to Play
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-xs">
            <li>Browse the image displayed on the PixelPanalo game page.</li>
            <li>
              Select any pixel you like — every pixel is numbered and unique!
            </li>
            <li>
              Confirm your selection and complete your entry (some games may
              require credits or payment).
            </li>
            <li>
              Wait for the scheduled draw to see if your pixel is one of the
              lucky winners.
            </li>
          </ol>
        </section>

        <section className="mb-6">
          <h2 className="text-md font-semibold mb-2 text-[#f2bc57]">
            Winning and Prizes
          </h2>
          <p className="text-xs">
            During the draw event, a random pixel or a set of lucky pixels will
            be selected. If the pixel you picked matches any of the drawn
            winning pixels, you win a prize! Prizes vary from gadgets, cash,
            coupons, and more.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-md font-semibold mb-2 text-[#f2bc57]">
            Draw Events
          </h2>
          <p className="text-xs">
            Each raffle has its own draw schedule. Make sure to check the
            countdown or event date on the game page. Winners will be announced
            right after the draw ends.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-md font-semibold mb-2 text-[#f2bc57]">Tips</h2>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>Pick multiple pixels to increase your chances of winning.</li>
            <li>Stay updated with draw announcements and result postings.</li>
            <li>
              Some raffles might offer bonus or free pixel entries, don’t miss
              them!
            </li>
          </ul>
        </section>

        <div className="text-center text-sm mt-10 font-medium text-[#008CFF]">
          Good luck and have fun playing PixelPanalo
        </div>
      </section>
    </>
  );
};

export default HowToPlay;
