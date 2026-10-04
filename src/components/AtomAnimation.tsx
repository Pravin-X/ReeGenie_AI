import { motion } from "framer-motion";

export function AtomAnimation() {
  return (
    <div className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center pointer-events-none">
      {/* Central Glowing Core */}
      <div className="absolute w-8 h-8 bg-white rounded-full shadow-[0_0_40px_10px_rgba(255,255,255,0.8),0_0_80px_20px_rgba(242,182,50,0.6)] z-10" />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-12 h-12 bg-gold/50 rounded-full blur-md z-10"
      />

      {/* Orbit 1 */}
      <motion.div
        className="absolute w-[200%] h-[200%] rounded-full border border-gold/20"
        style={{ rotateX: 75, rotateY: 15 }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        {/* Particles on Orbit 1 */}
        <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]" />
        <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-gold rounded-full shadow-[0_0_10px_rgba(242,182,50,1)]" />
      </motion.div>

      {/* Orbit 2 */}
      <motion.div
        className="absolute w-[200%] h-[200%] rounded-full border border-gold/15"
        style={{ rotateX: 75, rotateY: 75 }}
        animate={{ rotateZ: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        {/* Particles on Orbit 2 */}
        <div className="absolute top-1/2 right-0 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]" />
        <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-gold rounded-full shadow-[0_0_10px_rgba(242,182,50,1)]" />
      </motion.div>

      {/* Orbit 3 */}
      <motion.div
        className="absolute w-[200%] h-[200%] rounded-full border border-gold/20"
        style={{ rotateX: 75, rotateY: 135 }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        {/* Particles on Orbit 3 */}
        <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,1)]" />
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-gold-soft rounded-full shadow-[0_0_10px_rgba(252,211,77,1)]" />
      </motion.div>
      
      {/* Outer subtle glow sphere */}
      <div className="absolute w-[150%] h-[150%] rounded-full bg-gold/5 blur-3xl z-0" />
    </div>
  );
}
