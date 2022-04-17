import { ICarouselItemProp } from "./MarketInterface"

const loggedOutHeroCarouselItems: ICarouselItemProp[] = [
    {
        title: 'Learn how gig markets work on GigEarth',
        subtitle: 'No central interferance and low fees',
        onClick: () => { },
        buttonTitle: 'Learn more',
        source: '/assets/images/landingpagepic1.png',
    },
    {
        title: 'Learn how gig markets work on GigEarth',
        subtitle: 'No central interferance and low fees',
        onClick: () => { },
        buttonTitle: 'Learn more',
        source: '/assets/images/writing.jpeg',
    },
    {
        title: 'Learn how gig markets work on GigEarth',
        subtitle: 'No central interferance and low fees',
        onClick: () => { },
        buttonTitle: 'Learn more',
        source: '/assets/images/design.jpeg',
    },
]

const timelineButtons: Array<string> = ['1H', '1D', '1W', '1Y', 'All']

export { loggedOutHeroCarouselItems, timelineButtons }