/** Cache only a public readiness boolean, never identities, session proof or data. */
export function cachedCheck(check: () => Promise<boolean>, now = Date.now) {
  let expires = 0;
  let value = false;
  let pending: Promise<boolean> | undefined;
  return () => {
    if (pending) return pending;
    if (now() < expires) return Promise.resolve(value);
    pending = Promise.resolve()
      .then(check)
      .catch(() => false)
      .then((result) => {
        value = result === true;
        expires = now() + 30_000;
        return value;
      })
      .finally(() => {
        pending = undefined;
      });
    return pending;
  };
}
