import { useEffect, useState } from 'react';
import axios from 'axios';

const FinancialWidget = () => {
  const [data, setData] = useState({
    ibovespa: null,
    usdBrl: null,
    eurBrl: null,
    btcUsd: null,
    ethUsd: null,
    sp500: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ibovespa, usdBrl, eurBrl, btcUsd, ethUsd, sp500] = await Promise.all([
          axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^BVSP&apikey=CFQKVBBG1GG3EHIA`),
          axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=BRL&apikey=CFQKVBBG1GG3EHIA`),
          axios.get(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=EUR&to_currency=BRL&apikey=CFQKVBBG1GG3EHIA`),
          axios.get(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=CFQKVBBG1GG3EHIA`),
          axios.get(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=ETH&market=USD&apikey=CFQKVBBG1GG3EHIA`),
          axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=^GSPC&apikey=CFQKVBBG1GG3EHIA`),
        ]);

        setData({
          ibovespa: ibovespa.data,
          usdBrl: usdBrl.data,
          eurBrl: eurBrl.data,
          btcUsd: btcUsd.data,
          ethUsd: ethUsd.data,
          sp500: sp500.data,
        });
      } catch (error) {
        console.error('Error fetching financial data', error);
      }
    };

    fetchData();
  }, []);

  if (!data.ibovespa || !data.usdBrl || !data.eurBrl || !data.btcUsd || !data.ethUsd || !data.sp500) {
    return <div>Loading...</div>;
  }

  return (
    <div className="financial-widget bg-white p-4 border border-gray-200 shadow-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Economia</h2>
      <div className="financial-item">
        <h3>Ibovespa</h3>
        <p>{/* Display Ibovespa data */}</p>
      </div>
      <div className="financial-item">
        <h3>USD/BRL</h3>
        <p>{/* Display USD/BRL data */}</p>
      </div>
      <div className="financial-item">
        <h3>EUR/BRL</h3>
        <p>{/* Display EUR/BRL data */}</p>
      </div>
      <div className="financial-item">
        <h3>BTC/USD</h3>
        <p>{/* Display BTC/USD data */}</p>
      </div>
      <div className="financial-item">
        <h3>ETH/USD</h3>
        <p>{/* Display ETH/USD data */}</p>
      </div>
      <div className="financial-item">
        <h3>S&P 500</h3>
        <p>{/* Display S&P 500 data */}</p>
      </div>
    </div>
  );
};

export default FinancialWidget;
