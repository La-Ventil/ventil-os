import { useCallback, type MouseEvent, type MouseEventHandler } from 'react';

type UserNetworkGraphNodeLifecycleHandlers = {
  onFocusNode: (userId: string) => void;
  onBlurNode: (userId: string) => void;
  onTogglePin: (userId: string) => void;
};

export type UseUserNetworkGraphNodeInteractionProps = UserNetworkGraphNodeLifecycleHandlers & {
  userId: string;
};

export type UseUserNetworkGraphNodeInteractionReturn = {
  onMouseEnter: MouseEventHandler<HTMLElement>;
  onMouseLeave: MouseEventHandler<HTMLElement>;
  onFocus: () => void;
  onBlur: () => void;
  onClick: MouseEventHandler<HTMLElement>;
};

export function useUserNetworkGraphNodeInteraction({
  userId,
  onFocusNode,
  onBlurNode,
  onTogglePin
}: UseUserNetworkGraphNodeInteractionProps): UseUserNetworkGraphNodeInteractionReturn {
  const activate = useCallback(() => {
    onFocusNode(userId);
  }, [onFocusNode, userId]);

  const deactivate = useCallback(() => {
    onBlurNode(userId);
  }, [onBlurNode, userId]);

  const handleMouseEnter = useCallback(() => {
    onFocusNode(userId);
  }, [onFocusNode, userId]);

  const handleMouseLeave = useCallback(() => {
    onBlurNode(userId);
  }, [onBlurNode, userId]);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      onTogglePin(userId);
    },
    [onTogglePin, userId]
  );

  return {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: activate,
    onBlur: deactivate,
    onClick: handleClick
  };
}
