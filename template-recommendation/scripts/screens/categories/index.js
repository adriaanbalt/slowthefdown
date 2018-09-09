import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Description from '../../shared/Description'
import CheckableGridItem from '../../shared/checkableGridItem'
import categoriesList from './categories-list'
import store from '../../Store'
import Screen from '../../shared/Screen'

import {
  selectImage
} from './categoriesActions'

import {
  nextPage
} from '../../shared/Queue/actions'

const styles = {
  categoriesGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: 'calc(100% + 20px)',
    marginLeft: '-10px',
  },
}

class Categories extends React.Component {

  constructor( props ) {
    super( props )
    this.selectCategory = this.selectCategory.bind( this )
  }

  selectCategory( id ) {
    this.props.nextPage()
    this.props.selectImage( id )
  }

  render() {
    return (
      <Screen>
        <Description
          title="Category"
          subtitle="Choose a category that best matches you"
        />
        <div style={styles.categoriesGrid}>
          {categoriesList.map(({ label, image }, index ) => {
            return (
              <CheckableGridItem
                label={label}
                width={50}
                padding={10}
                imgSrc={image}
                key={label}
                identifier={label}
                onClick={this.selectCategory}
              />
            )
          })}
        </div>
      </Screen>
    )
  }
}

const mapStateToProps = ( state ) => ({
  selectedLabels: state.CategoriesReducer.selectedLabels,
})

const mapDispatchToProps = ( dispatch ) => bindActionCreators({
  selectImage,
  nextPage,
}, dispatch )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Categories )
