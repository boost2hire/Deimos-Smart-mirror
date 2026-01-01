import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_PUBLIC_URL } from "@/config";

export default function PhotoQR({ url }: { url: string | null }) {
  if (!url) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="bg-black/80 p-6 rounded-2xl text-center shadow-2xl w-[360px]">
          <div className="text-white mb-4 text-lg font-medium">
            Scan to view & download photos
          </div>

          <div className="flex justify-center">
            <QRCode
              value={`${BACKEND_PUBLIC_URL}`}
              bgColor="#000000"
              fgColor="#ffffff"
              size={220}
            />
          </div>

          <div className="text-sm text-gray-400 mt-4">
            Opens on your phone
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
