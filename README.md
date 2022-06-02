[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-c66648af7eb3fe8bc4f294546bfd86ef473780cde1dea487d3c4ff354943c9ae.svg)](https://classroom.github.com/online_ide?assignment_repo_id=7943839&assignment_repo_type=AssignmentRepo)
<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">myawesometool</h3>

  <p align="center">
    A CLI tool to automatically check for dependency of a specified package and then create a PR updating the package.
    <br />
    <a href="https://github.com/dyte-submissions/dyte-vit-2022-Aritra779"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/dyte-submissions/dyte-vit-2022-Aritra779">View Demo</a>
    ·
    <a href="https://github.com/dyte-submissions/dyte-vit-2022-Aritra779/issues">Report Bug</a>
    ·
    <a href="https://github.com/dyte-submissions/dyte-vit-2022-Aritra779/issues">Request Feature</a>
  </p>
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
        <li><a href="#how_to_use">How to use</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

*Currently works with only github.*

*Currently works for versions with '^' and '~' notation. Compatibility update coming soon.*

This project is about building a simple CLI tool that will look through a file(currently only .csv file) and let the user know about the version of specified dependency of a project/repo listed in the file. It also writes the same info onto the file.

In addition to that if the version is below specified version it'll automatically `fork`, `clone`, `update`, `push` and `create a PR` to the original repo. Provided we tell it to do so.
<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [nodeJS](https://nodejs.org/)
* [npm](https://www.npmjs.com/)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

In order to use this project/ repo / tool there are certain pre-requisites. 
* node
* npm
  ```sh
  npm install npm@latest -g
  ```
* A code Editor (e.g., Visual Studio, VS Code, Sublime Text, Atom etc.)

### Installation

1. Get your personal access token from github(required only when using the `-u` option. Not required for the `-i` option). Follow this for creating your PAT(Personal Access Token) [Creating a personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)
2. Clone the repo
   ```sh
   git clone https://github.com/dyte-submissions/dyte-vit-2022-Aritra779.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. (Optionally required for `-u` option) Enter your PAT(Personal Access Token) in a `.env` file in `G_TOKEN` variable. Change the name everywhere if you wish.
   ```
   G_TOKEN = 'ENTER YOUR PAT'
   ```

<p align="right">(<a href="#top">back to top</a>)</p>

### How to use

* Move into the project directory from command line / shell / bash
  ```sh
  cd dyte-vit-2022-Aritra779
  ```
* For help run
  ```sh
  myawesometool -h
  ``` 
  or 
  ```sh
  myawesometool --help
  ```
* For reading a CSV file and listing out dependency version satisfiability status run 
  ```sh
  myawesometool -i <somefile.csv> <package_name@version>
  ``` 
*  For creating an automated PR(pull request) along with the above task run
```sh
myswesometool -update -i <somefile.csv> <package_name@version>
``` 
  **This requires github PAT.**
* ```sh
  npm test
  ``` 
is currently incomplete. Only fork test is implemented. The API call is mocked. You can test it out without a worry. 
* don't run it outside of the project directory for the time being (*will be looked into later*)
* A lot(most if not all w.r.t experienced people) of the logic makes no sence (specially asynchoronous ones). This was developed with *'have to work anyhow'* in mind and not *'should be logically sound'*. 
* Currently the code does not delete the locally cloned repository. So delete them manually. (*Will try to automate as soon as possible*)
* There's a sample_d.csv file with two repo links. (optinal)Delete the last 3 columns(everything except `name` and `repo` column). First repo doesn't have `axios`. It's my personal repo. Second one has `axios 0.23.0`. So for testing test with anything higher than that.
<!-- USAGE EXAMPLES -->
## Usage

![-i option](images/i_option.png)
![npm test](images/test.png)
![-u option ss1](images/u_option_1.png)
![-u option ss2](images/u_option_2.png)
![-u option ss3](images/u_option_3.png)
<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap
- [x] ~~Basic Documention (<span style = 'color : red'>High Priority</span>)~~
- [ ] More Documention (<span style = 'color : Yellow'>Normal Priority</span>)
- [ ] `npm test` (<span style = 'color : orange'>High Priority</span>)
- [ ] Move from *'have to work anyhow'* to *'should be logically sound'* (<span style = 'color : red'>High Priority</span>)
- [ ] reduce dependency (<span style = 'color : yellow'>Normal Priority</span>)
    - [ ] csv-parser (<span style = 'color : green'>Low Priority</span>)
    - [ ] csv-writer (<span style = 'color : green'>Low Priority</span> )
    - [ ] get-repo-package-json (<span style = 'color : red'>High Priority</span>)
    - [ ] github-url-to-object (<span style = 'color : blue'>Not Likely</span>)
    - [ ] chalk (<span style = 'color : blue'>probably Not</span>)
    - [ ] commander (<span style = 'color : blue'>When there's a better option available</span>)
- [ ] Robustness (<span style = 'color : yellow'>Normal Priority</span>)
- [ ] More features I can't think of right now (<span style = 'color : green'>Low Priority</span>)

<p align="right">(<a href="#top">back to top</a>)</p>



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

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Aritra Dutta - aritra.dutta.366@gmail.com

Project Link: [https://github.com/dyte-submissions/dyte-vit-2022-Aritra779](https://github.com/dyte-submissions/dyte-vit-2022-Aritra779)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/dyte-submissions/dyte-vit-2022-Aritra779/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/dyte-submissions/dyte-vit-2022-Aritra779/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/dyte-submissions/dyte-vit-2022-Aritra779/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/dyte-submissions/dyte-vit-2022-Aritra779/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/dyte-submissions/dyte-vit-2022-Aritra779/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/aritra-dutta-6943a1222/
[product-screenshot]: images/screenshot.png
