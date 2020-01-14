const cheerio = require('cheerio');
const requestPromise = require('request-promise');

(async () => {
    const username = 'willsmith';
    const URL = `https://www.instagram.com/${username}`;

    const response = await requestPromise(URL);
    const $ = cheerio.load(response);

    const followers = $('script[type="text/javascript"]').eq(3).html();
    console.log(followers)
})();


// post #
// followers #
// full name
// following #
// avatar url

