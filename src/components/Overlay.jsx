import React from "react";

const Overlay = () => {
  return (
    <div
      className={`fixed w-100 h-screen flex justify-center items-center`}
      style={{ backgroundColor: "rgba(0,0,0,0.7)", zIndex: 9999 }}
    >
      <div className="text-center text-white">
        <div className="spinner-border text-light mb-3" role="status"></div>
        <h5 className="font-weight-bold">يرجى الانتظار</h5>
        <p>انتظر حتى تتم معالجة طلبك</p>
      </div>
    </div>
  );
};

export default Overlay;
