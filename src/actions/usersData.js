import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

import Fetcher from "../classes/fetcher";

import usersDataStore from "../store/usersData";
import usersData from "../store/usersData";

export const searchQuery = async (query) => {
  // Quick query validation
  query = query ? query.toString().trim().toLowerCase() : "";
  if (!query) {
    return;
  }

  // Inform dispatcher we are performing chat queries
  dispatcher.dispatch({
    actionType: ActionTypes.USER_DATA_SEARCH_QUERY,
    data: { searchQuery: query }, // also set isLoading to show preload
  });

  // Optimize search results keeping. Iterate through the search-query
  // If results' column-values match the search query, don't remove those rows.
  const searchColumns = ["username", "lastMessageText"];
  const searchPredicate = (result) => {
    const resultColumns = Object.keys(result);
    for (let searchColumn of searchColumns) {
      if (
        resultColumns.includes(searchColumn) &&
        result[searchColumn] &&
        result[searchColumn].toString().toLowerCase().includes(query)
      ) {
        // Occurrence found
        return true;
      }
    }
    // No matching value has been found
    return false;
  };
  const lastResults = usersDataStore.getSearchResults();
  const newResults = lastResults.filter(searchPredicate);
  // Dispatch the new results with removed and kept occurrences
  dispatcher.dispatch({
    actionType: ActionTypes.USER_DATA_RESULTS_CHANGED,
    data: { searchResults: newResults }, // It is stil loading, keep preload
  });

  // To avoid spam, make sure only one api call gets through every 1 second
  // If CHAT_PREPARE_SEARCH_API_CALL dispatches again, it will clear any previous timers
  // hence nulling any "queued" api calls and rolling in a new one awaiting to fire
  dispatcher.dispatch({
    actionType: ActionTypes.USER_DATA_QUERY_API_CALL,
    data: {
      timer: setTimeout(async () => {
        // Fetch search query results
        const searchResults = await Fetcher.get("/chatSearchQuery", { query });
        if (Array.isArray(searchResults)) {
          dispatcher.dispatch({
            actionType: ActionTypes.CHAT_SEARCH_RESULTS_CHANGED,
            data: { searchResults, query, isServerSideResult: true },
          });
        }
      }, 1000),
      willExecuteAt: parseInt(Date.now() / 1000) + 1,
    },
  });
};
