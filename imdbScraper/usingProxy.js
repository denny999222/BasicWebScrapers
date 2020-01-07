// using proxy with request-promise library 
const requestPromise = require('request-promise').defaults({
    // should be in format 'http://user:password@ip:port' or just 
    // 'http://ip:port' if the proxy server has no authentication
    proxy: 'http://24.172.82.94:53281'
    // this wouldn't work bc we do not have access to an actual proxy server
});

(async () => {
    // this url simply returns the requester's ip address (should be 100.2.158.61 for me) if no proxy server given
    let response = await requestPromise('http://httpbin.org/ip');
    // if proxy server is given, then it should return the proxy server ip address
    console.log(response);
    debugger;
})();

