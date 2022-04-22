import { MouseEventHandler } from "react";

interface ICarouselItemProp {
    source: string,
    title: string,
    subtitle: string,
    onClick: MouseEventHandler<HTMLDivElement>,
    buttonTitle: string
  }

  interface ICarouselItemProps {
    item: ICarouselItemProp,
    itemLength: number,
    index: number,
  }

  interface IJobDisplayProps {
    hasButton?: boolean,
    avatar?: string;
    suggestion?: boolean;
    showReferralButton: boolean;
  }

  export type { ICarouselItemProp, ICarouselItemProps, IJobDisplayProps }