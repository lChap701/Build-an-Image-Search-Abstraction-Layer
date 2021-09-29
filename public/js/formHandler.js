/* Displays search terms when the page is loaded */
window.onload = () => {
  const terms = document.querySelector("datalist#terms");

  // Fetches terms in the JSON file
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

/**
 * Updates the value of the safe-search checkbox
 */
function safeSearchHandler() {
  const safeSearch = document.querySelector("input[name='safe-search']");
  safeSearch.value = safeSearch.checked ? "active" : "off";
}

/**
 * Appends the value of the query field to the URL and prepares data for submition
 */
function submitHandler() {
  const PATH = "/query/";
  const form = document.querySelector("form[name='query-form']");
  const query = document.querySelector("input[name='query']").value;
  const page = document.querySelector("input[name='page']").value;
  const safeSearch = document.querySelector("input[name='safe-search']").value;

  const elSize = document.querySelector("select[name='size']");
  const size = elSize.options[elSize.selectedIndex].value;

  const elType = document.querySelector("select[name='type']");
  const type = elType.options[elType.selectedIndex].value;

  // Query string
  let queryString = "?page=" + page;

  // Checks if image size should be added to the query string
  if (size !== "imgSizeUndefined") {
    queryString += "&size=" + size;
  }

  // Checks if image type should be added to the query string
  if (type !== "imgTypeUndefined") {
    queryString += "&type=" + type;
  }

  // Checks if the value of safe-search should be added to the query string
  if (safeSearch === "active") {
    queryString += "&safe=" + safeSearch;
  }

  // Adds query to the action attribute
  form.action = PATH + query + queryString;
}
