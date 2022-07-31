import { MouseEventHandler } from "react";
import { RelationshipStruct } from "../../typechain-types/IGigEarth";

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
    data: RelationshipStruct;
  }

  export type { ICarouselItemProp, ICarouselItemProps, IJobDisplayProps }