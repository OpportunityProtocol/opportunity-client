<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/elijahhampton/opportunity-client">
    <img src="public/assets/logo.svg" alt="Logo" width="150" height="150">
  </a>
<h3 align="center">Lens Talent</h3>
</div>


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <!--<li><a href="#roadmap">Roadmap</a></li>-->
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
<div align="left">
      Lens Talent is a decentralized and permission-less job board that allows anyone (freelancers and employers) to post bounties, contracts or services. Employers are able to create one time contracts that freelancers may accept, while freelancers are able to create long term services in which employers can invest in in order to bet on their success and quality of work. Through this method freelancers are incentivized to always provide the best quality work as it means a higher chance of passive income. Bounties, contracts and services created on Lens Talent have the ability to gain exposure across any networking application that interfaces with Lens Protocol. We imagine a world where anyone can instantly find work at any moment and carry their services across any network based application. Welcome to the cooperation layer of the internet.
  </div>


### Built With

* [Next.js](https://nextjs.org/)
* [React.js](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Material-UI](https://mui.com/)
* [The Graph](https://thegraph.com/en/)
* [IPFS](https://ipfs.io/)
* [Firebase](https://firebase.google.com/)
* [Solidity](https://docs.soliditylang.org/en/v0.8.14/)
* [EthersJS](https://docs.ethers.io/v5/)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

You will need to create a .env.development file with the following environment variabels:


```sh
Alchemy (You can obtain a free API key from https://auth.alchemy.com)
NEXT_PUBLIC_ALCHEMY_API_KEY=
NEXT_PUBLIC_ALCHEMY_HTTPS=
NEXT_PUBLIC_CHAIN_ID=1337
NEXT_PUBLIC_CHAIN_ENV=development
NEXT_PUBLIC_RPC_URL=

Smart Contracts
NEXT_PUBLIC_LENS_HUB=
NEXT_PUBLIC_NETWORK_MANAGER_ADDRESS=
NEXT_PUBLIC_INTEREST_MANAGER_AAVE=0
NEXT_PUBLIC_TOKEN_FACTORY_ADDRESS=
NEXT_PUBLIC_SERVICE_TOKEN_LOGIC_ADDRESS=
NEXT_PUBLIC_TOKEN_EXCHANGE_ADDRESS=
NEXT_PUBLIC_DAI_ADDRESS=
NEXT_PUBLIC_LENS_INTERACTION_LOGIC=
NEXT_PUBLIC_LENS_FREE_FOLLOW_MODULE=
NEXT_PUBLIC_FEE_COLLECT_MODULE=
NEXT_PUBLIC_FOLLOWER_ONLY_REFERENCE_MODULE=

Subgraph (The Graph)
NEXT_PUBLIC_APP_SUBGRAPH_ENDPOINT=

Cloud Firestore (Messaging)
NEXT_PUBLIC_API_KEY=
NEXT_PUBLIC_AUTH_DOMAIN=
NEXT_PUBLIC_DATABASE_URL=
NEXT_PUBLIC_PROJECT_ID=
NEXT_PUBLIC_STORAGE_BUCKET=
NEXT_PUBLIC_MESSAGING_SENDER_ID=
NEXT_PUBLIC_APP_ID=

Fleek (IPFS)
NEXT_PUBLIC_FLEEK_HOSTING_API_KEY=
NEXT_PUBLIC_FLEEK_STORAGE_API_SECRET=
NEXT_PUBLIC_FLEEK_STORAGE_API_KEY=
```

### Installation

1. You will need an alchemy api key to run the client locally. Get a free Alchemy API Key at ([https://example.com](https://www.alchemy.com/)) You will need to create a .env file and add the variables from the .env_template.
2. Clone the repo
   ```sh
   git clone https://github.com/OpportunityProtocol/opportunity-client.git
   ```
3. Install NPM packages
   ```sh
   yarn install
   ```
4. Run the client locally
   ```sh
   yarn start:local
   ```

<!-- ROADMAP -->
## Roadmap

Our roadmap consist of a set of goals to bring our application closer to a completely decentralized state and to provide a smooth experience for users.

- [ ] Complete a basic MVP that is deployed on Vercel (client) and the Polygon Mumbai testnet (smart contracts).
- [ ] Implement gasless transactions on Lens Protocol.
- [ ] Complete a smart contract audit.
- [ ] Deploy protocol to the Polygon mainnet.

See the [open issues](https://github.com/elijahhampton/opportunity-client/issues) for a full list of proposed features (and known issues).

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

Elijah Hampton - [@elihampton_](https://twitter.com/elihampton_) - elijahhamptonj@proton.me

Project Link: Contact us for a free demo!

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/elijahhampton/opportunity-client.svg?style=for-the-badge
[contributors-url]: https://github.com/elijahhampton/opportunity-client/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/elijahhampton/opportunity-client.svg?style=for-the-badge
[forks-url]: https://github.com/elijahhampton/opportunity-client/network/members
[stars-shield]: https://img.shields.io/github/stars/elijahhampton/opportunity-client.svg?style=for-the-badge
[stars-url]: https://github.com/elijahhampton/opportunity-client/stargazers
[issues-shield]: https://img.shields.io/github/issues/elijahhampton/opportunity-client.svg?style=for-the-badge
[issues-url]: https://github.com/elijahhampton/opportunity-client/issues
[license-shield]: https://img.shields.io/github/license/elijahhampton/opportunity-client.svg?style=for-the-badge
[license-url]: https://github.com/elijahhampton/opportunity-client/blob/master/LICENSE.txt
