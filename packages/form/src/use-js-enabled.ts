import { useEffect, useState } from 'react';

export function useJsEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(true);
  }, []);

  return enabled;
}
