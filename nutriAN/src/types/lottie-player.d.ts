import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lottie-player": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        background?: string;
        speed?: number | string;
        loop?: boolean;
        autoplay?: boolean;
        style?: CSSProperties;
      };
    }
  }
}

export {};
