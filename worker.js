export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/discord') {
      const discordUserId = '1012044681347072081';
      const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return env.ASSETS.fetch(request);
  }
};
