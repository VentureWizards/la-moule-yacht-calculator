import { create } from "zustand";

enum SlideDirection {
  prev,
  next,
}

interface AnimationState {
  slideDirection: SlideDirection;
  setSlideDirection: (direction: SlideDirection) => void;
}

const useAnimationStore = create<AnimationState>((set) => ({
  slideDirection: SlideDirection.next,
  setSlideDirection: (direction: SlideDirection) =>
    set({
      slideDirection: direction,
    }),
}));

export { useAnimationStore, SlideDirection };
