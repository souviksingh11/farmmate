import { useEffect, useRef } from 'react';

export default function WeatherMap({ lat, lon }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!lat || !lon) return;
    const iframe = document.createElement('iframe');
    const url = `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&zoom=7&level=surface&overlay=rain&menu=&message=true&type=map&location=coordinates&detail=true&metricWind=km%2Fh&metricTemp=%C2%B0C`;
    iframe.src = url;
    iframe.width = '100%';
    iframe.height = '360';
    iframe.frameBorder = '0';
    iframe.loading = 'lazy';
    ref.current.innerHTML = '';
    ref.current.appendChild(iframe);
  }, [lat, lon]);
  return (
    <div className="card border-0 shadow-sm mt-3">
      <div className="card-body">
        <h5 className="mb-2">Live Radar & Weather Stations</h5>
        <div ref={ref} />
      </div>
    </div>
  );
}


