const requestPromise = require('request-promise');
const cheerio = require('cheerio');

(async () => {

    try {
        // The parameters of request can be only the url if it's simply a GET with no other 
        // information such as header or cookies etc. But I declared just to show way
        console.log('Initial request')
        let initialRequest = await requestPromise({
            uri: 'http://quotes.toscrape.com/login',
            method: 'GET',
            gzip: true,
            resolveWithFullResponse: true
        });

        // this gets the cookie from the response header, which we will use later to
        // authenticate us correctly as part of the POST request header
        let cookie = initialRequest.headers['set-cookie'].map(value => {
            // this simply splits the cookie by semicolon and takes the first chunk
            return value.split(';')[0];
        }).join(' ');

        // loads the html
        let $ = cheerio.load(initialRequest.body);

        // this gets the input token, which we will need because it is part of the form data
        // for when you log in
        let csrfToken = $(`input[name="csrf_token"]`).val();

        // this sends a post request to login with the user credentials
        // as 'form' which has csrfToken, username, and password
        let loginRequest = await requestPromise({
            uri: 'http://quotes.toscrape.com/login',
            method: 'POST',
            gzip: true,
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Encoding': 'gzip, deflate',
                'Accept-Language': 'en-US,en;q=0.9',
                'Connection': 'keep-alive',
                'Host': 'quotes.toscrape.com',
                'Referer': 'http://toscrape.com/login',
                'Upgrade-Insecure-Requests': '1',
                'Cookie': cookie,
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'
            },
            form: { // this is to login with these credentials 
                'csrf_token': csrfToken,
                'username': 'username',
                'password': 'password'
            },
            resolveWithFullResponse: true
        });
        debugger;

    } catch (response) {
        // in the case that it is status code 300 redirect, then we must
        // get the new cookies we are given from response
        cookie = response.response.headers['set-cookie'].map(value => {
            return value.split(';')[0];
        }).join(' ');

        debugger;
    }

    // just to check if we are logged in or not by requesting a GET method to view the HTML
    let loggedIn = await requestPromise({
        uri: 'http://quotes.toscrape.com/',
        method: 'GET',
        gzip: true,
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Accept-Encoding': 'gzip, deflate',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Host': 'quotes.toscrape.com',
            'Referer': 'http://toscrape.com/login',
            'Upgrade-Insecure-Requests': '1',
            'Cookie': cookie,
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36'
        }
    })


    debugger;
})();