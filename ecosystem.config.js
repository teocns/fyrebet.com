module.exports = {
  apps: [{
    script: 'npm',
    watch: '.',
    ignore_watch: [
      "node_modules",
    ],
    args: 'start',
    name: 'fyrebet-client'
  }],


};
