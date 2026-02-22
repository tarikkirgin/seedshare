<script lang="ts" module>
	import {
		File,
		FileText,
		FileImage,
		FileCode,
		FileSpreadsheet,
		FileType,
		FileChartPie,
		FileArchive,
		FileKey,
		FileVolume,
		FileDigit,
		FilePlay,
		FileBraces,
		Icon as IconType
	} from '@lucide/svelte';

	type LucideIcon = typeof IconType;

	const exactMap: Record<string, LucideIcon> = {
		'text/html': FileCode,
		'text/css': FileCode,
		'text/csv': FileSpreadsheet,
		'text/javascript': FileCode,
		'text/typescript': FileCode,
		'text/xml': FileCode,
		'text/markdown': FileText,

		'application/pdf': FileType,
		'application/msword': FileText,
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
		'application/vnd.ms-excel': FileSpreadsheet,
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileSpreadsheet,
		'application/vnd.ms-powerpoint': FileChartPie,
		'application/vnd.openxmlformats-officedocument.presentationml.presentation': FileChartPie,

		'application/json': FileBraces,
		'application/ld+json': FileBraces,
		'application/xml': FileCode,
		'application/javascript': FileCode,
		'application/typescript': FileCode,
		'application/wasm': FileDigit,

		'application/zip': FileArchive,
		'application/x-tar': FileArchive,
		'application/x-gzip': FileArchive,
		'application/x-bzip2': FileArchive,
		'application/x-7z-compressed': FileArchive,
		'application/x-rar-compressed': FileArchive,
		'application/gzip': FileArchive,
		'application/vnd.rar': FileArchive,

		'application/x-pem-file': FileKey,
		'application/x-x509-ca-cert': FileKey,
		'application/pkcs8': FileKey,
		'application/pkcs12': FileKey
	};

	const subtypePrefixMap: Array<[string, LucideIcon]> = [
		['vnd.ms-excel', FileSpreadsheet],
		['vnd.openxmlformats-officedocument.spreadsheet', FileSpreadsheet],
		['vnd.openxmlformats-officedocument.wordprocessing', FileText],
		['vnd.openxmlformats-officedocument.presentation', FileChartPie],
		['vnd.oasis.opendocument.spreadsheet', FileSpreadsheet],
		['vnd.oasis.opendocument.text', FileText],
		['vnd.oasis.opendocument.presentation', FileChartPie]
	];

	const typeMap: Record<string, LucideIcon> = {
		image: FileImage,
		video: FilePlay,
		audio: FileVolume,
		text: FileText,
		font: FileType,
		model: FileDigit,
		application: File,
		multipart: File,
		message: FileText
	};

	export function getIconForMimeType(mimeType: string): LucideIcon {
		if (!mimeType) return File;

		const normalized = mimeType.toLowerCase().trim();

		if (exactMap[normalized]) return exactMap[normalized];

		const [type, subtype = ''] = normalized.split('/');

		for (const [prefix, icon] of subtypePrefixMap) {
			if (subtype.startsWith(prefix)) return icon;
		}

		if (typeMap[type]) return typeMap[type];

		return File;
	}
</script>

<script lang="ts">
	interface Props {
		mimeType?: string;
		size?: number;
		strokeWidth?: number;
		color?: string;
		class?: string;
	}

	let {
		mimeType = '',
		size = 24,
		strokeWidth = 2,
		color = 'currentColor',
		class: className = ''
	}: Props = $props();

	const Icon = $derived(getIconForMimeType(mimeType));
</script>

<Icon {size} {strokeWidth} {color} class={className} />
