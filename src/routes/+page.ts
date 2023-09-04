const MAIN_WIKI_PAGE_URL = 'https://raw.githubusercontent.com/tasgon/observable/master/README.md';

export async function load({ fetch }) {
	const mainWikiPage = await fetch(MAIN_WIKI_PAGE_URL).then((res) => res.text());
	return { mainWikiPage };
}
