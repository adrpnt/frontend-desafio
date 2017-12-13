import React, { Component } from 'react';

class Tabs extends Component {
  state = { selected: this.props.selected };

  renderTitles = () => {
    const labels = (child, idx) => {
      let activeClass = (this.state.selected === idx ? 'is-active' : '');

      return (
        <li className={ activeClass } role="tab" key={ idx } aria-controls={ `panel${idx}` }>
          <a onClick={ this.onClick.bind(this, idx) }>
            { child.props.label }
          </a>
        </li>
      );
    }

    return (
      <ul role="tablist">
        { this.props.children.map(labels.bind(this)) }
      </ul>
    );
  }

  onClick = (index, event) => {
    event.preventDefault();
    this.setState({ selected: index });
  }

  render() {
    return (
      <div className="container">
        <div className="tabs is-toggle is-fullwidth">
          { this.renderTitles() }
        </div>

        { this.props.children[this.state.selected] }
      </div>
    );
  }
}

export default Tabs;
