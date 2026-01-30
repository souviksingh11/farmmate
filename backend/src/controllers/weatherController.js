export async function getWeather(req, res, next) {
  try {
    // Placeholder: integrate real weather API later
    res.json({ tempC: 28, rainfallMm: 2, condition: 'Partly Cloudy' });
  } catch (err) {
    next(err);
  }
}


