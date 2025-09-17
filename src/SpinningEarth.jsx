import React from "react";
import { FaPlane } from "react-icons/fa";
import "./SpinningEarth.css";

export default function SpinningEarth() {
  const stars = Array.from({ length: 8 });
  const airplanes = Array.from({ length: 3 });

  return (
    <div className="earth-wrapper" aria-hidden="true">
      <div className="earth" />

      {stars.map((_, i) => (
        <div
          key={i}
          className="orbit star-orbit"
          style={{
            width: 70 + i * 12 + "px",
            height: 70 + i * 12 + "px",
            animationDuration: 14 + i * 1.5 + "s",
            animationDelay: `${i * 0.2}s`,
          }}
        >
          <div className="star" />
        </div>
      ))}

      {airplanes.map((_, i) => {
        const dur = 10 + i * 3;
        return (
          <div
            key={i}
            className="orbit plane-orbit"
            style={{
              width: 92 + i * 28 + "px",
              height: 92 + i * 28 + "px",
              animationDuration: dur + "s",
              animationDelay: `${i * 0.6}s`,
            }}
          >
            <FaPlane
              className="plane-icon"
              style={{
                animation: `counter-rotate ${dur}s linear infinite`,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}