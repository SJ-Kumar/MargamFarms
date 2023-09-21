import React, { useEffect, useState } from 'react';
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "@mui/material";
import { tokens } from "../assets/styles/theme";
import axios from 'axios';
import Select from 'react-select';

const Piechart = ({ isDashboard = false }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [pieData, setPieData] = useState([]);
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);
    const [filterYear, setFilterYear] = useState([]);
    const [filterMonth, setFilterMonth] = useState([]);

    const getMonths = () => {
        setMonths([
          { label: 'January', value: '01' },
          { label: 'February', value: '02' },
          { label: 'March', value: '03' },
          { label: 'April', value: '04' },
          { label: 'May', value: '05' },
          { label: 'June', value: '06' },
          { label: 'July', value: '07' },
          { label: 'August', value: '08' },
          { label: 'September', value: '09' },
          { label: 'October', value: '10' },
          { label: 'November', value: '11' },
          { label: 'December', value: '12' }
        ]);
      }
      const getYears = () => {
        setYears([
            { label: '2022', value: '2022' },
            { label: '2023', value: '2023' },
            { label: '2024', value: '2024' },
            { label: '2025', value: '2025' },
        ])
      }
      useEffect(() => {
        getMonths();
        getYears();
      }, []);
      


    useEffect(() => {
        axios.post('/api/orders/product-sales', {
          years: filterYear.map(item => item.value),
          months: filterMonth.map(item => item.value),
        })
          .then((response) => {
            setPieData(response.data);
            //console.log("response:", response.data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
      }, [filterYear, filterMonth]);

      const handleFilterYearChange = (selectedOptions) => {
        setFilterYear(selectedOptions);
      };
      
      const handleFilterMonthChange = (selectedOptions) => {
        setFilterMonth(selectedOptions);
      };

            

    return (
        <>
{!isDashboard && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, marginRight: '40px' }}>
                        <Select
                            isMulti
                            value={filterYear}
                            options={years}
                            onChange={handleFilterYearChange}
                            placeholder="Year"
                        />
                    </div>
                    <div style={{ flex: 1, marginLeft: '40px' }}>
                        <Select
                            isMulti
                            value={filterMonth}
                            options={months}
                            onChange={handleFilterMonthChange}
                            placeholder="Month"
                        />
                    </div>
                </div>
            )}

        <ResponsivePie
            data={pieData}
            theme={{
                axis: {
                    domain: {
                        line: {
                            stroke: colors.grey[100],
                        },
                    },
                    legend: {
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                    ticks: {
                        line: {
                            stroke: colors.grey[100],
                            strokeWidth: 1,
                        },
                        text: {
                            fill: colors.grey[100],
                        },
                    },
                },
                legends: {
                    text: {
                        fill: colors.grey[100],
                    },
                },
            }}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderColor={{
                from: "color",
                modifiers: [["darker", 0.2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={colors.grey[100]}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
            enableArcLabels={false}
            arcLabelsRadiusOffset={0.4}
            arcLabelsSkipAngle={7}
            arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 2]],
            }}
            defs={[
                {
                    label: "dots",
                    type: "patternDots",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    size: 4,
                    padding: 1,
                    stagger: true,
                },
                {
                    id: "lines",
                    type: "patternLines",
                    background: "inherit",
                    color: "rgba(255, 255, 255, 0.3)",
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10,
                },
            ]}
            legends={!isDashboard ? [
                {
                    anchor: "bottom",
                    direction: "row",
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 50,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: "#999",
                    itemDirection: "left-to-right",
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: "circle",
                    effects: [
                        {
                            on: "hover",
                            style: {
                                itemTextColor: "#000",
                            },
                        },
                    ],
                },
            ] : []}
        />
        </>
    );
};

export default Piechart;