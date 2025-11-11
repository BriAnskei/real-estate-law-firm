export default function GridShape() {
  return (
    <>
      {/* Top Right Grid */}
      <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px] opacity-30">
        <svg
          width="450"
          height="450"
          viewBox="0 0 450 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="xMaxYMin meet"
        >
          <defs>
            <pattern
              id="grid-top"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 0 L 50 0 M 0 0 L 0 50"
                stroke="#D4AF37"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
            <linearGradient id="fade-top" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="450" height="450" fill="url(#grid-top)" />
          <rect width="450" height="450" fill="url(#fade-top)" />
        </svg>
      </div>

      {/* Bottom Left Grid */}
      <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] xl:max-w-[450px] rotate-180 opacity-30">
        <svg
          width="450"
          height="450"
          viewBox="0 0 450 450"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="xMaxYMin meet"
        >
          <defs>
            <pattern
              id="grid-bottom"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 0 0 L 50 0 M 0 0 L 0 50"
                stroke="#D4AF37"
                strokeWidth="0.5"
                fill="none"
              />
            </pattern>
            <linearGradient
              id="fade-bottom"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="50%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="1" />
            </linearGradient>
          </defs>
          <rect width="450" height="450" fill="url(#grid-bottom)" />
          <rect width="450" height="450" fill="url(#fade-bottom)" />
        </svg>
      </div>
    </>
  );
}
