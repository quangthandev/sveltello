export interface Photo {
	id: string;
	thumbUrl: string;
	fullUrl?: string;
	htmlLink?: string;
	alt: string | null;
	username?: string;
}
