module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets");

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
