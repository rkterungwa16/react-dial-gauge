import React from 'react'
import PropTypes from 'prop-types'
import './index.css'

/**
 * A react component to render a  radial dial gauge
 */
class ReactDialGauge extends React.PureComponent {
  /**
   *
   * @param {*} props
   */
  constructor (props) {
    super(props)
    const { svgWidth } = this.props
    this.state = {
      rad: Math.PI / 180,
      startingPosXCoord: svgWidth / 2,
      startingPosYCoord: 160,
      offsetFromOrigin: 40,
      initialValue: 18
    }
  }

  /**
   *
   * @param {Number} startingPosXCoord
   * @param {Number} offsetFromOrigin
   * @return {Number} arc radius
   */
  getArcRadius (startingPosXCoord, offsetFromOrigin) {
    return startingPosXCoord - offsetFromOrigin
  }

  /**
   *
   * @param {Number} arcRadius
   * @return {Number} thickness of arc
   */
  getArcThickness (arcRadius) {
    return arcRadius / 2
  }

  /**
   *
   * @param {Object} angleConfig
   * @return {Number} current arc angle
   */
  calArcAngle (angleConfig) {
    const {
      startingPosXCoord,
      startingPosYCoord,
      arcRadius,
      rad,
      initialValue
    } = angleConfig
    const p = {}
    p.x = startingPosXCoord + arcRadius * Math.cos((initialValue - 180) * rad) //
    p.y = startingPosYCoord + arcRadius * Math.sin((initialValue - 180) * rad)

    return Math.atan2(startingPosYCoord - p.y, startingPosXCoord - p.x) / rad - 180
  }

  /**
  *
  * @param {Object} arcConfigSettings
  * @return {string} arc path definition
  */
  drawSemiCircleArc (arcConfigSettings) {
    const {
      startingPosXCoord,
      startingPosYCoord,
      arcRadius,
      offsetFromOrigin,
      arcThickness
    } = arcConfigSettings

    const startingPosXCoordForOuterArc = startingPosXCoord + arcRadius
    const startingPosYCoordForOuterArc = startingPosYCoord

    const endPosXCoordForOuterArc = offsetFromOrigin
    const endPosYCoordForOuterArc = startingPosYCoord
    const radiusOfInnerArc = arcRadius - arcThickness

    const endPosXCoordForInnerArc = startingPosXCoordForOuterArc - arcThickness
    const endPosYCoordForInnerArc = startingPosYCoord

    return `M ${startingPosXCoordForOuterArc}, ${startingPosYCoordForOuterArc}
      A ${arcRadius}, ${arcRadius} 0 0 0 ${endPosXCoordForOuterArc},
      ${endPosYCoordForOuterArc} H ${offsetFromOrigin + arcThickness}
      A ${radiusOfInnerArc}, ${radiusOfInnerArc} 0 0 1
      ${endPosXCoordForInnerArc}, ${endPosYCoordForInnerArc} z
    `
  }

  /**
   *
   * @param {Object} arcConfigSettings
   * @return {String} arc path definition
   */
  drawLevelOneArc (arcConfigSettings) {
    const {
      startingPosXCoord,
      startingPosYCoord,
      arcRadius,
      offsetFromOrigin,
      arcThickness,
      rad,
      arcAngle
    } = arcConfigSettings

    const newArcAngle = arcAngle * rad
    const radiusOfInnerArc = arcRadius - arcThickness

    const startingPosXCoordForOuterArc = startingPosXCoord + arcRadius * Math.cos(newArcAngle)
    const startingPosYCoordForOuterArc = startingPosYCoord + arcRadius * Math.sin(newArcAngle)

    const endPosXCoordForOuterArc = offsetFromOrigin
    const endPosYCoordForOuterArc = startingPosYCoord

    const endPosXCoordForInnerArc = startingPosXCoord + radiusOfInnerArc * Math.cos(newArcAngle)
    const endPosYCoordForInnerArc = startingPosYCoord + radiusOfInnerArc * Math.sin(newArcAngle)

    return `M ${startingPosXCoordForOuterArc}, ${startingPosYCoordForOuterArc}
      A ${arcRadius}, ${arcRadius} 0 0 0 ${endPosXCoordForOuterArc},
      ${endPosYCoordForOuterArc} H ${offsetFromOrigin + arcThickness}
      A ${radiusOfInnerArc}, ${radiusOfInnerArc} 0 0 1
      ${endPosXCoordForInnerArc}, ${endPosYCoordForInnerArc} z
    `
  }

  /**
   * @return {Object} render arc
   */
  render () {
    const {
      svgHeight,
      svgWidth
    } = this.props
    const {
      startingPosXCoord,
      startingPosYCoord,
      offsetFromOrigin,
      initialValue,
      rad

    } = this.state
    const arcRadius = this.getArcRadius(startingPosXCoord, offsetFromOrigin)
    const arcThickness = this.getArcThickness(arcRadius)
    const arcAngle = this.calArcAngle({
      startingPosXCoord,
      startingPosYCoord,
      arcRadius,
      initialValue,
      rad
    })

    const semiCircle = this.drawSemiCircleArc({
      startingPosXCoord,
      startingPosYCoord,
      offsetFromOrigin,
      arcRadius,
      arcThickness
    })

    const arc = this.drawLevelOneArc({
      startingPosXCoord,
      startingPosYCoord,
      arcRadius,
      offsetFromOrigin,
      arcThickness,
      rad,
      arcAngle
    })

    return (
      <div>
        <svg
          className='typeRange'
          height={svgHeight}
          width={svgWidth}
          viewBox='0 0 330 165'
        >

          <g className='scale' stroke='red' />
          <path
            fill='#0f4534'
            d={semiCircle}
          />
          <path
            fill='#399988'
            d={arc}
          />
        </svg>
      </div>
    )
  }
}

ReactDialGauge.defaultProps = {
  svgHeight: 165,
  svgWidth: 330
}

ReactDialGauge.propTypes = {
  svgWidth: PropTypes.number,
  svgHeight: PropTypes.number
}

export default ReactDialGauge
