import React, {Component} from "react";


import {
    buildStyles,
    CircularProgressbar,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";


export default class LoadingInExamplePage extends Component {
    render() {

        return (
            <CircularPercent>
                <CircularProgressbar value={this.props.percentage} text={`${this.props.percentage}%`}
                                     styles={buildStyles({

                                         // Text size
                                         textSize: '14px',

                                         // Colors
                                         pathColor: '#75C3DC',
                                         textColor: '#75C3DC',

                                     })}

                />
            </CircularPercent>

        );
    }
}

function CircularPercent(props) {
    return (
        <div>
            <div style={{width: "5%"}}>{props.children}</div>
            <p>{props.description}</p>
        </div>


    );
}
