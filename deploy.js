const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const TOKEN = 'nfc_DVAotRbUTSdUf3fx6xNHErTGo87hxyiW3c35';
const SITE_ID = '12834436-f4e9-4db0-8ac0-bb0207f1f160';
const DEPLOY_DIR = path.join(__dirname, 'website');

function apiCall(method, apiPath, body, contentType) {
    return new Promise((resolve, reject) => {
        const opts = {
            hostname: 'api.netlify.com',
            path: '/api/v1' + apiPath,
            method: method,
            headers: {
                'Authorization': 'Bearer ' + TOKEN,
                'Content-Type': contentType || 'application/json'
            }
        };
        const req = https.request(opts, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch(e) { resolve(data); }
            });
        });
        req.on('error', reject);
        if (body) {
            if (typeof body === 'string' || Buffer.isBuffer(body)) req.write(body);
            else req.write(JSON.stringify(body));
        }
        req.end();
    });
}

function getFiles(dir, base) {
    base = base || dir;
    let results = [];
    const items = fs.readdirSync(dir);
    for (let i = 0; i < items.length; i++) {
        const full = path.join(dir, items[i]);
        if (fs.statSync(full).isDirectory()) {
            results = results.concat(getFiles(full, base));
        } else {
            const rel = '/' + path.relative(base, full).split(path.sep).join('/');
            const content = fs.readFileSync(full);
            const sha1 = crypto.createHash('sha1').update(content).digest('hex');
            results.push({ path: rel, sha1: sha1, content: content });
        }
    }
    return results;
}

async function main() {
    console.log('Scanning files in', DEPLOY_DIR);
    const files = getFiles(DEPLOY_DIR);
    console.log('Found ' + files.length + ' files:');
    files.forEach(function(f) { console.log('  ' + f.path); });

    // Build hash map
    const fileHashes = {};
    files.forEach(function(f) { fileHashes[f.path] = f.sha1; });

    console.log('\nCreating deploy...');
    const deploy = await apiCall('POST', '/sites/' + SITE_ID + '/deploys', {
        files: fileHashes
    });

    if (deploy.id) {
        console.log('Deploy ID: ' + deploy.id);
    } else {
        console.log('Deploy response:', JSON.stringify(deploy, null, 2));
        return;
    }

    const required = deploy.required || [];
    console.log('Files to upload: ' + required.length);

    for (let i = 0; i < required.length; i++) {
        const sha = required[i];
        const file = files.find(function(f) { return f.sha1 === sha; });
        if (file) {
            console.log('Uploading: ' + file.path);
            await apiCall('PUT',
                '/deploys/' + deploy.id + '/files' + file.path,
                file.content,
                'application/octet-stream'
            );
        }
    }

    console.log('\nDeploy complete!');
    console.log('Live URL: https://borikenaiconsulting.com');
}

main().catch(function(err) { console.error('Error:', err); });
