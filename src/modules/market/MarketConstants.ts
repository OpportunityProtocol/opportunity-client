import { ICarouselItemProp } from "./MarketInterface"

const loggedOutHeroCarouselItems: ICarouselItemProp[] = [
    {
        title: 'Learn how gig markets work on GigEarth',
        subtitle: 'No central interferance and low fees',
        onClick: () => { },
        buttonTitle: 'Learn more',
        source: '/assets/images/carousel_one.jpeg',
    },
    {
        title: 'Start your freelancing career today',
        subtitle: 'Begin working regardless of geographical location or social class',
        onClick: () => { },
        buttonTitle: 'Learn more',
        source: '/assets/images/carousel_two.jpeg',
    },
    {
        title: 'Decentralized arbitrations and payouts',
        subtitle: 'No central interferance and low fees',
        onClick: () => { },
        buttonTitle: 'Learn more',
        source: '/assets/images/carousel_three.jpeg',
    },
]

const timelineButtons: Array<string> = ['1H', '1D', '1W', '1Y', 'All']

export { loggedOutHeroCarouselItems, timelineButtons }