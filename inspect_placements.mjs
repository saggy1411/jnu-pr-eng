import fs from 'fs';
import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const p = spawn(edgePath, [
  '--headless=new',
  '--disable-gpu',
  '--remote-debugging-port=9222',
  'file:///' + process.cwd().replace(/\\/g, '/') + '/index.html'
]);

await new Promise(r => setTimeout(r, 1500));

try {
  const tabsRes = await fetch('http://127.0.0.1:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page');

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      const handler = (event) => {
        const data = JSON.parse(event.data);
        if (data.id === msgId) {
          ws.removeEventListener('message', handler);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  // Mobile Viewport (390x844 scrolled to the cards inside placements)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', {
    expression: `window.scrollTo(0, document.getElementById('placements').offsetTop + 240);`
  });
  await new Promise(r => setTimeout(r, 600));

  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('preview-placements-mobile.png', Buffer.from(mobileShot.data, 'base64'));
  console.log('Saved preview-placements-mobile.png');

  ws.close();
} catch (e) {
  console.error('Error:', e);
} finally {
  p.kill();
  process.exit(0);
}
