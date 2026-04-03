/**
 * Approvero Bot Tracker v1.0
 * Lightweight AI bot detection script (~1.5 KB minified)
 * 
 * Usage:
 *   <script async src="https://cdn.approvero.com/tracker.js" data-site-id="apv_xxx"></script>
 *
 * Privacy-first: no cookies, no fingerprinting, only detects known AI bot user agents.
 * Human visitors are never tracked.
 */
(function () {
  "use strict";

  // Known AI bot patterns — [regex, display name]
  var bots = [
    [/GPTBot/i, "GPTBot"],
    [/ChatGPT-User/i, "ChatGPT-User"],
    [/ClaudeBot/i, "ClaudeBot"],
    [/Claude-Web/i, "Claude-Web"],
    [/PerplexityBot/i, "PerplexityBot"],
    [/Google-Extended/i, "Google-Extended"],
    [/Googlebot/i, "Googlebot"],
    [/Bingbot/i, "Bingbot"],
    [/Bytespider/i, "Bytespider"],
    [/Applebot-Extended/i, "Applebot-Extended"],
    [/Applebot/i, "Applebot"],
    [/Meta-ExternalAgent/i, "Meta-ExternalAgent"],
    [/Amazonbot/i, "Amazonbot"],
    [/cohere-ai/i, "Cohere-AI"],
    [/YouBot/i, "YouBot"],
    [/CCBot/i, "CCBot"],
    [/anthropic-ai/i, "Anthropic-AI"],
    [/Diffbot/i, "Diffbot"],
    [/FacebookBot/i, "FacebookBot"],
  ];

  // Find the current script tag to read data-site-id
  var scripts = document.getElementsByTagName("script");
  var current = scripts[scripts.length - 1];
  var siteId = current && current.getAttribute("data-site-id");

  if (!siteId) return; // No site ID, bail

  var ua = navigator.userAgent || "";
  var detected = null;

  for (var i = 0; i < bots.length; i++) {
    if (bots[i][0].test(ua)) {
      detected = bots[i][1];
      break;
    }
  }

  if (!detected) return; // Not a bot, do nothing

  var payload = JSON.stringify({
    site_id: siteId,
    bot_name: detected,
    page_path: location.pathname,
    user_agent: ua.substring(0, 1000),
  });

  var endpoint = "https://fewgxlufqlbgdszmpjzn.supabase.co/functions/v1/track-bot";

  // Prefer sendBeacon for reliability on page unload, fall back to fetch
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
  } else {
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(function () {});
  }
})();
