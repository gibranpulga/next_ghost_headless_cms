import { useEffect } from 'react';

const TradingViewWidget = () => {
  useEffect(() => {
    // Create a script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "light",
      "dateRange": "12M",
      "showChart": false,  // Set to false to hide the chart
      "locale": "en",
      "width": "100%",
      "height": "100%",
      "largeChartUrl": "",
      "isTransparent": false,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
      "plotLineColorFalling": "rgba(41, 98, 255, 1)",
      "gridLineColor": "rgba(240, 243, 250, 0)",
      "scaleFontColor": "rgba(19, 23, 34, 1)",
      "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
      "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
      "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
      "tabs": [
        {
          "title": "Mercado",
          "symbols": [
            {
              "s": "FX_IDC:USDBRL",
              "d": "Dólar"
            },
            {
              "s": "FX_IDC:EURBRL",
              "d": "Euro"
            },
            {
              "s": "BMFBOVESPA:IBOV",
              "d": "BOVESPA"
            },
            {
              "s": "OKX:BTCBRL",
              "d": "Bitcoin"
            },
            {
              "s": "OKX:ETHBRL",
              "d": "Ethereum"
            }
          ],
          "originalTitle": "Indices"
        }
      ]
    });

    const container = document.getElementById('tradingview-widget-container');
    if (container) {
      container.appendChild(script);
    }


  }, []);

  return (
    <div className="tradingview-widget-container bg-white p-4 border border-gray-200 shadow-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Mercado</h2>
      <div id="tradingview-widget-container"></div>
    </div>
  );
};

export default TradingViewWidget;
