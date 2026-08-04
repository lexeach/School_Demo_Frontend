import { useRef, useEffect } from 'react';

function useDependentEffect(effect: () => void, dependencies: any[]) {
  const previousDependencies = useRef<any[]>(dependencies);

  useEffect(() => {
    const dependenciesChanged = dependencies.some(
      (dependency, index) => dependency !== previousDependencies.current[index],
    );

    if (dependenciesChanged) {
      effect();
    }

    previousDependencies.current = dependencies;
  }, dependencies);
}

export default useDependentEffect;
