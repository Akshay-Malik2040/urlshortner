const express = require('express');
const pool = require('./config/db');
const urlRoutes=require('./routes/url.routes')
const app = express();

app.use(express.json())

app.get('/health', async(req, res) => {
    try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      status: "ok",
      database: "connected",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      status: "error",
      message: "Database connection failed",
    });
  }
})

app.use('/api/urls',urlRoutes);

// Centralized error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: "Internal server error",
  });
});

module.exports = app;