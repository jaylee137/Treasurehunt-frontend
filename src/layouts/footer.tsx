// import { FaTwitter } from "react-icons/fa";
// import { BsDiscord } from "react-icons/bs";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="flex justify-between pt-1 gap-2">
        <img
          src="/img/footer.png"
          alt="footer"
          className="w-14 object-contain"
        />
        <div className="flex gap-2 items-center">
          <a
            href="/privacy-policy"
            className="hover:text-pink-400 transition text-[9px] whitespace-nowrap"
          >
            Pixel Pirates
          </a>
          <a
            href="/privacy-policy"
            className="hover:text-pink-400 transition text-[9px] whitespace-nowrap"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="hover:text-pink-400 transition text-[9px] whitespace-nowrap"
          >
            Terms of Service
          </a>
        </div>
        <div className="flex gap-1">
          <a href="https://x.com/PixelPiratesNFT" className="flex justify-center items-center">
            <img
              src="/img/xicon.png"
              alt="icon"
              className="w-4 object-contain"
            />
          </a>
          <a href="https://discord.gg/SeqAhs2f" className="flex justify-center items-center">
            <img
              src="/img/discordicon.png"
              alt="icon"
              className="w-4 object-contain"
            />
          </a>
        </div>
        <img
          src="/img/compass.png"
          alt="compass"
          className="w-8 object-contain"
        />
      </div>
      <img
        src="/img/PLS_Full_Logo.png"
        alt="logo"
        className="w-40 mx-auto mb-3"
      />
    </footer>
  );
};

export default Footer;
