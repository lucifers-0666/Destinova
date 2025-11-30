// PM2 Ecosystem Configuration
// Start: pm2 start ecosystem.config.cjs --env production
// Monitor: pm2 monit
// Logs: pm2 logs
// Restart: pm2 restart destinova
// Auto-startup: pm2 startup && pm2 save

module.exports = {
  apps: [
    {
      name: 'destinova',
      script: 'dist/server.js',
      
      // Cluster mode - use all CPU cores
      instances: 'max',
      exec_mode: 'cluster',
      
      // Auto restart on file changes (disable in production)
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'uploads', '.git'],
      
      // Environment variables
      env: {
        NODE_ENV: 'development',
        PORT: 4000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
      env_staging: {
        NODE_ENV: 'staging',
        PORT: 4001,
      },
      
      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      combine_logs: true,
      merge_logs: true,
      
      // Process management
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
      
      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,
      
      // Source maps for error tracking
      source_map_support: true,
      
      // Cron-based restart (optional - restart every day at 4 AM)
      // cron_restart: '0 4 * * *',
    },
    
    // Worker process for background jobs (optional)
    // {
    //   name: 'destinova-worker',
    //   script: 'dist/workers/jobProcessor.js',
    //   instances: 1,
    //   exec_mode: 'fork',
    //   env_production: {
    //     NODE_ENV: 'production',
    //   },
    //   error_file: 'logs/worker-error.log',
    //   out_file: 'logs/worker-out.log',
    // },
  ],
  
  // Deployment configuration
  deploy: {
    production: {
      user: 'deploy',
      host: ['your-server-ip'],
      ref: 'origin/main',
      repo: 'git@github.com:lucifers-0666/Destinova.git',
      path: '/var/www/destinova',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.cjs --env production',
      'pre-setup': '',
      env: {
        NODE_ENV: 'production',
      },
    },
    staging: {
      user: 'deploy',
      host: ['staging-server-ip'],
      ref: 'origin/develop',
      repo: 'git@github.com:lucifers-0666/Destinova.git',
      path: '/var/www/destinova-staging',
      'post-deploy': 'npm ci && npm run build && pm2 reload ecosystem.config.cjs --env staging',
      env: {
        NODE_ENV: 'staging',
      },
    },
  },
};
