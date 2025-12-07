import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const boxWidth = 33; // px
const animationDuration = 15; // seconds
const animationStepDuration = animationDuration / 7;

const Preloader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#d4a3f3] via-[#b5d6f5] to-[#e8c9f7]"
          aria-label="Loading"
        >
          {/* SVG spinner container */}
          <div className="flex flex-col items-center space-y-4">
            <svg
              id="loading"
              viewBox="0 0 100 80"
              style={{
                display: "block",
                margin: "auto",
                width: "20rem",
                height: "auto",
                transform: "rotate(90deg)",
              }}
              aria-hidden="true"
            >
              <defs>
                <linearGradient
                  id="gradient"
                  x1="100%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="#4383b8"
                    style={{
                      animation: `gradient1 ${animationDuration}s ease infinite`,
                    }}
                  />
                  <stop
                    offset="100%"
                    stopColor="#4aa06c"
                    style={{
                      animation: `gradient2 ${animationDuration}s ease infinite`,
                    }}
                  />
                </linearGradient>

                <clipPath id="rects">
                  {[...Array(7)].map((_, i) => (
                    <rect
                      key={`rect${i + 1}`}
                      className="rect"
                      id={`rect${i + 1}`}
                      x="0"
                      y="0"
                      width="30"
                      height="30"
                      rx="2"
                      ry="2"
                      style={{
                        animation: `slide ${animationDuration}s ease infinite`,
                        animationDelay: `-${i * animationStepDuration}s`,
                        transformOrigin: "0 0",
                      }}
                    />
                  ))}
                </clipPath>
              </defs>

              <rect
                id="container"
                transform="translate(50) scale(0.707, 0.707) rotate(45)"
                x="0"
                y="0"
                width="100"
                height="100"
                fill="url(#gradient)"
                clipPath="url(#rects)"
              />
            </svg>
            <p className="text-center text-[#5B2D88] font-semibold text-xl mt-18 animate-pulse">
              Loading SocialSight...
            </p>
          </div>

          {/* CSS styles injected inline */}
          <style>{`
            @keyframes slide {
              0% {
                transform: translate(0, 0);
              }
              2% {
                transform: translate(${boxWidth}px, 0);
              }
              12.5% {
                transform: translate(${boxWidth}px, 0);
              }
              15.5% {
                transform: translate(${boxWidth * 2}px, 0);
              }
              25% {
                transform: translate(${boxWidth * 2}px, 0);
              }
              27% {
                transform: translate(${boxWidth * 2}px, ${boxWidth}px);
              }
              37.5% {
                transform: translate(${boxWidth * 2}px, ${boxWidth}px);
              }
              39.5% {
                transform: translate(${boxWidth}px, ${boxWidth}px);
              }
              50% {
                transform: translate(${boxWidth}px, ${boxWidth}px);
              }
              52% {
                transform: translate(${boxWidth}px, ${boxWidth * 2}px);
              }
              62.5% {
                transform: translate(${boxWidth}px, ${boxWidth * 2}px);
              }
              64.5% {
                transform: translate(0, ${boxWidth * 2}px);
              }
              75% {
                transform: translate(0, ${boxWidth * 2}px);
              }
              77% {
                transform: translate(0, ${boxWidth}px);
              }
              87.5% {
                transform: translate(0, ${boxWidth}px);
              }
              89.5% {
                transform: translate(0, 0);
              }
              100% {
                transform: translate(0, 0);
              }
            }

            @keyframes gradient1 {
              0% {
                stop-color: #4383b8;
              }
              50% {
                stop-color: #8013b9;
              }
              100% {
                stop-color: #4383b8;
              }
            }

            @keyframes gradient2 {
              0% {
                stop-color: #4aa06c;
              }
              50% {
                stop-color: #b22358;
              }
              100% {
                stop-color: #4aa06c;
              }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
