const allowedStatuses = new Set(['ready', 'researching', 'draft', 'needs_review', 'approved', 'publishing', 'published', 'failed', 'paused']);

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    body: JSON.stringify(body),
  };
}

function isAuthorized(event) {
  const secret = process.env.AGENT_MANAGER_SHARED_SECRET;
  if (!secret) return false;
  return event.headers.authorization === `Bearer ${secret}`;
}

function validateJob(job) {
  if (!job || typeof job !== 'object') return 'Job body is required.';
  if (!/^eyvan-[a-z0-9-]+$/.test(job.jobId || '')) return 'jobId must start with eyvan-.';
  if (typeof job.topic !== 'string' || job.topic.trim().length < 8) return 'topic is too short.';
  if (!Array.isArray(job.languages) || job.languages.some((language) => !['en', 'fa'].includes(language))) return 'languages must be en and/or fa.';
  if (!allowedStatuses.has(job.status)) return 'status is invalid.';
  if (!['owner_sources_only', 'owner_sources_plus_verified_web'].includes(job.sourcePolicy)) return 'sourcePolicy is invalid.';
  return null;
}

export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'POST only.' });
  if (!isAuthorized(request)) return json(401, { error: 'Unauthorized.' });

  let job;
  try {
    job = JSON.parse(request.body || '{}');
  } catch {
    return json(400, { error: 'Body must be valid JSON.' });
  }

  const validationError = validateJob(job);
  if (validationError) return json(400, { error: validationError });

  // The live Composio/Gemini execution is enabled only after protected environment
  // variables and owner-controlled OAuth connections exist in Netlify.
  const requiredEnvironment = ['COMPOSIO_API_KEY', 'GEMINI_API_KEY'];
  const missingEnvironment = requiredEnvironment.filter((key) => !process.env[key]);
  if (missingEnvironment.length) {
    return json(202, {
      jobId: job.jobId,
      status: 'configuration_required',
      nextState: 'ready',
      missingEnvironment,
      message: 'Job accepted for validation. Live draft generation is not enabled yet.',
    });
  }

  return json(202, {
    jobId: job.jobId,
    status: 'queued',
    nextState: 'researching',
    mode: 'draft_only',
    message: 'Live provider routing will create a draft only; publishing remains approval-gated.',
  });
};
