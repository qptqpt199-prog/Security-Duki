const userMessages = new Map();

function trackMessage(userId) {
  const now = Date.now();
  const arr = userMessages.get(userId) || [];
  arr.push(now);
  userMessages.set(userId, arr);
  return arr;
}

function cleanOldMessages(userId, interval) {
  const now = Date.now();
  const filtered = (userMessages.get(userId) || []).filter(t => now - t < interval);
  userMessages.set(userId, filtered);
  return filtered;
}

function resetUser(userId) {
  userMessages.delete(userId);
}

module.exports = { trackMessage, cleanOldMessages, resetUser };
