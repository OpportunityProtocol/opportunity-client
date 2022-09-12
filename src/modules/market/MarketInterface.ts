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
    data: any;
    table?: boolean;
  }

  export type { ICarouselItemProp, ICarouselItemProps, IJobDisplayProps }