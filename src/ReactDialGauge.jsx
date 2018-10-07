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
      initialValue: 80,
      innerArcFillColor: '#F94F5B'
    }
    this.drawMultipleScaleLine = this.drawMultipleScaleLine.bind(this)
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
    return arcRadius / 4
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
   * @param {Object} lineConfig
   *
   * @return {Object} svg line element
   */
  drawScaleLine (lineConfig) {
    const {
      x1,
      y1,
      x2,
      y2,
      x,
      y,
      index,
      content
    } = lineConfig

    return (
      <g>
        <line
          index={index}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke='#aaa'
          strokeWidth='2'
        />
        <text
          index={index}
          x={x}
          y={y}
          fill='#aaa'
          textAnchor='middle'
          dominantBaseline='alphabetic'
          font='12px verdana, sans-serif'
        >
          {content}

        </text>
      </g>
    )
  }

  /**
   *
   * @param {*} config
   *
   * @return{*} Dom element
   */
  drawMultipleScaleLine (config) {
    const {
      arcRadius,
      arcThickness,
      startingPosXCoord,
      startingPosYCoord,
      rad
    } = config
    const outerScaleRadius = arcRadius + 5
    const innerScaleRadius = (arcRadius - arcThickness) - 5
    const scaleRadiusT = arcRadius + 20
    const lines = []
    let n = 0
    for (let scaleAngle = -180; scaleAngle <= 0; scaleAngle += 30) {
      if (scaleAngle === -30 || scaleAngle === -90 || scaleAngle === -150
      ) {
        const outerScaleRadiusXCoord = startingPosXCoord + outerScaleRadius * Math.cos(scaleAngle * rad)
        const outerScaleRadiusYCoord = startingPosYCoord + outerScaleRadius * Math.sin(scaleAngle * rad)
        const innerScaleRadiusXCoord = startingPosXCoord + innerScaleRadius * Math.cos(scaleAngle * rad)
        const innerScaleRadiusYCoord = startingPosYCoord + innerScaleRadius * Math.sin(scaleAngle * rad)
        const scaleRadiusTX = startingPosXCoord + scaleRadiusT * Math.cos(scaleAngle * rad)
        const scaleRadiusTY = startingPosYCoord + scaleRadiusT * Math.sin(scaleAngle * rad)
        lines.push(this.drawScaleLine({
          index: scaleAngle,
          content: `Level ${n}`,
          x1: outerScaleRadiusXCoord,
          y1: outerScaleRadiusYCoord,
          x2: innerScaleRadiusXCoord,
          y2: innerScaleRadiusYCoord,
          x: scaleRadiusTX,
          y: scaleRadiusTY
        }))
        n += 1
      }
    }
    return lines
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
   * @param {Object} needleConfig
   * @return {String} needle path definition
   */
  drawNeedle (needleConfig) {
    const {
      startingPosXCoord,
      startingPosYCoord,
      arcRadius,
      rad,
      arcAngle
    } = needleConfig

    const nx1 = startingPosXCoord + 5 * Math.cos((arcAngle - 90) * rad)
    const ny1 = startingPosYCoord + 5 * Math.sin((arcAngle - 90) * rad)

    const nx2 = startingPosXCoord + (arcRadius + 15) * Math.cos(arcAngle * rad)
    const ny2 = startingPosYCoord + (arcRadius + 15) * Math.sin(arcAngle * rad)

    const nx3 = startingPosXCoord + 5 * Math.cos((arcAngle + 90) * rad)
    const ny3 = startingPosYCoord + 5 * Math.sin((arcAngle + 90) * rad)

    return `
    ${nx1},${ny1} ${nx2},${ny2} ${nx3},${ny3}`
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
      innerArcFillColor,
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

    const needle = this.drawNeedle({
      startingPosXCoord,
      startingPosYCoord,
      arcRadius,
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

          <g className='scale' stroke='red'>
            {this.drawMultipleScaleLine({
              arcRadius,
              arcThickness,
              startingPosXCoord,
              startingPosYCoord,
              rad
            })}
          </g>
          <path
            fill='#34A498'
            d={semiCircle}
            id='txt-path'
          />
          <path
            fill={innerArcFillColor}
            d={arc}
          />
          <polygon
            fill='red'
            points={needle}
          />

          <g>
            <circle
              cx={svgWidth / 2}
              cy='165'
              r='40'
              stroke=''
              strokeWidth='3'
              fill='#399988'
            />
            <text
              x='50%'
              y='150'
              textAnchor='middle'
              stroke='#51c5cf'
              strokeWidth='2px'
              dy='.3em'
            >
              {initialValue}
            </text>
          </g>
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
