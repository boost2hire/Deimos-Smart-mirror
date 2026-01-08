import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GallerySession from "./pages/GallerySession"; // ✅ ADD THIS
import LoginPage from "./pages/LoginPage";
import LinkedPage from "./pages/LinkedPage";
import MirrorHome from "./MirrorHome";
import DeviceLoginQR from "./components/DeviceLoginQR";
import DeviceLogin from "./pages/DeviceLogin";
import DeviceLoginCallback from "./pages/DeviceLoginCallback";


const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
              <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<MirrorHome />} /> */}

            {/* 📱 Phone gallery (QR scan target) */}
            {/* <Route path="/gallery/view/:sessionId" element={<GallerySession />} /> */}
                {/* <Route path="/login" element={<LoginPage />} />
                <Route path="/linked" element={<LinkedPage />} />
                <Route path="/mirror" element={<Index />} />
               <Route path="*" element={<NotFound />} /> */}

               
             {/* MIRROR */}
            <Route path="/" element={<DeviceLoginQR />} />
            <Route path="/mirror" element={<Index />} />

            {/* PHONE LOGIN */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/linked" element={<LinkedPage />} />
             <Route path="/device-login" element={<DeviceLogin />} />
             <Route path="/device-login/callback" element={<DeviceLoginCallback />} />

              <Route path="*" element={<NotFound />} />


          </Routes>
        </BrowserRouter>

      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
