import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import ActionTypes from "../constants/ActionTypes";

class UsersData extends EventEmitter {
  constructor(params) {
    super(params);
  }

  addChangeListener(event, callback) {
    this.on(event, callback);
  }

  removeChangeListener(event, callback) {
    this.removeListener(event, callback);
  }

  emitChange(event, data) {
    this.emit(event, data);
  }
  getSearchResults() {
    return this.searchResults || [];
  }
  setSearchResults(searchResults) {
    this.searchResults = searchResults;
  }

  isLoadingSearchResults(bool) {
    if ("boolean" === typeof bool) {
      this._isLoadingSearchResults = bool;
      return bool;
    }
    return this._isLoadingSearchResults;
  }
  setSearchQuery(searchQuery) {
    this.searchQuery = searchQuery;
    this.searchQueryTimestamp = parseInt(Date.now() / 1000);
    this.isLoadingSearchResults(true);
  }

  getLastSearchQueryTimestamp() {
    // Timestamp when the last search query was performed
    return (
      this.searchQueryTimestamp ||
      (this.searchQueryTimestamp = parseInt(Date.now() / 1000))
    );
  }

  getSearchQuery() {
    return this.searchQuery;
  }

  storePreparedSearchApiCall({ timer, willExecuteAt }) {
    if (this.preparedSearchApiCallTimer) {
      clearTimeout(this.preparedSearchApiCallTimer);
    }
    this.preparedSearchApiCallTimer = timer;
  }
}

const usersData = new UsersData();

dispatcher.register((action) => {
  switch (action.actionType) {
    case ActionTypes.USERS_DATA_SEARCH_RESULTS_CHANGED:
      const { searchResults, query, isServerSideResult } = action.data;
      if (isServerSideResult && query === usersData.searchQuery) {
        usersData.isLoadingSearchResults(false);
      }
      usersData.setSearchResults(searchResults);
      break;
    case ActionTypes.USERS_DATA_SEARCH_QUERY:
      usersData.setSearchQuery(action.data.searchQuery);
      break;
    case ActionTypes.USERS_DATA_PREPARE_SEARCH_API_CALL:
      // Clear previous timeout
      usersData.storePreparedSearchApiCall(action.data);
      break;
    default:
      break;
  }

  usersData.emitChange(action.actionType, action.data);
});

export default usersData;
