import React from 'react';
import Highlight from './Highlight';
import PropTypes from 'prop-types';
import Snippet from './Snippet';

function HeaderLink(props) {
  const headerUrl = props.headerUrl;
  if (headerUrl.includes('/docs/')) {
    return (<a className="search-type-link" href="/docs/">Solutions</a>);
  } else if (headerUrl.includes('/support/how-to/')) {
    return ( <a className="search-type-link" href="/support/how-to/">How-To</a>);
  } else if (headerUrl.includes('/blog/')) {
    return (<a className="search-type-link" href="/blog">Blog</a>);
  } else {
    return (<a className="search-type-link" href="/">Developer Home</a>);
  }
}
function TitleTag(props) {
  const headerUrl = props.headerUrl;
  if (headerUrl.includes('/docs/')) {
    return (<a className="search-tag technical-tag" href="/docs/">Technical</a>);
  } else if (headerUrl.includes('/support/how-to/')) {
    return ( <a className="search-tag article-tag" href="/support/how-to/">Article</a>);
  } else if (headerUrl.includes('/blog/')) {
    return (<a className="search-tag post-tag" href="/blog">Post</a>);
  } else {
    return (<span></span>);
  }
}
function CategoryLink(props) {
  const categories = props.category;
  if (categories != '' && categories != null) {
    if (Array.isArray(categories)) {
          return (<span>&nbsp;&gt;&nbsp;<a className="search-type-link-array">{categories}</a></span>);
        } else {
          return (<span>&nbsp;&gt;&nbsp;<a className="search-type-link-single">{categories}</a></span>);
        }
  } else {
    return (<span></span>);
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
const Hit = ({ hit }) => {
  if (hit.title != null && hit.title != '' && hit.content != '' && hit.content != null && hit.url != null && hit.keywords != null && hit.keywords != '' && hit.category != null && hit.category != '') {
    return (
      <div className="row">
        <div className="col-sm-12">
          <HeaderLink headerUrl={hit.url} /><CategoryLink category={hit.keywords} />
          <h2>
            <TitleTag headerUrl={hit.url} />
            <a className="search-title-link" href={`${hit.url}`}>
              <Highlight attribute="title" hit={hit} />
            </a>
          </h2>
          <a className="search-summary-link" href={`${hit.url}`}>
            <p className="search-summary"><Snippet hit={hit} attribute="content" tagName="mark"/></p>
          </a>
        </div>
      </div>
    );
  } else {
    return (<span></span>);
  }
};

Hit.propTypes = {
  hit: PropTypes.object.isRequired,
};

export default Hit;
