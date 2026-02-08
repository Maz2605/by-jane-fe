const fetch = require('node-fetch'); // Check if node-fetch is available or use native fetch if Node 18+

async function testLogin() {
    const url = 'http://localhost:1337/api/auth/local';
    const body = {
        identifier: 'admin',
        password: '123'
    };

    console.log('Testing login to:', url);
    console.log('Payload:', body);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('✅ Login Successful!');
            if (data.user) {
                console.log('User Info:', data.user);
            }
        } else {
            console.log('❌ Login Failed');
        }

    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testLogin();
