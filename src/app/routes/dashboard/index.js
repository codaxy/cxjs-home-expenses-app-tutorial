import {HtmlElement, Section, FlexRow, FlexCol, MonthField, Button, Repeater, Heading, Text} from 'cx/widgets';
import {bind, expr, KeySelection, tpl, computable} from "cx/ui";
import Controller from './Controller';

import {
    CategoryAxis,
    Chart,
    Column,
    Bar,
    Gridlines,
    NumericAxis,
    PieChart,
    PieSlice,
    ColorMap,
    Legend,
    TimeAxis,
    LineGraph,
} from "cx/charts";

import {Svg, Text as SvgText} from "cx/svg";

import {categories, categoryNames} from '../../data/categories';


export default <cx>

    <h2 putInto="header">Dashboard</h2>

    <FlexCol spacing="large" controller={Controller}>

        <Section mod="card">
            <FlexRow>
                <MonthField style="min-width: 192px; vertical-align: top;"
                    range
                    placeholder="Period"
                    labelPlacement={null}
                    from={bind('range.from')}
                    to={bind('range.to')}
                    showClear={false}/>
                <div style="flex: 1;"/>
            </FlexRow>
        </Section>

        <ColorMap names={expr("{$page.pie}.map(x=>x.name)")} />

        <Section mod="card"
            style="min-width: 274px"
        >
            <FlexRow putInto="header" align="center">
                <Heading level={3}>Timeline</Heading>
                <div
                    style="margin-left: auto"
                    text:tpl="TOTAL: {$page.total:currency;usd;2}"
                />
            </FlexRow>
            <FlexCol>
                <Svg style="width:100%;height:200px">
                    <Chart
                        offset="10 -10 -20 50"
                        axes={{
                            x: <TimeAxis/>,
                            y: <NumericAxis vertical/>
                        }}
                    >
                        <Gridlines xAxis={false}/>
                        <Repeater records={bind("$page.monthlyData")} recordName="$point">
                            <Column
                                size={bind('$point.width')}
                                offset={expr('{$point.width}/2')}
                                x={bind("$point.date")}
                                y={bind("$point.total")}
                                tooltip={tpl("Total: {$point.total:n;2}")}
                                style={{
                                    opacity: { expr: '{$point.date} >= {range.from} && {$point.date} < {range.to} ? 1 : 0.2' }
                                }}
                            />
                            <Column
                                size={bind('$point.width')}
                                offset={expr('{$point.width}/2')}
                                x={bind("$point.date")}
                                y={bind("$point.catTotal")}
                                colorName={computable('$page.selectedCatId', catId => categoryNames[catId])}
                                colorMap="pie"
                                tooltip={tpl("{$point.catTotal:n;2}")}
                                style={{
                                    opacity: { expr: '{$point.date} >= {range.from} && {$point.date} < {range.to} ? 1 : 0.2' }
                                }}
                            />
                        </Repeater>
                    </Chart>
                </Svg>
            </FlexCol>
        </Section>

        <Legend/>

        <FlexRow spacing="large" wrap>
            <Section
                mod="card"
                style="flex: 1 0 250px;"
                bodyStyle="display: flex; flex-direction: column"
            >
                <FlexRow putInto="header" align="center">
                    <Heading
                        level={3}
                        text:tpl="TOTAL: {$page.total:currency;usd;2}"
                    />
                    <Button
                        style="margin-left: auto"
                        mod='hollow'
                        text="Clear Selection"
                        onClick='clearSelection'
                        disabled={expr("!{$page.selectedCatId}")}
                    />
                </FlexRow>

                <Svg style="width:100%;flex:1 0 0%">
                    <PieChart>
                        <Repeater records={bind("$page.pie")} idField="id">
                            <PieSlice
                                value={bind("$record.amount")}
                                r={90}
                                r0={30}
                                offset={4}
                                name={bind("$record.name")}
                                colorMap="pie"
                                selection={{
                                    type: KeySelection,
                                    bind: '$page.selectedCatId',
                                    records: {bind: '$page.pie'},
                                    record: {bind: '$record'},
                                    index: {bind: '$index'},
                                    keyField: 'id'
                                }}
                                tooltip={{
                                    text: {
                                        tpl: "{$record.amount:n;2}"
                                    },
                                    trackMouse: true
                                }}
                            />
                        </Repeater>
                    </PieChart>
                </Svg>
            </Section>

            <Section
                mod="card"
                title="Comparison"
                hLevel={3}
                style="flex: 1 0 250px"
            >
                <div>
                    <Svg style={{
                        width: "100%",
                        minHeight: {expr: "40 + {$page.pie.length} * 25"}
                    }}>
                        <Chart
                            offset="20 -20 -20 100"
                            axes={{
                                x: {type: NumericAxis, snapToTicks: 0},
                                y: {
                                    type: CategoryAxis,
                                    vertical: true,
                                    snapToTicks: 1,
                                    inverted: true,
                                    names: categoryNames
                                }
                            }}
                        >
                            <Gridlines yAxis={false}/>
                            <Repeater
                                records={bind("$page.pie")}
                                recordName="$point"
                                sorters={[{field: 'amount', direction: 'DESC'}]}
                            >
                                <Bar
                                    size={0.8}
                                    x={bind("$point.amount")}
                                    y={bind("$point.id")}
                                    tooltip={tpl("{$point.amount:n;2}")}
                                    colorName={expr("{$point.id} == {$page.selectedCatId} ? {$point.name} : ''")}
                                    colorMap="pie"
                                    selection={{
                                        type: KeySelection,
                                        bind: '$page.selectedCatId',
                                        records: {bind: '$page.pie'},
                                        record: {bind: '$point'},
                                        index: {bind: '$index'},
                                        keyField: 'id'
                                    }}
                                />
                            </Repeater>
                        </Chart>
                    </Svg>
                </div>
            </Section>

        </FlexRow>
    </FlexCol>
</cx>
