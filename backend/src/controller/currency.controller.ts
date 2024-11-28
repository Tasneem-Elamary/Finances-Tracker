
import axios from 'axios'

const OPEN_EXCHANGE_RATES_API = 'https://openexchangerates.org/api/latest.json';
const APP_ID = '7500c2caf2764c91bab321a356704bbd'; // Replace with your API key.

export const getCurrencyConversionRate = async (fromCurrency :string, toCurrency:string) => {
  if (fromCurrency === toCurrency) return 1;

  try {
    const response = await axios.get(OPEN_EXCHANGE_RATES_API, {
      params: { app_id: APP_ID },
    });

    const rates = response.data.rates;
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];

    if (!fromRate || !toRate) {
      throw new Error('Currency rate not found');
    }

    return toRate / fromRate;
  } catch (error:any) {
    console.error('Error fetching currency conversion rate:', error.message);
    throw new Error('Failed to fetch currency conversion rate');
  }
};