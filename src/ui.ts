/**
 * Toggle loading state of webapp
 */
export const toggleLoading = () => {
	const loader = document.getElementById("loader");
	loader!.style.display = loader!.style.display == "grid" ? "none" : "grid";
};
