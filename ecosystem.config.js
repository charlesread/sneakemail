module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: "sneaker",
      script: "./index.js",
      exec_mode: 'cluster',
      instances: 4
    }
  ]
}
