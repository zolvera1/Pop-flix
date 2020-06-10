// eslint-disable-next-line no-console
import autoComplete from "./autoComplete.js";

// autoComplete.js on type event emitter
export default function AutocompleteStartup(URL, arrayOfKeys) {
  document
    .querySelector("#autoComplete")
    .addEventListener("autoComplete", function (event) {
      // console.log(event.detail);
      // console.log(autoCompletejs);
    });

  document
    .querySelector("#autoComplete")
    .addEventListener("keyup", function (event) {
      switch (event.keyCode) {
        case 13: //Enter
          //ResultCursor is the position that is highlighted

          break;
        default:
          break;
      }
    });
  // The autoComplete.js Engine instance creator

  new autoComplete({
    data: {
      src: async function () {
        // Loading placeholder text
        document
          .querySelector("#autoComplete")
          .setAttribute("placeholder", "Loading...");
        // Fetch External Data Source

        const source = await fetch(URL);


        const data = await source.json();

        // Returns Fetched data
        // console.log(data.results);
        return data;
      },
      key: arrayOfKeys,
    },
    sort: function (a, b) {
      if (a.match < b.match) {
        return -1;
      }
      if (a.match > b.match) {
        return 1;
      }
      return 0;
    },
    query: {
      manipulate: function (query) {
        return query.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      },
    },
    trigger: {
      event: ["input", "focusin", "focusout"],
      condition: function (query) {
        return !!query.replace(/ /g, "").length && query !== "hamburger";
      },
    },
    placeHolder: "Search Here...",
    selector: "#autoComplete",
    debounce: 0,
    searchEngine: "strict",
    highlight: true,
    maxResults: 6,
    resultsList: {
      render: true,
      container: function (source) {
        source.setAttribute("id", "autoComplete_list");
      },
      element: "ul",
      destination: document.querySelector("#autoComplete"),
      position: "afterend",
    },
    resultItem: {
      content: function (data, source) {
        source.innerHTML = data.match;
      },
      element: "li",
    },
    noResults: function () {
      const result = document.createElement("li");
      result.setAttribute("className", "no_result");
      result.setAttribute("tabIndex", "1");
      result.innerHTML = "No Results";
      document.querySelector("#autoComplete_list").appendChild(result);
    },
    onSelection: function (feedback) {
      document.querySelector("#autoComplete").blur();
      //put as place holder the selection
      const selection = feedback.selection.value.title;
      // Render selected choice to selection div
      //document.querySelector(".selection").innerHTML = selection;
      // Clear Input
      document.querySelector("#autoComplete").value = selection;
      // Change placeholder with the selected value
      document
        .querySelector("#autoComplete")
        .setAttribute("placeholder", selection);
      // Concole log autoComplete data feedback

      console.log(selection);

      console.log(feedback);
    },
  });

  // Toggle results list and other elements
  const action = function (action) {
    const selection = document.querySelector(".selection");

    if (action === "dim") {
      selection.style.opacity = 1;
    } else {
      selection.style.opacity = 0.1;
    }
  };

  // Toggle event for search input
  // showing & hidding results list onfocus / blur
  ["focus", "blur"].forEach(function (eventType) {
    const resultsList = document.querySelector("#autoComplete_list");

    document
      .querySelector("#autoComplete")
      .addEventListener(eventType, function () {
        // Hide results list & show other elemennts
        if (eventType === "blur") {
          action("dim");
          resultsList.style.display = "none";
        } else if (eventType === "focus") {
          // Show results list & hide other elemennts
          action("light");
          resultsList.style.display = "block";
        }
      });
  });
}
