-- Keeply cron job: daily warranty notification check
-- Run once in the Supabase SQL Editor AFTER 0001_init.sql.
--
-- Prerequisites:
--   1. Enable pg_cron and pg_net extensions in your Supabase project
--      (Dashboard → Database → Extensions → search for "pg_cron" and "pg_net")
--
-- 2. Set the app settings used by the cron job:
--      alter database set "app.settings.base_url" = 'https://your-domain.vercel.app';
--      alter database set "app.settings.cron_secret" = 'your-generated-secret';

select cron.schedule(
  'send-warranty-notifications',
  '0 9 * * *',
  $$
  select net.http_post(
    url := current_setting('app.settings.base_url', true) || '/api/cron/notifications',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.cron_secret', true),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
