import { DropTargetMonitor } from "react-dnd";

/** Monkey-patches React DnD so that it doesn't throw an error if a drop target is removed */
export const fixRegistry = (monitor: DropTargetMonitor) => {
  const registry = (monitor as any).internalMonitor.registry;

  if (!registry._fixed) {
    const getTarget = registry.getTarget;
    registry.getTarget = function() {
      return (
        getTarget.apply(this, arguments) || { fake: true, hover: () => {} }
      );
    };
    registry._fixed = true;
  }
};
