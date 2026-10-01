module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets");

  // Favicons (must live at site root)
  eleventyConfig.addPassthroughCopy({ "src/favicon.ico": "favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/favicon.svg": "favicon.svg" });
  eleventyConfig.addPassthroughCopy({ "src/favicon-96x96.png": "favicon-96x96.png" });
  eleventyConfig.addPassthroughCopy({ "src/apple-touch-icon.png": "apple-touch-icon.png" });
  eleventyConfig.addPassthroughCopy({ "src/web-app-manifest-192x192.png": "web-app-manifest-192x192.png" });
  eleventyConfig.addPassthroughCopy({ "src/web-app-manifest-512x512.png": "web-app-manifest-512x512.png" });
  eleventyConfig.addPassthroughCopy({ "src/site.webmanifest": "site.webmanifest" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/llms.txt": "llms.txt" });

  // Filter: convert YouTube/Vimeo URL to embed URL
  eleventyConfig.addFilter("videoEmbed", function(url) {
    if (!url) return "";
    // YouTube
    var ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return "https://www.youtube.com/embed/" + ytMatch[1];
    // Vimeo
    var vmMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vmMatch) return "https://player.vimeo.com/video/" + vmMatch[1];
    return url;
  });

  // Filter: extract YouTube/Vimeo video ID
  eleventyConfig.addFilter("videoId", function(url) {
    if (!url) return "";
    var ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return ytMatch[1];
    var vmMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vmMatch) return vmMatch[1];
    return "";
  });

  // Filter: is this a YouTube URL?
  eleventyConfig.addFilter("isYouTube", function(url) {
    return !!(url && /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]{11}/.test(url));
  });

  // Filter: pick the still image shown while a video loads (or if it never plays).
  // Order: landscape thumbnail -> first landscape gallery image -> any thumbnail
  // -> first gallery image -> YouTube's own frame grab (a plain JPG, no UI).
  eleventyConfig.addFilter("videoPoster", function(data, url) {
    data = data || {};
    var aspectOf = function(a) { return a || "landscape"; };
    if (data.thumbnail && aspectOf(data.thumbnail_aspect) === "landscape") return data.thumbnail;
    var imgs = data.images || [];
    for (var i = 0; i < imgs.length; i++) {
      if (imgs[i] && imgs[i].url && aspectOf(imgs[i].aspect) === "landscape") return imgs[i].url;
    }
    if (data.thumbnail) return data.thumbnail;
    if (imgs[0] && imgs[0].url) return imgs[0].url;
    var yt = (url || "").match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return yt ? "https://i.ytimg.com/vi/" + yt[1] + "/maxresdefault.jpg" : "";
  });

  // Filter: display date nicely
  eleventyConfig.addFilter("dateDisplay", function(dateObj) {
    if (!dateObj) return "";
    var d = new Date(dateObj);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  });

  // Create a collection of projects sorted by display order
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/*.md").sort((a, b) => {
      return (a.data.order || 999) - (b.data.order || 999);
    });
  });

  // Letters from the Editors — sorted newest first
  eleventyConfig.addCollection("letters", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/letters/*.md").sort((a, b) => {
      return new Date(b.data.date) - new Date(a.data.date);
    });
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
