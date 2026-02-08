const http = require('http');

function testLogin() {
    const data = JSON.stringify({
        identifier: 'admin',
        password: '123'
    });

    const options = {
        hostname: 'localhost',
        port: 1337,
        path: '/api/auth/local',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }
    };

    console.log('Testing login request to http://localhost:1337/api/auth/local...');

    const req = http.request(options, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            body += chunk;
        });
        res.on('end', () => {
            try {
                const parsed = JSON.parse(body);
                console.log('BODY:', JSON.stringify(parsed, null, 2));
            } catch (e) {
                console.log('BODY:', body);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
    });

    req.write(data);
    req.end();
}

testLogin();
