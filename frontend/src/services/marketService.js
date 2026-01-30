import api from './authService';

export async function getMarketPrices({ commodity, state, district }) {
  const params = {};

  if (commodity) params.commodity = commodity.trim();
  if (state) params.state = state.trim();
  if (district) params.district = district.trim();

  const res = await api.get('/market/prices', { params });

  return res.data?.prices || [];
}



export function buildLast30DaysSeries(records) {
  if (!Array.isArray(records) || records.length === 0) return [];

  const map = {};

  records.forEach((r) => {
    const rawDate = r.arrival_date; // "15/12/2025"
    const price = Number(r.modal_price);

    if (!rawDate || !price) return;

    // Convert DD/MM/YYYY → YYYY-MM-DD
    const [dd, mm, yyyy] = rawDate.split('/');
    const isoDate = `${yyyy}-${mm}-${dd}`;

    if (!map[isoDate]) {
      map[isoDate] = { day: isoDate, sum: 0, count: 0 };
    }

    map[isoDate].sum += price;
    map[isoDate].count += 1;
  });

  return Object.values(map)
    .map((x) => ({
      day: x.day,
      price: Math.round(x.sum / x.count),
    }))
    .sort((a, b) => new Date(a.day) - new Date(b.day))
    .slice(-30);
}



export function naiveForecast(series, days = 30) {
  if (!series.length) return [];

  const base = series[series.length - 1].price;
  const result = [];

  for (let i = 1; i <= days; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    result.push({
      day: d.toISOString().slice(0, 10),
      price: Math.round(base + (Math.random() - 0.5) * 0.05 * base),
    });
  }

  return result;
}
