import algoliasearch from 'algoliasearch/lite';
import React, { Component } from 'react';
import { InstantSearch, SearchBox, Configure } from 'react-instantsearch-dom';
import InfiniteHits from './InfiniteHits';
import { connectStateResults } from "react-instantsearch/connectors";

const ALGOLIA_SEARCH_KEY = 'ec196286ebae1a6db15148eeea26b485';
const ALGOLIA_APP_ID = 'UTC1CE04NQ';
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
    const ALGOLIA_INDEX_NAME = 'netlify_ea5a1331-0476-4664-83af-47ba3ac87159_master_all';
    return (
      <div className="ais-InstantSearch">
        <InstantSearch indexName={ALGOLIA_INDEX_NAME} searchClient={searchClient}>
          <Configure hitsPerPage={40} />
          <SearchBox className="searchbox" translations={{ placeholder: 'Search across Docs', }} showLoadingIndicator />
          <Results>
              <InfiniteHits minHitsPerPage={40} />
          </Results>
        </InstantSearch>
      </div>
    );
  }
}

export default App;