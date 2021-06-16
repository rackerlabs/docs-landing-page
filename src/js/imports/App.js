import algoliasearch from 'algoliasearch/lite';
import React, { Component } from 'react';
import { InstantSearch, SearchBox, Configure } from 'react-instantsearch-dom';
import InfiniteHits from './InfiniteHits';
import { connectStateResults } from "react-instantsearch/connectors";

const algoliaClient = algoliasearch(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_SEARCH_KEY
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
    return (
      <div className="ais-InstantSearch">
        <InstantSearch indexName={process.env.ALGOLIA_INDEX_NAME} searchClient={searchClient}  onSearchStateChange={searchState => {
    const page = `?query=${searchState.query}`;
    window.ga('send', 'pageView', page);
  }}>
          <Configure hitsPerPage={20} />
          <SearchBox className="searchbox" translations={{ placeholder: 'Search across Docs', }} showLoadingIndicator searchAsYouType={false} autoFocus />
          <Results>
              <InfiniteHits minHitsPerPage={20} />
          </Results>
        </InstantSearch>
      </div>
    );
  }
}

export default App;