import { API } from '../../api';

import { Attachment } from './attachment';

import { pickProperties } from '../../utils/helpers';
import { AttachmentType, kSerializeData } from '../../utils/constants';

const { POLL } = AttachmentType;

export interface IPollAttachmentPayload {
	id: number;
	owner_id: number;
	access_key?: string;

	anonymous?: number;
	multiple?: number;
	closed?: number;
	is_board?: number;
	can_edit?: number;
	can_vote?: number;
	can_report?: number;
	can_share?: number;
	author_id?: number;
	question?: string;
	created?: number;
	end_date?: number;
	votes?: number;
	answer_ids?: number[];
	friends?: number[];
	answers?: {
		id: number;
		text: string;
		votes: number;
		rate: number;
	}[];
	background?: object[];
	photo?: object;
}

export class PollAttachment extends Attachment<IPollAttachmentPayload> {
	/**
	 * Constructor
	 */
	public constructor(payload: IPollAttachmentPayload, api?: API) {
		super(POLL, payload.owner_id, payload.id, payload.access_key);

		// @ts-expect-error
		this.api = api;
		this.payload = payload;

		this.$filled = payload.answers !== undefined;
	}

	/**
	 * Load attachment payload
	 */
	public async loadAttachmentPayload(): Promise<void> {
		if (this.$filled) {
			return;
		}

		// @ts-expect-error
		const [poll] = await this.api.polls.getById({
			poll_id: this.id,
			owner_id: this.ownerId
		});

		this.payload = poll;

		if (this.payload.access_key) {
			this.accessKey = this.payload.access_key;
		}

		this.$filled = true;
	}

	/**
	 * Checks whether the poll is anonymous
	 */
	public get isAnonymous(): boolean | undefined {
		if (!this.$filled) {
			return undefined;
		}

		return Boolean(this.payload.anonymous);
	}

	/**
	 * Checks whether the poll allows multiple choice of answers
	 */
	public get isMultiple(): boolean | undefined {
		if (!this.$filled) {
			return undefined;
		}

		return Boolean(this.payload.multiple);
	}

	/**
	 * Checks whether the poll is complete
	 */
	public get isClosed(): boolean | undefined {
		if (!this.$filled) {
			return undefined;
		}

		return Boolean(this.payload.closed);
	}

	/**
	 * Check whether questions are attached to the discussion
	 */
	public get isBoard(): boolean | undefined {
		if (!this.$filled) {
			return undefined;
		}

		return Boolean(this.payload.is_board);
	}

	/**
	 * Check if can edit the poll
	 */
	public get isCanEdit(): boolean | undefined {
		if (!this.$filled) {
			return undefined;
		}

		return Boolean(this.payload.can_edit);
	}

	/**
	 * Check if can vote in the survey
	 */
	public get isCanVote(): boolean | undefined {
		if (!this.$filled) {
			return undefined;
		}

		return Boolean(this.payload.can_vote);
	}

	/**
	 * Check if can complain about the poll
	 */
	public get isCanReport(): boolean | undefined {
		if (!this.$filled) {
			return undefined;
		}

		return Boolean(this.payload.can_report);
	}

	/**
	 * Check if can share a survey
	 */
	public get isCanShare(): boolean | undefined {
		if (!this.$filled) {
			return undefined;
		}

		return Boolean(this.payload.can_share);
	}

	/**
	 * Returns the ID of the poll author
	 */
	public get authorId(): number | undefined {
		return this.payload.author_id;
	}

	/**
	 * Returns the question text
	 */
	public get question(): string | undefined {
		return this.payload.question;
	}

	/**
	 * Returns the date when this poll was created
	 */
	public get createdAt(): number | undefined {
		return this.payload.created;
	}

	/**
	 * Returns the end date of the poll in Unixtime. 0, if the poll is unlimited
	 */
	public get endedAt(): number | undefined {
		return this.payload.end_date;
	}

	/**
	 * Returns the number of votes
	 */
	public get votes(): number | undefined {
		return this.payload.votes;
	}

	/**
	 * Returns the identifiers of the response options selected by the current user
	 */
	public get answerIds(): number[] | undefined {
		return this.payload.answer_ids;
	}

	/**
	 * Returns the identifiers of 3 friends who voted in the poll
	 */
	public get friends(): number[] | undefined {
		if (!this.$filled) {
			return undefined;
		}

		return this.payload.friends || [];
	}

	/**
	 * Returns the information about the options for the answer
	 */
	public get answers(): object[] | undefined {
		return this.payload.answers;
	}

	/**
	 * Returns the poll snippet background
	 */
	public get background(): object[] | undefined {
		return this.payload.background;
	}

	/**
	 * Returns a photo - the poll snippet background
	 */
	public get photo(): object | undefined {
		return this.payload.photo;
	}

	/**
	 * Returns the custom data
	 */
	public [kSerializeData](): object {
		return pickProperties(this, [
			'authorId',
			'question',
			'createdAt',
			'endedAt',
			'votes',
			'answerIds',
			'friends',
			'answers',
			'background',
			'photo'
		]);
	}
}
