<script lang="ts">
	export let fileName: string;
	const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

	let icon = '📄';
	if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'bmp', 'webp'].includes(ext)) icon = '🖼️';
	else if (['pdf'].includes(ext)) icon = '📕';
	else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) icon = '🗜️';
	else if (['mp3', 'wav', 'ogg', 'flac'].includes(ext)) icon = '🎵';
	else if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(ext)) icon = '🎬';
	else if (['doc', 'docx'].includes(ext)) icon = '📄';
	else if (['xls', 'xlsx'].includes(ext)) icon = '📊';
	else if (['ppt', 'pptx'].includes(ext)) icon = '📈';
	else if (['txt', 'md', 'rtf'].includes(ext)) icon = '📝';
</script>

<span>{icon}</span>
