import { ImageResponse } from 'next/og';

export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', background: '#151e30', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f5f3ed', fontSize: 340, fontWeight: 800, letterSpacing: -24 }}>N</div>,
    { ...size }
  );
}
