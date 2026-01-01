
import { motion, AnimatePresence } from "framer-motion";

export default function AlarmOverlay({ active }: { active: boolean }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center"
            initial={{ scale: 0.8 }}
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, -1, 1, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
            }}
          >
            <div className="text-6xl mb-4">⏰</div>
            <div className="text-3xl font-semibold text-white">
              Alarm Ringing
            </div>
            <div className="text-sm text-white/60 mt-2">
              Say “Stop alarm”
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
