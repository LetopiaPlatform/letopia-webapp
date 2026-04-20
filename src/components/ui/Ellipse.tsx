export const Ellipse = ({
  size,
  initialX,
  initialY,
  animation,
}: {
  size: number;
  initialX: number;
  initialY: number;
  animation: string;
}) => (
  <div
    className="absolute rounded-full bg-linear-to-l from-[#814698] to-[#4C88C1] blur-2xl"
    style={{
      width: size,
      height: size,
      left: `${initialX}%`,
      top: `${initialY}%`,
      animation,
    }}
  />
);
