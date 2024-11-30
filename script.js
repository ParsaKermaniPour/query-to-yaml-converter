document.addEventListener("DOMContentLoaded", () => {
  let queryCount = 1;

  // Functionality to dynamically add new queries
  document.getElementById("addQueryButton").addEventListener("click", () => {
    queryCount++;
    const queryForm = document.getElementById("queryForm");

    const newInputGroup = document.createElement("div");
    newInputGroup.className = "input-group";
    newInputGroup.id = `query${queryCount}`;

    const label = document.createElement("label");
    label.setAttribute("for", `query${queryCount}Text`);
    label.textContent = `Query ${queryCount}`;

    const textarea = document.createElement("textarea");
    textarea.id = `query${queryCount}Text`;
    textarea.className = "query-textarea";
    textarea.placeholder = "Enter your SQL query here...";

    // Resize the textarea dynamically as user types
    textarea.addEventListener("input", () => {
      resizeTextarea(textarea);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      queryForm.removeChild(newInputGroup);
      renumberQueries();
    });

    newInputGroup.appendChild(label);
    newInputGroup.appendChild(textarea);
    newInputGroup.appendChild(deleteButton);

    queryForm.appendChild(newInputGroup);

    // Trigger initial resize when the textarea is first added
    resizeTextarea(textarea);
  });

  // Functionality to delete queries and renumber them
  window.deleteQuery = (queryId) => {
    const queryElement = document.getElementById(`query${queryId}`);
    if (queryElement) {
      queryElement.parentNode.removeChild(queryElement);
      renumberQueries();
    }
  };

  // Renumber the queries after deletion or empty query removal
  function renumberQueries() {
    const allQueries = document.querySelectorAll(".input-group");
    allQueries.forEach((queryElement, index) => {
      const queryNumber = index + 1; // The new query number based on index
      const label = queryElement.querySelector("label");
      const textarea = queryElement.querySelector("textarea");

      // Update the label and textarea ID
      label.textContent = `Query ${queryNumber}`;
      label.setAttribute("for", `query${queryNumber}Text`);
      textarea.id = `query${queryNumber}Text`;

      // Ensure the new text area resizes automatically
      resizeTextarea(textarea);
    });

    queryCount = allQueries.length; // Update the global query count
  }

  // Resize textarea based on content height
  function resizeTextarea(textarea) {
    textarea.style.height = "auto";  // Reset height to auto to shrink it when content is removed
    textarea.style.height = (textarea.scrollHeight) + "px";  // Adjust height to content
  }

  // Event delegation for Tab key handling in all textareas
  document.addEventListener("keydown", (event) => {
    if (event.target.classList.contains("query-textarea") && event.key === "Tab") {
      event.preventDefault();
      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Insert 2 spaces
      const tabSpaces = "  ";
      textarea.value = textarea.value.substring(0, start) + tabSpaces + textarea.value.substring(end);

      // Move the caret to the right of the 2 spaces
      textarea.selectionStart = textarea.selectionEnd = start + tabSpaces.length;
    }
  });

  // Functionality to generate YAML and immediately trigger download
  document.getElementById("generateButton").addEventListener("click", () => {
    const queries = [];
    const textareas = document.querySelectorAll(".query-textarea");

    // Remove empty queries from the DOM
    textareas.forEach((textarea, index) => {
      if (textarea.value.trim() === "") {
        const queryElement = textarea.closest(".input-group");
        if (queryElement) {
          queryElement.remove(); // Remove the empty query from the DOM
        }
      }
    });

    // Renumber the remaining queries
    renumberQueries();

    // Collect the remaining non-empty queries for YAML generation
    document.querySelectorAll(".query-textarea").forEach((textarea, index) => {
      const query = textarea.value.trim();
      if (query) {
        queries.push({ id: `query${index + 1}`, query: query });
      }
    });

    // Generate YAML content in the desired format
    let yamlContent = "query_dictionary:\n";
    queries.forEach(q => {
      yamlContent += `  ${q.id}:\n    query: |\n`;
      q.query.split("\n").forEach(line => {
        yamlContent += `      ${line}\n`;
      });
    });

    const blob = new Blob([yamlContent], { type: "text/yaml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "queries.yml";

    // Trigger the download automatically
    link.click();
  });

  // Delete and re-add the first query programmatically to trigger resize
  const queryForm = document.getElementById("queryForm");
  const firstQuery = document.getElementById("query1");
  if (firstQuery) {
    // Remove the first query (if it exists)
    queryForm.removeChild(firstQuery);
    
    // Re-add the first query to trigger the resize
    const newInputGroup = document.createElement("div");
    newInputGroup.className = "input-group";
    newInputGroup.id = "query1";

    const label = document.createElement("label");
    label.setAttribute("for", "query1Text");
    label.textContent = "Query 1";

    const textarea = document.createElement("textarea");
    textarea.id = "query1Text";
    textarea.className = "query-textarea";
    textarea.placeholder = "Enter your SQL query here...";

    // Resize the textarea dynamically as user types
    textarea.addEventListener("input", () => {
      resizeTextarea(textarea);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => {
      queryForm.removeChild(newInputGroup);
      renumberQueries();
    });

    newInputGroup.appendChild(label);
    newInputGroup.appendChild(textarea);
    newInputGroup.appendChild(deleteButton);

    queryForm.appendChild(newInputGroup);

    // Trigger resize when the textarea is first added
    resizeTextarea(textarea);
  }
});
