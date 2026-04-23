const https = require('https');

function flatten(obj, prefix) {
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v === null || v === undefined) continue;
        const key = prefix ? `${prefix}[${k}]` : k;
        if (Array.isArray(v)) {
            v.forEach((item, i) => {
                if (item !== null && typeof item === 'object') {
                    Object.assign(out, flatten(item, `${key}[${i}]`));
                } else {
                    out[`${key}[${i}]`] = item;
                }
            });
        } else if (typeof v === 'object') {
            Object.assign(out, flatten(v, key));
        } else {
            out[key] = v;
        }
    }
    return out;
}

function formEncode(obj) {
    return Object.entries(flatten(obj))
        .map(([k, v]) => encodeURIComponent(k) + '=' + encodeURIComponent(String(v)))
        .join('&');
}

function stripeCall(method, path, body) {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return Promise.reject(new Error('STRIPE_SECRET_KEY not set'));

    const data = body ? formEncode(body) : '';
    const opts = {
        hostname: 'api.stripe.com',
        path: '/v1' + path,
        method,
        headers: {
            'Authorization': 'Bearer ' + secret,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(opts, (res) => {
            let buf = '';
            res.on('data', c => buf += c);
            res.on('end', () => {
                let parsed;
                try { parsed = JSON.parse(buf); }
                catch (e) { return reject(new Error('Invalid Stripe response: ' + buf)); }
                if (res.statusCode >= 400) {
                    return reject(new Error(parsed.error && parsed.error.message || 'Stripe error ' + res.statusCode));
                }
                resolve(parsed);
            });
        });
        req.on('error', reject);
        if (data) req.write(data);
        req.end();
    });
}

module.exports = { stripeCall };
