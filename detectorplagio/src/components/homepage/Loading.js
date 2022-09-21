import React, {Component} from "react";


import {
    buildStyles,
    CircularProgressbar,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


export default class Loading extends Component {
    render() {

        return (
            <CirclePercent>
                <CircularProgressbar value={this.props.percentage} text={`${this.props.percentage}%`}
                                     styles={buildStyles({

                                         // Text size
                                         textSize: '14px',

                                         // Colors
                                         pathColor: '#75C3DC',
                                         textColor: '#75C3DC',

                                     })}

                />
            </CirclePercent>

        );
    }
}

function CirclePercent(props) {
    return (
        <div>
            <div style={{width: "20%", paddingTop: "18vh"}}>{props.children}</div>
            <p>{props.description}</p>
        </div>
    );
}
