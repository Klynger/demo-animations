import React, { useState, useEffect, useCallback } from 'react';

interface Props {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler;
}

export default function Button(props: Props) {
  const { children, onClick } = props;
  const [coords, setCoords] = useState({ x: -1, y: -1 });
  const [rippling, setRippling] = useState(false);

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setRippling(true);
      setTimeout(() => setRippling(false), 1200);
    } else {
      setRippling(false);
    }
  }, [coords]);

  useEffect(() => {
    if (!rippling) {
      setCoords({ x: -1, y: -1 });
    }
  }, [rippling]);

  const handleClick: React.MouseEventHandler = useCallback(e => {
    const rect = (e.target as any).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCoords({ x, y });
    if (onClick) {
      onClick(e);
    }
  }, [onClick]);

  const rippleStyle = {
    left: coords.x,
    top: coords.y,
  };

  return (
    <button className="button" onClick={handleClick}>
      <span className="button-content">{children}</span>
      {rippling && <span className="ripple" style={rippleStyle} />}
    </button>
  );
}
