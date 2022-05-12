export const delay = (ms = 7000) =>
  new Promise((done) => setTimeout(() => done(), ms));
