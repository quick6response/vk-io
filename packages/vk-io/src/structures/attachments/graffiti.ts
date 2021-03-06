import { API } from '../../api';

import { Attachment } from './attachment';

import { pickProperties } from '../../utils/helpers';
import { AttachmentType, kSerializeData } from '../../utils/constants';

const { GRAFFITI } = AttachmentType;

export interface IGraffitiAttachmentPayload {
	id: number;
	owner_id: number;
	access_key?: string;

	height?: number;
	width?: number;
	url?: string;
}

export class GraffitiAttachment extends Attachment<IGraffitiAttachmentPayload> {
	/**
	 * Constructor
	 */
	public constructor(payload: IGraffitiAttachmentPayload, api?: API) {
		super(GRAFFITI, payload.owner_id, payload.id, payload.access_key);

		// @ts-expect-error
		this.api = api;
		this.payload = payload;

		this.$filled = payload.url !== undefined;
	}

	/**
	 * Load attachment payload
	 */
	public async loadAttachmentPayload(): Promise<void> {
		if (this.$filled) {
			return;
		}

		const [document] = await this.api.docs.getById({
			docs: `${this.ownerId}_${this.id}`
		});

		this.payload = document;

		if (this.payload.access_key) {
			this.accessKey = this.payload.access_key;
		}

		this.$filled = true;
	}

	/**
	 * Returns the graffiti height
	 */
	public get height(): number | undefined {
		return this.payload.height;
	}

	/**
	 * Returns the graffiti width
	 */
	public get width(): number | undefined {
		return this.payload.width;
	}

	/**
	 * Returns the URL of the document
	 */
	public get url(): string | undefined {
		return this.payload.url;
	}

	/**
	 * Returns the custom data
	 */
	public [kSerializeData](): object {
		return pickProperties(this, [
			'height',
			'width',
			'url'
		]);
	}
}
