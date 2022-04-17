interface ICarouselItemProp {
    source: string,
    title: string,
    subtitle: string,
    onClick: () => {},
    buttonTitle: string
  }

  interface ICarouselItemProps {
    item: ICarouselItemProp,
    itemLength: number,
    index: number,
  }

  interface IJobDisplayProps {
    avatar?: string;
    suggestion: boolean;
  }

  export type { ICarouselItemProp, ICarouselItemProps, IJobDisplayProps }