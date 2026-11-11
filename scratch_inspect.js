const fs = require('fs');
const files = fs.readdirSync('node_modules/html5-qrcode/esm');
for (const f of files) {
  const c = fs.readFileSync('node_modules/html5-qrcode/esm/' + f, 'utf8');
  if (c.includes('createElement("video")') || c.includes("createElement('video')")) {
    console.log('Video element created in:', f);
    const idx = c.indexOf('createElement("video"') !== -1 ? c.indexOf('createElement("video"') : c.indexOf("createElement('video'");
    console.log(c.substring(idx - 100, idx + 400));
  }
}
