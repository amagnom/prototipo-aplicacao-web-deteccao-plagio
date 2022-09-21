import * as React from "react";
import {Component} from "react";
import ReactEcharts from "echarts-for-react";


const style_echarts = {
    height: "80vh",
    width: "100%",
};

export default class Graph extends Component {


    constructor(props) {
        super(props);

        this.state = {
            datafiles: props.datafiles,
        };
        this.manipulate_infos_graph = this.manipulate_infos_graph.bind(this);
    }


    //Chart options
    data_graph_links = []
    data_graph_file_names = []


    option = {
        responsive: false,

        series: [
            {
                name: 'Graph Result',
                type: "graph",
                layout: 'circular',
                symbolSize: 50,
                color: "#3D7A8F",
                label: {
                    show: true,
                    formatter: '{b}'
                },


                data: this.data_graph_file_names,

                links: this.data_graph_links,

                lineStyle: {
                    opacity: 0.9,
                    width: 2,
                },

                roam: true,

                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 10
                    }
                }
            }
        ]
    };


    notContainsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i].name === obj.name) {
                return false;
            }
        }
        return true;
    }


    manipulate_infos_graph() {
        let data = this.state.datafiles
        let list_links = []

        for (let i = 0; i < data.length; i++) {
            let name_source = data[i].name_file_source
            name_source = name_source.substring(0, name_source.indexOf('.'));

            if (this.notContainsObject({name: name_source}, this.data_graph_file_names)) {
                this.data_graph_file_names.push({name: name_source});
            }

            for (let j = 0; j < data[i].relation_files.length; j++) {
                let relation_file = data[i].relation_files[j]
                let name_dest = relation_file.name_file_dest
                let similarity = relation_file.percent.toString()
                name_dest = name_dest.substring(0, name_dest.indexOf('.'));
                let new_element = [name_source, name_dest]


                if (!this.verify_list_links(list_links, new_element)) {
                    list_links.push(new_element)
                    this.data_graph_links.push({
                        source: name_source,
                        target: name_dest,
                        label: {show: true, formatter: similarity}
                    })
                }


            }

        }

        this.data_graph_links = []
        this.data_graph_file_names = []

    }


    verify_list_links(list_links, new_element) {
        let flag_equals = false
        for (let i = 0; i < list_links.length; i++) {
            let new_element_inverted_posi0 = new_element[0]
            let new_element_inverted_posi1 = new_element[1]
            let new_element_inverted = []
            new_element_inverted[0] = new_element_inverted_posi1
            new_element_inverted[1] = new_element_inverted_posi0

            if (flag_equals === false) {
                flag_equals = this.arraysEqual(list_links[i], new_element) || this.arraysEqual(list_links[i], new_element_inverted);
            }

        }
        return flag_equals;
    }

    arraysEqual(a1, a2) {
        return JSON.stringify(a1) === JSON.stringify(a2);
    }

    render() {
        this.manipulate_infos_graph()


        return (


            <ReactEcharts option={this.option} style={style_echarts}/>

        );
    }

}


