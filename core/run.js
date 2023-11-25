const HttpClient = require("./httpClient");

// 1. create an httpClient
// 1.1. mark benchmark starting time
// 2. check if testDuration time is over
// 3. send one request
// 4. receive the response from httpClient, and save the information, pass to tracker
// 5. send to the next request

function runner(config, tracker) {
    // create an httpClient
    const httpClient = new HttpClient(config);   

    // create the runner start time, for future use of check testDuration
    let runnerStartTime = Date.now();

    // create sessionId, start with 0
    // to-do: support multiple session for stretch feature
    let sessionId = 0; 

    // create requestId, start with 0
    let requestId = 0; 

    function selectRequest() {
        // 2. check if testDuration time is over
        const currentTime = Date.now();
        if (currentTime - runnerStartTime > config.testDuration * 1000) return;
        // 3. send one request
        tracker.beforeSendRequest(sessionId, requestId);
        httpClient.sendRequest(config.sessions[sessionId].requests[requestId], onResponse);  
    }

    function onResponse() {
        // 4. receive the response from httpClient, and save the information, pass to tracker
        tracker.afterReceiveResponse(sessionId, requestId);
        // 5. send to the next request
        requestId ++;
        // check if this session ends; if so, start a new session
        if (requestId >= config.sessions[sessionId].requests.length) {
            requestId = 0;
            // to-do: support multiple sessions for stretch
        }
        selectRequest();
    }
  
    // send the first request
    selectRequest();
}
















// read config file in kaskade.js
const config = 