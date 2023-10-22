import { useRef, useState } from 'react';
import './CatButton.css'; // Create a CSS file for styling

export function CatButton({ disabled, onClick, children }) {
  const [catPosition, setCatPosition] = useState({ top: 0, left: 0 });
  const [catEyePosition, setCatEyePosition] = useState(0);
  const catRef = useRef(null);
  const headRef = useRef(null);

  function handleMouseMove(e) {
    if (catRef.current) {
      const buttonRect = catRef.current.getBoundingClientRect();
      const x = e.clientX - buttonRect.left;
      const y = e.clientY - buttonRect.top;
      setCatPosition({ top: y, left: x });
    }
    if (headRef.current) {
      // if (catEye.current && disabled) {
      const eye = headRef.current.getBoundingClientRect();
      // const x = e.width - eye.left;
      const x = eye.left + eye.width / 2;
      const y = eye.top + eye.height / 2;
      const rad = Math.atan2(e.pageX - x, e.pageY - y);
      const rot = rad * (180 / Math.PI) * -1 + 180;
      setCatEyePosition(rot);
    }
  }

  function handleMouseLeave() {
    setCatPosition({ top: 0, left: 0 });
    setCatEyePosition(0);
  }

  return (
    <div ref={catRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <button className="cat-button" onClick={onClick} disabled={disabled}>
        {children}
        <div
          className="cat-hand"
          style={{
            top: catPosition.top + 'px',
            left: catPosition.left + 'px',
          }}
        />
        <div
          ref={headRef}
          className="cat-eye"
          style={{
            // top: catEyePosition.top + 'px',
            // left: catEyePosition.left + 'px',
            transform: 'rotate(' + catEyePosition + 'deg)',
          }}
        />
      </button>
    </div>
  );
}
