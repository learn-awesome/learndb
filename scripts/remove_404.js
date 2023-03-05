import https from 'https';
import http from 'http';
import items from "../db/items.json" assert {type: "json"};

function checkLink(url) {
  return new Promise((resolve, reject) => {
    let protocol = url.startsWith('https') ? https : http;
    protocol.get(url, (res) => {
      if (res.statusCode === 404) {
        resolve(false);
      } else {
        resolve(true);
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function checkLinks(item) {
  if (!item.links || item.links.length === 0) {
    return;
  }
  for (let i = 0; i < item.links.length; i++) {
    const linkParts = item.links[i].split('|');
    const url = linkParts[1];
    try {
      const linkExists = await checkLink(url);
      if (!linkExists) {
        item.links.splice(i, 1);
        i--;
        console.log(`Removed 404 link from ${item.name}: ${url}`);
      }
    } catch (error) {
      console.error(`Error checking link ${url}: ${error}`);
    }
  }
}

async function checkAllLinks() {
  for (const item of items) {
    await checkLinks(item);
  }
  fs.writeFileSync('db/items.json', JSON.stringify(items));
  console.log('Updated items.json');
}

checkAllLinks();
