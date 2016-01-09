import request from 'request';

function fetch(url, body){
    return new Promise((resolve, reject) => {
        try {
            let requestOptions = {
                uri: url,
                method: 'POST',
                strictSSL: false,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                },
                auth: {
                    'user': 'user',
                    'pass': 'password',
                    'sendImmediately': true
                },
                json: true,
                body: body
            };
            request(
                requestOptions,
                (error, response, body) => {
                    console.log(JSON.stringify(body, null, 4));
                    if (response) {
                        if (response.statusCode !== 200) {
                            if (response.statusCode === 401) {
                                reject('User is not authenticated');
                            } else {
                                reject('Got error code ' + response.statusCode + ' processing request to ' + url);
                            }
                        } else if (error) {
                            reject('Error connection to ' + url);
                        } else {
                            resolve(body.data);
                        }
                    } else {
                        reject('Error connection to ' + url);
                    }
                }
            )

        } catch (e) {
            reject('Error: ' + e.message);
        }
    });

}

export function preProcess(dataObject){
    return fetch(
        'http://localhost:3000/gengine/preprocess',
        {
            generatorName: 'component-simple-probe-01',
            scriptName: 'component.js',
            options: dataObject
        }
    );
}

export function process(dataObject){

    return fetch(
        'http://localhost:3000/gengine/process',
        {
            generatorName: 'component-simple-probe-01',
            scriptName: 'component.js',
            options: dataObject
        }
    );
}

