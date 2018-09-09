import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import MagnifyingGlass from '../magnifyingGlass'
import {
  onSearch,
  onSearchChange
} from '../VibesActions'
import STRINGS from '../../../shared/i18n/strings'

class Search extends React.PureComponent {
  constructor( props ) {
    super( props )
    this.handleSubmit = this.handleSubmit.bind( this )
    this.handleSearchChange = this.handleSearchChange.bind( this )
  }

  handleSubmit( e ) {
    e.preventDefault()
    this.props.onSearch()
    this.$input.blur()
  }

  handleSearchChange( e ) {
    this.props.onSearchChange( e.target.value )
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}
        className={'vibes-search-container'}
      >
        <input
          ref={( $el ) => this.$input = $el}
          className="vibes-search-bar"
          placeholder={STRINGS.IMAGE_SEARCH_PLACEHOLDER}
          type="search"
          value={this.props.searchString}
          onChange={this.handleSearchChange}
        />
        <div className="vibes-search-icon"
          onClick={this.handleSubmit}
        ><MagnifyingGlass /></div>
      </form>
    )
  }
}


const mapStateToProps = ( state ) => ({
  searchString: state.VibesReducer.searchString,
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  onSearch,
  onSearchChange,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Search )
