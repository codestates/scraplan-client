import React from "react";
import _ from "lodash";
import RGL, { Responsive, WidthProvider } from "react-grid-layout";
import GridLayout from "react-grid-layout";
import PlanCard from "./PlanCard";
import SetTime from "../UI/SetTime";
import SetTheme from "../UI/SetTheme";
import "./PlanTimeline.scss";

const ReactGridLayout = WidthProvider(RGL);

class PlanTimeline extends React.Component {
  static defaultProps = {
    isDraggable: true,
    isResizable: true,
    items: 6,
    rowHeight: 28,
    onLayoutChange: function () {},
    cols: 1,
    rows: 96,
    compactType: null,
    preventCollision: true,
    transformScale: 1,
    width: 240,
  };

  constructor(props) {
    super(props);
    const layout = this.generateLayout();
    this.state = { layout };
  }

  generateDOM() {
    return _.map(_.range(this.props.items), (i) => {
      return (
        <div className="plancard" key={i}>
          <SetTheme />
          <SetTime />
          <div className="plancard__title">{`제목 ${i}`}</div>
          <button className="plancard__delete-btn"></button>
        </div>
      );
    });
  }
  generateLayout() {
    const p = this.props;
    return _.map(new Array(p.items), function (item, i) {
      const y = _.result(p, "y") || Math.ceil(1) + 1;
      return {
        x: (i * 1) % 12,
        y: Math.floor(i / 6),
        w: 1,
        h: y,
        i: i.toString(),
      };
    });
  }
  onLayoutChange(layout) {
    this.props.onLayoutChange(layout);
  }
  render() {
    return (
      <ReactGridLayout
        id="plantimeline"
        layout={this.state.layout}
        onLayoutChange={this.onLayoutChange}
        {...this.props}
      >
        {this.generateDOM()}
      </ReactGridLayout>
    );
  }
}
export default PlanTimeline;
