/**
 * Sert les vidéos de /public/videos avec la prise en charge des requêtes « Range ».
 * Cloudflare Pages renvoie toujours le fichier entier : sans réponse 206, le navigateur
 * ne peut pas avancer dans la vidéo avec la barre de lecture.
 */
interface Env { ASSETS: { fetch: (input: Request | string) => Promise<Response> } }

export const onRequest: PagesFunction<Env> = async ({ request, env }) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response(null, { status: 405 });

  const asset = await env.ASSETS.fetch(new Request(request.url, { method: 'GET' }));
  if (!asset.ok || !asset.body) return asset;

  const headers = new Headers(asset.headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'public, max-age=86400');

  const range = request.headers.get('Range');
  const m = range?.match(/^bytes=(\d*)-(\d*)$/);
  let size = Number(asset.headers.get('Content-Length'));
  if (m && !size) {
    // Taille inconnue (réponse compressée ou fragmentée) : on lit le fichier en mémoire
    const buf = await asset.arrayBuffer();
    size = buf.byteLength;
    const start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
    const end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
    if (start >= size || start > end) return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    headers.delete('Content-Encoding');
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(request.method === 'HEAD' ? null : buf.slice(start, end + 1), { status: 206, headers });
  }
  if (!m || !size || (!m[1] && !m[2])) {
    if (request.method === 'HEAD') { asset.body.cancel(); return new Response(null, { status: 200, headers }); }
    return new Response(asset.body, { status: 200, headers });
  }

  const start = m[1] ? Number(m[1]) : Math.max(0, size - Number(m[2]));
  const end = m[1] && m[2] ? Math.min(Number(m[2]), size - 1) : size - 1;
  if (start >= size || start > end) {
    asset.body.cancel();
    return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
  }

  const length = end - start + 1;
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
  headers.set('Content-Length', String(length));
  if (request.method === 'HEAD') { asset.body.cancel(); return new Response(null, { status: 206, headers }); }

  // Lit le fichier en flux et ne garde que les octets demandés
  const { readable, writable } = new FixedLengthStream(length);
  (async () => {
    const reader = asset.body!.getReader();
    const writer = writable.getWriter();
    let pos = 0;
    try {
      while (pos <= end) {
        const { done, value } = await reader.read();
        if (done) break;
        const from = Math.max(0, start - pos);
        const to = Math.min(value.length, end - pos + 1);
        if (to > from) await writer.write(value.subarray(from, to));
        pos += value.length;
      }
      await writer.close();
    } catch (err) {
      await writer.abort(err);
    } finally {
      reader.cancel().catch(() => {});
    }
  })();

  return new Response(readable, { status: 206, headers });
};
