import React from "react";
import Highlight from "./Highlight";
import PropTypes from "prop-types";
import Snippet from "./Snippet";
import moment from "moment";

function HeaderLink(props) {
  const category = props.category;
  if (category === "Guides") {
    return (
      <a className="search-type-link" href="/docs/">
        Guides
      </a>
    );
  } else if (category === "How-Tos") {
    return (
      <a className="search-type-link" href="/support/how-to/">
        How-Tos
      </a>
    );
  } else if (category === "Insights") {
    return (
      <a className="search-type-link" href="/blog/">
        Expert Insights Blog
      </a>
    );
  } else {
    return (
      <a className="search-type-link" href="/">
        Developer Home
      </a>
    );
  }
}
function TitleTag(props) {
  const category = props.category;
  if (category === "Guides") {
    return (
      <a className="search-tag technical-tag" href="/docs/">
        GUIDES
      </a>
    );
  } else if (category == "How-Tos") {
    return (
      <a className="search-tag article-tag" href="/support/how-to/">
        HOW-TOs
      </a>
    );
  } else if (category === "Insights") {
    return (
      <a className="search-tag post-tag" href="/blog/">
        INSIGHTS
      </a>
    );
  } else {
    return <span></span>;
  }
}
function KeywordsLink(props) {
  const keywords = props.keywords;
  const category = props.category;
  if (keywords != "" && keywords != null) {
    if (category === "Insights") {
      return (
        <span>
          &nbsp;&gt;&nbsp;
          <a key={keywords} className="search-type-link">
            {keywords.replace(/[\[\]']+/g, "").replace(/\s/g, ", ")}
          </a>
        </span>
      );
    } else {
      return (
        <span>
          &nbsp;&gt;&nbsp;<a className="search-type-link">{keywords}</a>
        </span>
      );
    }
  } else {
    return <span></span>;
  }

  // if (categories != '' && categories != null) {
  //   if (Array.isArray(categories)) {
  //     categories = categories.flat();
  //     return (<span>&nbsp;&gt;&nbsp;{categories.map((category) => <a key={category} className="search-type-link">{category.replace(/ *\([^)]*\) */g, "")}{index < hit.categories.length - 1 ? ',\u00A0' : ''}</a>)}</span>)
  //   } else {
  //     return (<span>&nbsp;&gt;&nbsp;<a className="search-type-link">{categories}</a></span>);
  //   }
  // } else {
  //   return (<span></span>);
  // }
}
function HitDate(props) {
  const date = props.date;
  if (date != "" && date != null) {
    let newDate = date.split(" ")[0];
    newDate = moment(newDate).format("LL");
    return <span className="search-date">{newDate}</span>;
  } else {
    return <span></span>;
  }
}

function Author(props) {
  const author = props.author;
  if (author != "" && author != null) {
    return (
      <span>
        &nbsp;By&nbsp;<a className="search-author">{author}</a>
      </span>
    );
  } else {
    return <span></span>;
  }
}
function PrimaryView(props) {
  return (
    <div className="col-sm-12">
      <HeaderLink category={props.hit.category} />
      <KeywordsLink
        keywords={props.hit.keywords}
        category={props.hit.category}
      />
      <h2>
        <TitleTag category={props.hit.category} />
        <a className="search-title-link" href={`${props.hit.url}`}>
          <Highlight attribute="title" hit={props.hit} />
        </a>
      </h2>
      <a className="search-summary-link" href={`${props.hit.url}`}>
        <p className="search-summary">
          <Snippet hit={props.hit} attribute="content" tagName="mark" />
        </p>
      </a>
    </div>
  );
}
function SecondaryView(props) {
  return (
    <>
      <div className="col-sm-12 col-md-6">
        <Author author={props.hit.author} />
      </div>
      <div className="col-sm-12 col-md-6">
        <HitDate date={props.hit.date} />
      </div>
    </>
  );
}
const Hit = ({ hit }) => {
  if (
    hit.title != null &&
    hit.title != "" &&
    hit.content != "" &&
    hit.content != null &&
    hit.url != null &&
    hit.keywords != null &&
    hit.keywords != "" &&
    hit.category != null &&
    hit.category != ""
  ) {
    if (hit.author != null && hit.date != null) {
      return (
        <div className="row">
          <PrimaryView hit={hit} />
          <SecondaryView hit={hit} />
        </div>
      );
    } else {
      return (
        <div className="row">
          <PrimaryView hit={hit} />
        </div>
      );
    }
  } else {
    return <span></span>;
  }
};

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default Hit;
