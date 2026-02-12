// PM2 Ecosystem Configuration for Ezy CV
// Usage: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'ezycv-backend',
      script: './server.js',
      cwd: '/home/ezycv/ezycv-website/backend',
      instances: 1,
      exec_mode: 'fork',
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000
      },
      error_file: '/home/ezycv/.pm2/logs/ezycv-backend-error.log',
      out_file: '/home/ezycv/.pm2/logs/ezycv-backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      listen_timeout: 3000,
      kill_timeout: 5000
    }
  ],

  deploy: {
    production: {
      user: 'ezycv',
      host: 'your-droplet-ip',
      ref: 'origin/main',
      repo: 'https://github.com/YOUR_USERNAME/ezycv-website.git',
      path: '/home/ezycv/ezycv-website',
      'post-deploy': 'cd backend && npm install && cd ../frontend && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      ssh_options: 'StrictHostKeyChecking=no'
    }
  }
};
