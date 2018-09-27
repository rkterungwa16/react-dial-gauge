import React from 'react'

class ReactDialGauge extends React.Component {
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
