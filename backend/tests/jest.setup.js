// Point tests at the real mongo container when running in CI
if (process.env.CI) {
  process.env.MONGO_URI = 'mongodb://skillmap-mongo:27017/skillmap-test';
}