import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    Cell,
    Label
} from 'recharts';

const colors = [
    '#1f77b4',
    '#ff7f0e',
    '#2ca02c',
    '#d62728',
    '#9467bd',
    '#8c564b',
    '#e377c2',
    '#7f7f7f',
    '#bcbd22',
    '#17becf',
];

const Candlestick = ({ x, y, width, height, low, high, open, close }) => {
    const isRising = open < close;
    const fill = isRising ? '#26a69a' : '#ef5350';
    const line = isRising ? [open, close] : [close, open];

    return (
        <g>
            <line x1={x + width / 2} y1={y + height} x2={x + width / 2} y2={y} stroke={fill} strokeWidth="1.5" />
            <rect x={x} y={y} width={width} height={height} fill={fill} stroke={fill} strokeWidth="1.5" />
            <line x1={x + width / 2} y1={y + line[0]} x2={x + width / 2} y2={y + line[1]} stroke={fill} strokeWidth="1.5" />
            <line x1={x} y1={y + height / 2} x2={x + width} y2={y + height / 2} stroke={fill} strokeWidth="1.5" />
        </g>
    );
};

const prepareData = data => {
    return data.map(item => ({
        ...item,
        ts: new Date(item.date[0], item.date[1] - 1, item.date[2]).getTime(),
        openClose: [item.open, item.close],
        highLow: [item.high, item.low],
    }));
};

const SecurityCandlestickChart = ({ data }) => {
    const response = data;
    data = data.data

    if (!data || data.length === 0) {


        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
                <h1>Извините, данные о бумаге отсутствуют</h1>
            </div>
        )
    }

    const preparedData = prepareData(data);
    const minValue = Math.min(...preparedData.map(item => item.low));
    const maxValue = Math.max(...preparedData.map(item => item.high));
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h2>{response.name}</h2>
            <p>{`Режим торгов: ${response.primaryBoardId}`}</p>
            <p>{`Короткое имя: ${response.shortname}`}</p>
            <p>{`Идентификатор на бирже: ${response.secId}`}</p>
            <BarChart
                width={800}
                height={400}
                data={preparedData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
                <XAxis dataKey="ts" tickFormatter={(tick) => new Date(tick).toLocaleDateString()} />
                <YAxis domain={[minValue, maxValue]} />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="openClose" fill="#8884d8" shape={<Candlestick />} >
                    {preparedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                </Bar>
                <Tooltip />
                <Legend />
            </BarChart>
        </div>
    );
};

export default SecurityCandlestickChart;
