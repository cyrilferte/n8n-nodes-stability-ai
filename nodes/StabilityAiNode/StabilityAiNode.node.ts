import {
	IBinaryKeyData,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import {MoreOptions} from "./StabilityAiNode.type";

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
				displayName: 'Model',
				name: 'model',
				type: 'options',
				noDataExpression: true,
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
					{
						displayName: 'Seed',
						name: 'seed',
						type: 'number',
						default: 0,
						description: 'Seed for randomness',
					},
				],
			},
		],
	};


	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const [model, text_prompt, negative_text_prompt, moreOptions] = [
			this.getNodeParameter('model', 0) as string,
			this.getNodeParameter('text_prompt', 0) as string,
			this.getNodeParameter('negative_text_prompt', 0) as string,
			this.getNodeParameter('moreOptions', 0) as MoreOptions,
		]

		const body = {
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

		if (moreOptions?.style) {
			body.style = moreOptions.style;
		}

		if (moreOptions?.steps) {
			body.steps = moreOptions.steps;
		}

		if (moreOptions?.cfgScale) {
			body.cfg_scale = moreOptions.cfgScale;
		}

		if (moreOptions?.seed) {
			body.seed = moreOptions.seed;
		}

		const response = await this.helpers.requestWithAuthentication.call(this, 'stabilityAiApi', {
			body,
			method: 'POST',
			json: true,
			uri: `https://api.stability.ai/v1/generation/${model}/text-to-image`,
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const base64_image = response.artifacts[0].base64;
		const output_seed = response.artifacts[0].seed;
		const blob = Buffer.from(base64_image, 'base64');
		const binary: IBinaryKeyData = {};
		binary['data'] = await this.helpers.prepareBinaryData.call(
			this,
			blob,
			`nik_${output_seed}.png`,
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
