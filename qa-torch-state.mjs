// Keep the older QA entry point while using the current inline/milestone checks.
if (process.env.TORCH_QA_URL) {
  process.env.MASHAL_QA_URL = process.env.TORCH_QA_URL;
  process.env.MASHAL_QA_TARGETS = 'source';
}
await import('./tests/mashal-popup-browser.mjs');
