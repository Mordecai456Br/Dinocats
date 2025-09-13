module.exports = {

  logWithTime(...args) {
    const now = new Date().toLocaleString("pt-BR");
    console.log(`[${now}]`, ...args);
  }

}
