/**
 * Appends the value of the query field to the URL and prepares data for submition
 */
function submitHandler() {
  // Adds query to the action attribute
  const form = document.querySelector("form[name='query-form']");
  const query = document.querySelector("input[name='query']").value;
  form.action += query;

  // Updates the safeSearch checkbox
  const safeSearch = document.querySelector("input[name='safe-seach']");
  safeSearch.value = safeSearch.checked ? "high" : "off";
}