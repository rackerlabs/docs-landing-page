import React, { Component, useState, useRef } from "react";
import {
  connectInfiniteHits,
  Configure,
  connectStats,
  RefinementList,
} from "react-instantsearch-dom";
import { Button, Popover, Overlay } from "react-bootstrap";
import { FaSlidersH } from "react-icons/fa";
import PropTypes from "prop-types";
import Hit from "./Hit";

function FilterPopover() {
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };
  return (
    <div ref={ref}>
      <Button variant="light" className="btn-filter" onClick={handleClick}>
        Filter <FaSlidersH />
      </Button>
      <Overlay
        show={show}
        target={target}
        placement="bottom"
        container={ref.current}
        containerPadding={20}
      >
        <Popover id="popover-filter">
          <Popover.Title as="h3">Filter by Type</Popover.Title>
          <Popover.Content>
            <RefinementList attribute="category" />
          </Popover.Content>
        </Popover>
      </Overlay>
    </div>
  );
}
const Stats = ({ nbHits }) => (
  <>
    <div className="statsLine">
      <div className="row">
        <div className="col-8">{nbHits} search results found</div>
        <div className="col-4 text-right-filter">
          <FilterPopover />
        </div>
      </div>
    </div>
  </>
);

const CustomStats = connectStats(Stats);
class InfiniteHits extends Component {
  static propTypes = {
    hits: PropTypes.arrayOf(PropTypes.object).isRequired,
    hasMore: PropTypes.bool.isRequired,
    refineNext: PropTypes.func.isRequired,
  };

  sentinel = null;

  onSentinelIntersection = (entries) => {
    const { hasMore, refineNext } = this.props;

    entries.forEach((entry) => {
      if (entry.isIntersecting && hasMore) {
        refineNext();
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
        <Configure attributesToSnippet={["title", "content:80"]} />
        <CustomStats />
        <ul>
          {hits.map((hit) => (
            <li key={hit.objectID} className="hit-item-single">
              <Hit hit={hit} />
            </li>
          ))}
          <li
            className="ais-InfiniteHits-sentinel"
            ref={(c) => (this.sentinel = c)}
          />
        </ul>
      </div>
    );
  }
}

export default connectInfiniteHits(InfiniteHits);
