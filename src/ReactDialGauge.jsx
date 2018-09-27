import React from 'react'

/**
 * A react component to render a  radial dial gauge
 */
class ReactDialGauge extends React.Component {
  /**
   *
   * @param {*} props
   */
  constructor (props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  /**
   * @return {Object} html object
   */
  render () {
    return (
      <div className='container A'>
        <svg className='typeRange' height='165' width='330' view-box='0 0 330 165'>

          <g className='scale' stroke='red' />

          <path className='outline' d='' />
          <path className='fill' d='' />
          <polygon className='needle' points='220,10 300,210 220,250 140,210' />
        </svg>
        <div className='output'>30</div>
      </div>
    )
  }
}

export default ReactDialGauge
