import React, { Component } from 'react';
import { connectInfiniteHits, Configure, connectStats, RefinementList } from 'react-instantsearch-dom';
import { Button, Popover, OverlayTrigger } from "react-bootstrap";
import { FaSlidersH } from "react-icons/fa";
import PropTypes from 'prop-types';
import Hit from './Hit';

const popover = (<Popover id="popover-filter">
  <Popover.Title as="h3">Filter by Type</Popover.Title>
  <Popover.Content>
    <RefinementList attribute="category" />
  </Popover.Content>
</Popover>);
function FilterPopover() {
  return (
    <OverlayTrigger trigger="click" placement="bottom" overlay={popover}>
    <Button variant="light" className="btn-filter">
        Filter <FaSlidersH />
      </Button>
      </OverlayTrigger>
  );
}
const Stats = ({ nbHits }) => (
  <>
    <div className="statsLine">
      <div className="row justify-content-between">
        <div className="col-8">{nbHits} search results found</div>
        <div className="col-2"><FilterPopover /></div>
      </div>
    </div>
  </>
);

const CustomStats = connectStats(Stats);
class InfiniteHits extends Component {
  static propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refine: PropTypes.func.isRequired,
  };

  sentinel = null;

  onSentinelIntersection = entries => {
    const { hasMore, refine } = this.props;

    entries.forEach(entry => {
      if (entry.isIntersecting && hasMore) {
        refine();
      }
    });
  };

  componentDidMount() {
    this.observer = new IntersectionObserver(this.onSentinelIntersection);
    this.observer.observe(this.sentinel);
  }

  componentWillUnmount() {
    this.observer.disconnect();
  }

  render() {
    const { hits } = this.props;

    return (
      <div className="hits">
        <Configure attributesToSnippet={['title', 'content:80']} />
        <CustomStats />
        <ul>
          {hits.map(hit => (
            <li key={hit.objectID} className="hit-item-single">
              <Hit hit={hit} />
            </li>
          ))}
          <li
            className="ais-InfiniteHits-sentinel"
            ref={c => (this.sentinel = c)}
          />
        </ul>
      </div>
    );
  }
}

export default connectInfiniteHits(InfiniteHits);
