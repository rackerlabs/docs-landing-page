import algoliasearch from 'algoliasearch/lite';
import React, { Component } from 'react';
import { InstantSearch, SearchBox, Configure } from 'react-instantsearch-dom';
import InfiniteHits from './InfiniteHits';
import { connectStateResults } from "react-instantsearch/connectors"

const ALGOLIA_SEARCH_KEY = 'ce5576a8109906d7cbc0c7ebdff2c2e2';
const ALGOLIA_APP_ID = 'I0JO56OFYD';
const algoliaClient = algoliasearch(
  ALGOLIA_APP_ID,
  ALGOLIA_SEARCH_KEY
);

const Results = connectStateResults(
  ({ searchState, searchResults, children }) => {
    if (searchState.query && searchResults && searchResults.nbHits !== 0) {
      return children;
    } else if (searchState.query && searchResults && searchResults.nbHits === 0) {
      return (<div className="no-results"><h3>No Results found</h3><p>It seems we can't find any results based on your search.</p></div>);
    } else {
      return (<span></span>);
    }
  }
);
const searchClient = {
  
    search(requests) {
        if (
            requests.every(({ params }) => !params.query.trim()
            )) {
            return Promise.resolve({
                results: requests.map(() => ({
                    hits: [],
                    nbHits: 0,
                    nbPages: 0,
                    processingTimeMS: 0,
                })),
            });
        }
        return algoliaClient.search(requests);
    }
};

class App extends Component {
  
  render() {
    const ALGOLIA_INDEX_NAME = 'netlify_f6012b1b-e032-4bb3-91f5-addb2e700fe2_master_all';
    return (
      <div className="ais-InstantSearch">
        <InstantSearch indexName={ALGOLIA_INDEX_NAME} searchClient={searchClient}>
          <Configure hitsPerPage={20} />
          <SearchBox className="searchbox" translations={{ placeholder: 'Search across Docs', }} showLoadingIndicator />
            <Results>
              <InfiniteHits minHitsPerPage={16} />
            </Results>
        </InstantSearch>
      </div>
    );
  }
}

export default App;