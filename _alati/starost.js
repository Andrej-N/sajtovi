// Poredi danasnji tekst pocetne strane sa Wayback snimkom iz 2021-2022 (slicnost >= 0.9 = isti, stari sajt).
const fs = require('fs'), path = require('path');
const dir = process.argv[2];
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ');
const toks = (t) => new Set(t.toLowerCase().split(/[^a-zčćšžđ0-9]+/i).filter((w) => w.length > 3));
const jac = (a, b) => { let n = 0; for (const x of a) if (b.has(x)) n++; return n / Math.max(1, Math.min(a.size, b.size)); };
const get = async (u) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), 25000); try { const r = await fetch(u, { signal: c.signal, headers: { 'user-agent': 'Mozilla/5.0 (compatible; proveraSajta/1.0)' } }); return { status: r.status, text: await r.text(), url: r.url }; } catch (e) { return { status: 0, text: '', url: u }; } finally { clearTimeout(t); } };
(async () => {
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    const host = j.website.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
    const now = await get('https://' + host + '/').then((r) => (r.status === 200 ? r : get('http://' + host + '/')));
    const cdx = await get(`https://web.archive.org/cdx/search/cdx?url=${host}&fl=timestamp&limit=1&filter=statuscode:200`);
    const old = await get(`https://web.archive.org/web/2022id_/http://${host}/`);
    const stamp = (old.url.match(/\/web\/(\d{4})/) || [])[1] || '-';
    const sim = old.text && now.text ? jac(toks(strip(old.text)), toks(strip(now.text))).toFixed(2) : '-';
    console.log(j.slug.padEnd(42), 'prvi:', (cdx.text.trim().slice(0, 4) || '-').padEnd(5), 'snimak:', stamp.padEnd(5), 'slicnost:', String(sim).padEnd(5), 'sada:', now.status);
  }
})();
