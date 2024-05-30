import { useEffect } from 'react';

const HoroscopeWidget = () => {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.src = 'https://widget.horoscopovirtual.com.br/js/horoscopo.js?background=ffffff&color=585ca9&border=ffffff&text=585ca9&font=roboto';
    script.async = true;

    // Append the script to the container
    document.getElementById('horoscope-widget-container').appendChild(script);



  }, []);

  return (
    <div className="horoscope-widget bg-white p-4 border border-gray-200 shadow-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Horóscopo do dia</h2>
      <div id="horoscope-widget-container"></div>
    </div>
  );
};

export default HoroscopeWidget;
