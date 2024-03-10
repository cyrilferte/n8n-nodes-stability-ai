![Banner image](https://user-images.githubusercontent.com/10284570/173569848-c624317f-42b1-45a6-ab09-f0ea3c247648.png)

# n8n-nodes-_stabiity-ai_

This is an n8n community node. It lets you use _Stability AI_ in your n8n workflows.

_Stability AI_ is an API for AI generated images.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)  
[Operations](#operations)  
[Credentials](#credentials)  <!-- delete if no auth needed -->  
[Compatibility](#compatibility)  
[Usage](#usage)  <!-- delete if not using this section -->  
[Resources](#resources)  
[Version history](#version-history)  <!-- delete if not using this section -->



## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Operations

_Text to image generation_

## Credentials

_You need an API key to use this node. You can get one by signing up at [Stability AI](https://stability.ai/) and creating a new API key in the [account settings](https://platform.stability.ai/account/keys)._

## Compatibility

_only tested with the 1.31.2 version_

## Usage

_the output of this node is an base64 encoded image_


## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
* _[Stability AI API documentation](https://platform.stability.ai/docs)_

## Roadmap
	
- [x] Text to image generation
	- [x] Basic text to image generation
  - [x] add negative prompt option
  - [x] add style options
  - [x] basic settings (cfg, steps, seed)
  - [ ] add image size options
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

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
