/**
 * Updates the value of the safe-search checkbox
 */
function safeSearchHandler() {
  const safeSearch = document.querySelector("input[name='safe-seach']");
  safeSearch.value = safeSearch.checked ? "active" : "off";
}

/**
 * Appends the value of the query field to the URL and prepares data for submition
 */
function submitHandler() {
  // Adds query to the action attribute
  const PATH = "/query/";
  const form = document.querySelector("form[name='query-form']");
  const query = document.querySelector("input[name='query']").value;
  const page = document.querySelector("input[name='page']").value;
  form.action = PATH + query + "?page=" + page;
}

/**
 * Displays search terms when the page is loaded
 */
window.onload = function displayTerms() {
  const terms = document.querySelector("datalist#terms");

  // Fetches terms in JSON file
  fetch("../json/terms.json")
    .then((res) => res.json())
    .then((data) => {
      data.terms.forEach((d) => {
        const opt = document.createElement("option");
        opt.value = d.term;
        terms.append(opt);
      });
    })
    .catch((err) => console.error(err));
};
