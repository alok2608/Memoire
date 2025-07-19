const axios = require('axios');
const cheerio = require('cheerio');

const fetchTitle = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    return $('title').text() || "Untitled";
  } catch {
    return "Untitled";
  }
};

module.exports = fetchTitle;
