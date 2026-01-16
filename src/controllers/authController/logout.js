function logout(_req, res) {
  res.clearCookie('access_token');
  return res.json({
    success: true,
    message: 'logout_success',
  });
}

module.exports = logout;
