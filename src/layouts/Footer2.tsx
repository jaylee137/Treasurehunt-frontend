import React from "react";

const Footer2: React.FC = () => {
  return (
    <footer className="flex flex-col w-full">
      <div className="flex justify-between px-4 ">
        <img src="/img/footer.png" alt="footer" className="w-14 object-contain"/>
        <img src="/img/compass.png" alt="compass" className="w-8 object-contain" />
      </div>
    </footer>
  );
};

export default Footer2;
