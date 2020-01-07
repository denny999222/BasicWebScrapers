// this is an effective method to scrape a website is not rendered when the user enters the page
const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const { Parser } = require('json2csv');
const request = require('request');


const URLS = [
  { url: 'https://www.imdb.com/title/tt0102926/' },
  { url: 'https://www.imdb.com/title/tt4154796/' },
  { url: 'https://www.imdb.com/title/tt5052448/' }
];

//scraping
(async () => {
  let moviesData = [];
  for (let movie of URLS) {

    let options = {
      uri: movie.url,
      headers: {
        'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        'referer': "https://www.google.com/",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        // you can fake user agent, so you browser is unknown when doing the request
        "user-agent": "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1"
      },
      gzip: true
    }

    const response = await requestPromise(options);

    let $ = cheerio.load(response);
    let title = $('div[class="title_wrapper"] > h1').clone().children().remove().end().text().trim();
    let rating = $('span[itemprop="ratingValue"]').text();
    let popularity = $('span[class="subText"]').eq(2).text().replace(/(\r\n|\n|\r)/gm, "").trim();
    let img1 = $('div[class="poster"] > a > img').attr('src');
    let totalRating = $('span[class="small"]').text()
    // releaseDate and releaseDate 2 returns back the same information.. b/c they're just
    // different ways to select the same information
    let releaseDate = $('div[class="subtext"] > a').last().text().trim();
    let releaseDate2 = $('a[title="See more release dates"]').text().trim();

    // genreArr and genreArr2 return the same thing
    // genreArr goes inside div subtext and all the a tags EXCEPT the one with 
    // title "See more release dates" and turns it into array then maps it
    let genreArr = $('div[class="subtext"] > a').not('a[title="See more release dates"]').toArray().map(element => $(element).text());
    // genreArr 2 goes inside div subtext and searches for all a tags that start with 
    // href="/search/title>genres" (it uses the syntax ^=)
    let genreArr2 = $('div[class="subtext"] > a[href ^= "/search/title?genres"]').toArray().map(element => $(element).text());

    moviesData.push({
      title,
      rating,
      popularity,
      img1,
      totalRating,
      releaseDate,
      genres: genreArr
    });

    // this simply creates the jpg file path (doesnt actually download the image)
    let file = fs.createWriteStream(`./${title}_${releaseDate}.jpg`);
    let stream = request({
      uri: img1,
      headers: {
        'accept': "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "cache-control": "max-age=0",
        'referer': "https://www.google.com/",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        // you can fake user agent, so you browser is unknown when doing the request
        "user-agent": "Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1"
      },
      gzip: true
    }).pipe(file);
  }

  // this converts our array into a csv format
  // this is if you want specified fields, if you just want ALL fields then you simply remove
  // {fields} inside new Parser();
  let fields = ['title', 'rating', 'totalRating', 'releaseDate', 'genres'];
  const json2csvParser = new Parser();
  const csv = json2csvParser.parse(moviesData);

  // this saves our scraped information as json
  // fs.writeFileSync('./moviesData.json', JSON.stringify(moviesData), 'utf-8');

  // this saves our csv formatted information into a csv file 
  // fs.writeFileSync('./moviesDataAllFields.csv', csv, 'utf-8');
  // console.log(csv);

})();
