// Glossary terms unlocked by bot modules and mastery (added in v3).
G({
  'parse': ['Parse', 'Turn raw text (an email, a log line, JSON) into structured data your code can use.'],
  'conditional': ['Conditional', 'Code that runs only when a condition is true: if / else, switch, or a lookup with a fallback.'],
  'retry': ['Retry with backoff', 'Repeat a failed call that might succeed later (5xx, 429), waiting longer each time: 100 ms, 200 ms, 400 ms… plus random jitter.'],
  'logging': ['Structured logging', 'Writing events as machine-readable records (usually one JSON object per line) with a level, message, IDs and a timestamp.'],
  'cron': ['Cron', 'A schedule format with five fields: minute hour day-of-month month day-of-week. "0 9 * * 1-5" means weekdays at 9:00.'],
  'webhook': ['Webhook', 'An HTTP request another service sends you when something happens. Verify its signature, answer fast, and queue the work.'],
  'concurrency': ['Concurrency limit', 'The maximum number of tasks running at the same time, usually set by the number of workers.'],
  'rate-limit': ['Rate limit', 'A cap on requests per time window. Servers answer 429 Too Many Requests when you exceed it.'],
  'function-calling': ['Function calling (tool use)', 'A model API feature: you describe tools with JSON Schema, the model proposes a call with arguments, and your code decides whether to run it.'],
  'system-prompt': ['System prompt', 'Standing instructions sent with every model request. It steers behavior in context; it does not change the model\'s weights.'],
  'fine-tuning': ['Fine-tuning', 'Further training a copy of a model on labeled examples so the behavior is built into its weights. Costlier than prompting; prove it helps with an eval.'],
  'eval': ['Eval set', 'A fixed set of real inputs with human-checked labels or expected outputs, re-run after every prompt, model or code change.'],
  'precision': ['Precision', 'Of everything predicted positive, the share that really is: TP / (TP + FP).'],
  'recall': ['Recall', 'Of everything that really is positive, the share you caught: TP / (TP + FN).'],
  'train-test-split': ['Train/test split', 'Holding out data the model never trains on, so its score reflects new, unseen inputs.'],
  'labeled-data': ['Labeled data', 'Examples paired with the correct answer, produced by people or a trusted process. The raw material for training and evals.'],
  'overfitting': ['Overfitting', 'Learning the training data (including its noise) so closely that performance on new data gets worse.'],
  'confusion-matrix': ['Confusion matrix', 'A table counting every (true label, predicted label) pair. The diagonal is correct; the rest shows which classes get confused.']
});
