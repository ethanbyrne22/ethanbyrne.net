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

  // Create a collection of projects sorted by display order
  eleventyConfig.addCollection("projects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/*.md").sort((a, b) => {
      return (a.data.order || 999) - (b.data.order || 999);
    });
  });

  // Featured projects (first 3 by order) for below-the-fold
  eleventyConfig.addCollection("featuredProjects", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/projects/*.md")
      .filter(p => p.data.featured)
      .sort((a, b) => (a.data.order || 999) - (b.data.order || 999));
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
