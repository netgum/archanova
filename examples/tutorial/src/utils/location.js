export function getLocationPort() {
  return parseInt(document.location.port, 10);
}

export function getTargetEndpoint() {
  const port = getLocationPort();
  return `http://localhost:${port === 5100 ? 5200 : 5100}`;
}

export function getCurrentEndpoint() {
  const port = getLocationPort();
  return `http://localhost:${port}`;
}
