import {
	IBinaryKeyData, IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import FormData from 'form-data';
//import fetch from 'node-fetch'
import * as fs from "fs";


// import fs from 'node:fs'


export class StabilityAiNode implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Stability AI Node',
		name: 'stabilityAiNode',
		group: ['transform'],
		version: 1,
		description: 'Generate images using Stability AI',
		defaults: {
			name: 'Stability AI Node',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'stabilityAiApi',
				required: true,
			},
		],
		requestDefaults: {
			method: 'POST',
			baseURL: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: "Mode",
				name: "mode",
				type: "options",
				noDataExpression: true,
				options: [
					{
						name: "Text to Image",
						value: "text-to-image",
					},
					{
						name: "Image to Image",
						value: "image-to-image",
					},
				],
				default: "text-to-image",
			},
			{
				displayName: 'Model',
				name: 'model',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						mode: [
							'text-to-image',
							'image-to-image',
						],
					},
				},
				options: [
					{
						name: 'Stable Diffusion XL 1.0',
						value: 'stable-diffusion-xl-1024-v1-0',
					},
					{
						name: 'Stable Diffusion 1.6',
						value: 'stable-diffusion-v1-6',
					},
				],
				default: 'stable-diffusion-xl-1024-v1-0',
			},
			{
				displayName: 'Image',
				name: 'image_url',
				type: 'string',
				displayOptions: {
					show: {
						mode: [
							'image-to-image',
						],
					},
				},
				default: "",
				description: 'The image to use as input',
			},
			{
				displayName: 'Prompt',
				name: 'text_prompt',
				type: 'string',
				default: 'cute cavalier king charles dog',
				required: true,
				placeholder: 'a dog in the forest',
				description: 'The description text',
			},
			{
				displayName: 'Negative Prompt',
				name: 'negative_text_prompt',
				type: 'string',
				default: '',
				placeholder: 'cat',
				description: 'Negative text prompt',
			},
			{
				displayName: 'More Options',
				name: 'moreOptions',
				type: 'collection',
				default: {},
				placeholder: 'Add Options',
				displayOptions: {
					show: {
						mode: [
							'text-to-image',
							'image-to-image',
						],
					},
				},
				options: [
					{
						displayName: 'Style',
						name: 'style',
						type: 'options',
						noDataExpression: false,
						options: [
							{
								name: '3D Model',
								value: '3d-model',
							},
							{
								name: 'Analog Film',
								value: 'analog-film',
							},
							{
								name: 'Anime',
								value: 'anime',
							},
							{
								name: 'Cinematic',
								value: 'cinematic',
							},
							{
								name: 'Comic Book',
								value: 'comic-book',
							},
							{
								name: 'Digital Art',
								value: 'digital-art',
							},
							{
								name: 'Enhance Fantasy Art',
								value: 'enhance-fantasy-art',
							},
							{
								name: 'Isometric',
								value: 'isometric',
							},
							{
								name: 'Line Art',
								value: 'line-art',
							},
							{
								name: 'Low Poly',
								value: 'low-poly',
							},
							{
								name: 'Modeling Compound',
								value: 'modeling-compound',
							},
							{
								name: 'Neon Punk',
								value: 'neon-punk',
							},
							{
								name: 'Origami',
								value: 'origami',
							},
						],
						default: "anime",
					},
					{
						displayName: 'Steps',
						name: 'steps',
						type: 'number',
						default: 40,
						description: 'The number of steps to take (more than 10)',
					},
					{
						displayName: 'CFG Scale',
						name: 'cfgScale',
						type: 'number',
						default: 5,
						description: 'Guidance Scale (4 - 14 typically)',
					},
				],
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let mode = this.getNodeParameter('mode', 0) as string;
		let model = this.getNodeParameter('model', 0) as string;
		let text_prompt = this.getNodeParameter('text_prompt', 0) as string;
		let negative_text_prompt = this.getNodeParameter('negative_text_prompt', 0) as string;
		let moreOptions = this.getNodeParameter('moreOptions', 0) as IDataObject;


		let style = moreOptions?.style as string;
		let steps = moreOptions?.steps as number;
		let cfg_scale = moreOptions?.cfgScale as number;

		if (!model) {
			throw new NodeOperationError(this.getNode(), 'Please select a model.');
		}
		if (!text_prompt) {
			throw new NodeOperationError(this.getNode(), 'Please enter a prompt.');
		}
		if (steps && steps < 10) {
			throw new NodeOperationError(this.getNode(), 'Steps must be more than 10.');
		}

		let body: any = {
			steps: 40,
			width: 1024,
			height: 1024,
			seed: 0,
			cfg_scale: 5,
			samples: 1,
			style: 'None',
			text_prompts: [
				{
					text: text_prompt,
					weight: 1,
				},
			],
		};

		if (negative_text_prompt) {
			body.text_prompts.push({
				text: negative_text_prompt,
				weight: -1,
			});
		}

		if (style) {
			body.style = style;
		}

		if (steps) {
			body.steps = steps;
		}

		if (cfg_scale) {
			body.cfg_scale = cfg_scale;
		}

		let response;
		if (mode == 'image-to-image') {
			let image_url = this.getNodeParameter('image_url', 0) as string;
			const formData = new FormData();

			// prepare binary data
			const input_blob = Buffer.from(image_url, 'base64');
			const binary: IBinaryKeyData = {};
			binary!['input_data'] = await this.helpers.prepareBinaryData.call(
				this,
				input_blob,
				`nik.png`,
				'image/png',
			);
			fs.writeFile('./nik.png', input_blob, (err) => {
					if (err) {
						console.error(err)
						return
					}
				}
			)



			formData.append('init_image', fs.readFileSync('./nik.png'), {
				'filename': 'nik.png'

			})

			formData.append('init_image_mode', 'IMAGE_STRENGTH')
			formData.append('image_strength', 0.35)
			formData.append('text_prompts[0][text]', 'Galactic dog wearing a cape')
			formData.append('cfg_scale', 7)
			formData.append('samples', 1)
			formData.append('steps', 20)
			/*response = await fetch(
				`https://api.stability.ai/v1/generation/${model}/${mode}`,
				{
					method: 'POST',
					body: formData,
					headers: {
						...formData.getHeaders(),
						'Content-Type': "multipart/form-data",
						'Authorization': `Bearer ${ (await this.getCredentials('stabilityAiApi')).apiKey}`,
					},
				},
			)*/
			response = await this.helpers.requestWithAuthentication.call(this, 'stabilityAiApi', {
				body: formData,
				method: 'POST',
				json: true,
				uri: `https://api.stability.ai/v1/generation/${model}/${mode}`,
				headers: {
					...formData.getHeaders(),
					'Content-Type': "multipart/form-data",
					'Accept': 'image/png',

				},
			}).then((response) => {
                console.log(" #### wait response", response)
                return response;
            }).catch((error) => {
                console.log("error", error)
                return error;
            })

		}


		// Make an API request with requestWithAuthentication
		if (mode == 'text-to-image') {
			response = await this.helpers.requestWithAuthentication.call(this, 'stabilityAiApi', {
				body,
				method: 'POST',
				json: true,
				uri: `https://api.stability.ai/v1/generation/${model}/${mode}`,
				headers: {

					'Content-Type': "application/json",
				},
			});

		}

		console.log("response", response)
		// Map data to n8n data
		const base64_image = response?.artifacts![0].base64;
		const seed = response?.artifacts[0].seed;

		// base64 image to blob
		const blob = Buffer.from(base64_image, 'base64');
		const binary: IBinaryKeyData = {};

		binary!['data'] = await this.helpers.prepareBinaryData.call(
			this,
			blob,
			`nik_${seed}.png`,
			'image/png',
		);
		const json = response.artifacts;
		const result: INodeExecutionData = {
			json,
			binary,
		};
		return [[result]];
	}
}

