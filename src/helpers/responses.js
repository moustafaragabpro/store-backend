function success(res, message, data = {}) {
  return res.status(200).json({ success: true, message, data });
}

function created(res, message, data = {}) {
  return res.status(201).json({ success: true, message, data });
}

function badRequest(res, message) {
  return res.status(400).json({ success: false, message });
}

function notFound(res, message) {
  return res.status(404).json({ success: false, message });
}

function internalServerError(res) {
  return res.status(500).json({ message: "Internal Server Error" });
}

const responses = {
  created,
  badRequest,
  notFound,
  success,
  internalServerError,
};

export default responses;
