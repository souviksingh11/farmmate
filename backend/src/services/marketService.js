import api from './authService';

export async function getMarketPrices(filters) {
  const { data } = await api.get('/market/prices', {
    params: filters,
  });

  return data.records || [];
}

export function buildLast30DaysSeries(records) {
  if (!records.length) return [];

  return records
    .map((r) => ({
      day: r.arrival_date,
      price: Number(r.modal_price),
    }))
    .filter((r) => r.price)
    .slice(0, 30)
    .reverse();
}
