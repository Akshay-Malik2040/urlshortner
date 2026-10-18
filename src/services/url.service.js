
const crypto = require("node:crypto");
const pool=require("../config/db");

const BASE62_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

const SHORT_CODE_LENGTH = 8;

const generateShortCode = () => {
  let shortCode = "";

  while (shortCode.length < SHORT_CODE_LENGTH) {
    const randomBytes = crypto.randomBytes(16);

    for (const byte of randomBytes) {
      // Avoid modulo bias so each Base62 character is equally likely.
      if (byte >= 248) continue;

      shortCode += BASE62_CHARACTERS[byte % 62];

      if (shortCode.length === SHORT_CODE_LENGTH) {
        break;
      }
    }
  }

  return shortCode;
};



const createShortUrl = async (originalUrl) => {
  const MAX_RETRIES = 5;

  const query = `
    INSERT INTO urls (original_url, short_code)
    VALUES ($1, $2)
    RETURNING id, original_url, short_code, created_at;
  `;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const shortCode = generateShortCode();

    try {
      const result = await pool.query(query, [
        originalUrl,
        shortCode,
      ]);

      return result.rows[0];
    } catch (error) {
      const isShortCodeCollision =
        error.code === "23505" &&
        error.constraint === "urls_short_code_key";

      if (!isShortCodeCollision) {
        throw error;
      }

      if (attempt === MAX_RETRIES - 1) {
        throw new Error(
          "Failed to create a unique short code after 5 attempts"
        );
      }
    }
  }
};



const getUrlByShortCode = async (shortCode) => {
  const query = `
    SELECT id, original_url, short_code, created_at
    FROM urls
    WHERE short_code = $1;
  `;

  const result = await pool.query(query, [shortCode]);

  return result.rows[0] || null;
};

module.exports = {
  generateShortCode,
  createShortUrl,
  getUrlByShortCode
};