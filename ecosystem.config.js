module.exports = {
  apps: [
    {
      name: 'ai-service-portal',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/Users/luck/cccode/ai-service-portal',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
    },
  ],
};
