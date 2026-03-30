module.exports = function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets");

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
