import axios from 'axios';

export async function getMarketPrices(req, res) {
  try {
    const { commodity, state, district } = req.query;

    if (!commodity || !state) {
      return res.status(400).json({
        message: 'Commodity and State are required',
      });
    }

    if (!process.env.DATA_GOV_API_KEY) {
      return res.status(500).json({
        message: 'Market API not configured (missing API key)',
      });
    }

    const params = {
      'api-key': process.env.DATA_GOV_API_KEY,
      format: 'json',
      limit: 50,
      'filters[commodity]': commodity,
      'filters[state]': state,
    };

    if (district) {
      params['filters[district]'] = district;
    }

    console.log('Calling data.gov.in with params:', params);

    const response = await axios.get(
      'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070',
      { params }
    );

    return res.json({
      prices: response.data.records || [],
    });

  } catch (error) {
    console.error(
      'Market API FAILED:',
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: 'Failed to fetch market prices',
    });
  }
}
