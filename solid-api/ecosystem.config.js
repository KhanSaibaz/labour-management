module.exports = {
  apps: [
    {
      name: 'hmelectricals_api',
      script: 'npm',
      args: 'run start',
      env_debug: {
        NODE_DEBUG: 'tls,https',
      },
    },
  ],
};

