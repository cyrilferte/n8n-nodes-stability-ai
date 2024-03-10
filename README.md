![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-_stabiity-ai_

This is an n8n community node. It lets you use _Stability AI_ in your n8n workflows.

_Stability AI_ is an API for AI generated images.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

This project is still in development and currently only works locally. Follow these steps to install n8n locally:

1. Install n8n globally using npm: `npm install n8n -g`
2. Clone this repository and navigate into it.
3. Run `npm install` to install the necessary dependencies.
4. Run `npm run build` to build the package.
5. Run `npm link` to link the package to your local n8n instance.

### Troubleshooting

There's no custom directory in ~/.n8n local installation.
You have to create custom directory manually and run npm init

```
# In ~/.n8n directory run
mkdir custom
cd custom
npm init
``` 
### After npm deploy

Add n8n-nodes-stabiity-ai to community node settings. Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

_Text to image generation_

## Credentials

You need an API key to use this node. You can get one by signing up at [Stability AI](https://stability.ai/) and creating a new API key in the [account settings](https://platform.stability.ai/account/keys).

## Compatibility

This node has been tested with n8n version 1.31.2.

## Usage

The output of this node is a base64 encoded image.

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* [Stability AI API documentation](https://platform.stability.ai/docs)

## Roadmap

- [x] Text to image generation
  - [x] Basic text to image generation
  - [x] Add negative prompt option
  - [x] Add style options
  - [x] Basic settings (cfg, steps, seed)
  - [ ] Add image size options
- [ ] Image to image generation
- [ ] Image upscale
- [ ] Image to image with masking
- [ ] Image to video generation
- [ ] Image to image with Inpainting (remove and replace objects from images)

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

### Fork the Project

1. Create your Feature Branch (git checkout -b feature/AmazingFeature)
2. Commit your Changes (git commit -m 'Add some AmazingFeature')
3. Push to the Branch (git push origin feature/AmazingFeature)
4. Open a Pull Request

## License

This project is licensed under the [MIT License](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md).
