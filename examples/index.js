import React from 'react'
import ReactDOM from 'react-dom'
import ReactDialGauge from '../src/ReactDialGauge.jsx'

const App = () => (
  <div>
    <ReactDialGauge />
  </div>
)

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
