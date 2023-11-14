import React from "react";

import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";

import Widget from "components/Widget/Widget";

import {
    Text,
    ResponsiveContainer,
    Cell,
    YAxis,
    XAxis,
    BarChart,
    Bar,
    CartesianGrid,
  LabelList,
} from "recharts";

import {
  Star as StarIcon,
} from "@material-ui/icons";

import {
    string,
    object,
} from "prop-types";

import { makeStyles } from "@material-ui/styles";
import styles from "components/Layout/styles";

const useStyles = makeStyles(theme => ({
    divider: theme.divider,
    widgetHeader: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
    },
    widgetHeaderTitle: {
        paddingTop: 25,
        paddingLeft: 35,
        paddingBottom: 10,
        fontWeight: "bold",
    },
    barchartStars: {
        display: "flex",
        alignItems: "center",
        color: "#838383",
    },
    barchartStarsLabel: {
        fontWeight: "bold",
        paddingRight: 5,

    },
}));

const barchartColors = [
  "#26cd73",
  "#d49cff",
  "#ffc633",
  "#ffa800",
  "#ff587c",
];

const customizedLabelHorizontal = props => {
    if (!props.value) {
      return null;
    }

    return (
        <Text
            x={props.x + props.width + 10}
            y={props.y + 8 + props.height / 2} 
            fontSize="24"
            style={{ fill: "#838383" }}
            
        >
            {props.value}
        </Text>
    );
};

const CustomizedLabelB = props => {
    const styles = useStyles();

    return (
        <foreignObject {...props} x={props.x - 40} y={props.y - 15}>
            <Box className={styles.barchartStars}>
                <Typography variant="h5" className={styles.barchartStarsLabel}>
                    {props.graphData[props.index].stars}
                </Typography>
                <StarIcon fontSize="medium" />
            </Box>
        </foreignObject>
    );
};
function EvaluationGraph({ name, graphData }) {
    const styles = useStyles();

    return (
        <Widget
            header={
                <Box className={styles.widgetHeader}>
                    <Box>
                        <Typography
                            variant="h3"
                            color="text"
                            className={styles.widgetHeaderTitle}
                        >
                            {name}
                        </Typography>
                    </Box>
                    <Box display="flex">
                        <span className={styles.divider} />
                    </Box>
              </Box>
            }
          >
            <ResponsiveContainer width="100%" minWidth={500} height={250}>
              <BarChart data={graphData} layout="vertical" margin={{ right: 40, left: 40 }}>
                <XAxis type="number" hide />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    type="category"
                    dataKey="stars"
                    tick={<CustomizedLabelB graphData={graphData} />}
                />
                <CartesianGrid 
                    vertical={false}
                    stroke="#ebf3f0"
                    
                />
                <Bar
                    dataKey="evaluation"
                    background={{ fill: "#e3e5ec", radius: 20 }}
                    radius={[20, 20, 20, 20]}
                        barSize={30}
                        // label={{ dataKey: "evaluation", fill: "black", position: "end" }}
                >
                    <LabelList
                        dataKey="evaluation"
                        content={customizedLabelHorizontal}
                    />
                    {graphData.map((evalData, index) => (
                      <Cell key={index} fill={barchartColors[index]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Widget>
    );
}

EvaluationGraph.propTypes = {
    name: string,
    graphData: object,
}

export default EvaluationGraph;