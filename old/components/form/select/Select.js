'use strict';

import React, {Component} from 'react';
import AppStore from '../../../stores/AppStore';
import cx from 'classnames';
import { Link } from 'react-router';
import UI from '../../UI';
import Icon from '../../Icon';
import Option from './Option';

import ActionCreator from '../../../actions/AppActions'
import InputElement from '../InputElement';

export default class Select extends InputElement {

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isSelected: true,
      value: null,
    };

    this.selectValue = (value) => {
      this.setValue(value);
      this.setState({
        isOpen: false,
        isSelected: true,
      });
    };
  }

  renderValue () {
    return <p>{this.state.value !== null ? this.state.value.displayName : this.props.placeholder}</p>;

  }

  renderMenu (options) {
    if (options && options.length) {
      return options.map((option, i) => {
        return (
          <Option
            key={`option-${i}`}
            isFocused={this.state.isFocused}
            isSelected={this.state.isSelected}
            onSelect={this.selectValue.bind(this)}
            option={option}
            >
            </Option>
        );
      });
    }

  }

  handleMouseDown (e) {
    // prevent default event handlers
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  setValue (value) {
    this.setState({
      value: value,
    });
    // update this question's value to the selected <option>
    ActionCreator.setData({
			property: `articles.${this.props.article.id}.questions.${this.props.question.id}.value`,
			value: value.displayName
		});
  }

  render () {
    let classnames = cx({ 'select-control': true, 'selected': this.state.isSelected || this.state.isOpen })
    return (
      <div className="select-wrapper" ref="select-wrapper" >
        <input type="hidden" ref="value" name={this.props.name} value={this.state.value !== null ? this.state.value.displayName : ''} />
        <div ref="control"
             className={classnames}
             onMouseDown={this.handleMouseDown.bind(this)}>
             <Icon name="icon-select-arrow-inactive-2x" />
             <Icon name="icon-select-arrow-active-2x" />
             {this.renderValue()}
        </div>
        { this.state.isOpen ? (
          <div ref="menuContainer" className="select-menu-outer">
            <div ref="menu" className="select-menu">
              {this.renderMenu(this.props.options)}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
};
