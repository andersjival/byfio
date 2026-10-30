export const onRequestGet = async () => {
  return new Response(
    JSON.stringify({
      status: 'ok',
      service: 'by.fio Cloud API',
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
