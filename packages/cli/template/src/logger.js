module.exports = {
  info(name, ...args) {
    console.info(name, ...args);
  },
  error(name, err) {
    console.error(name, err);
  },
}
