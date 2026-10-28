export const onRequestGet = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'by.fio Cloudflare Pages & D1 API',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
