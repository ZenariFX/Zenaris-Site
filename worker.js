export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Discord proxy route – hides your User ID from the frontend
    if (url.pathname === '/api/discord') {
      const discordUserId = '1012044681347072081';
      const res = await fetch(`https://api.lanyard.rest/v1/users/${discordUserId}`);
      const data = await res.json();
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Serve static assets (HTML, CSS, JS, images, etc.)
    return env.ASSETS.fetch(request);
  }
};
