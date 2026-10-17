function validateCreateUrl(req, res, next) {
  const { original_url } = req.body;

  if (typeof original_url !== "string" || !original_url.trim()) {
    return res.status(400).json({
      error: "URL is required",
    });
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(original_url.trim());
  } catch(err) {
    return res.status(400).json({
      error: "Invalid URL format",
    });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return res.status(400).json({
      error: "Only HTTP and HTTPS URLs are allowed",
    });
  }

  req.body.url = original_url.trim();
  next();
}

module.exports = {validateCreateUrl};