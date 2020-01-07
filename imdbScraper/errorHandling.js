const requestPromise = require('request-promise');

(async () => {
    // this will test out a status code of 200
    try {
        let response = await requestPromise({
            uri: 'http://httpbin.org/status/500',
            resolveWithFullResponse: true
        });
        console.log('Success message:');
        console.log(response.statusMessage, response.statusCode);
    } catch (response) {
        switch (response.statusCode) {
            case 300:
                console.log('Redirect. Request success');
            case 400:
                console.log('Client Error');
            case 500:
                console.log('Server Error');
        }

    }

})();