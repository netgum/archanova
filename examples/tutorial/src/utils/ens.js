export function generateRandomEnsLabel() {
  return (
    'tutorial' +
    Date.now().toString(32) +
    Math.floor(Math.random()*100000).toString(32)
  );
}
