<Section mod="card" header={<h3>Expenses over time</h3>}>
    <div class="kpi-main" style="height: 450px; width: 600px">
        <Svg style="width:100%;height:400px;" margin="60 10 60 60">
            <Chart
                anchors="0 1 0.8 0"
                offset="0 0 -50 0"
                axes={
                    {
                        x: (
                            <TimeAxis
                                min={bind("$page.range.from")}
                                max={bind("$page.range.to")}
                                snapToTicks={false}
                            />
                        ),
                        y: <NumericAxis vertical />
                    }
                }
            >
                <Rectangle fill="white" />
                <Gridlines />
                <ClipRect>
                    <ColumnGraph
                        data={bind("$page.histogram")}
                        colorIndex={4}
                        offset={15 * 24 * 60 * 60 * 1000}
                        //15 days
                        size={30 * 24 * 60 * 60 * 1000}
                        //30 days
                        xField="date"
                        yField="amount"
                    />
                </ClipRect>
            </Chart>
            <Chart
                anchors="0.8 1 1 0"
                axes={{ x: <TimeAxis />, y: <NumericAxis vertical /> }}
            >
                <Rectangle fill="white" />
                <Gridlines />
                <ColumnGraph
                    data={bind("$page.histogram")}
                    size={30 * 24 * 60 * 60 * 1000}
                    offset={15 * 24 * 60 * 60 * 1000}
                    xField="date"
                    yField="amount"
                />
                <Range x1={bind("$page.range.from")} x2={bind("$page.range.to")} hidden>
                    <ClipRect>
                        <ColumnGraph
                            data={bind("$page.histogram")}
                            colorIndex={4}
                            size={30 * 24 * 60 * 60 * 1000}
                            offset={15 * 24 * 60 * 60 * 1000}
                            xField="date"
                            yField="amount"
                        />
                    </ClipRect>
                    <Range
                        colorIndex={4}
                        x1={bind("$page.range.from")}
                        x2={bind("$page.range.to")}
                        style="cursor:move"
                        draggableX
                        constrainX
                    />
                </Range>
                <Marker
                    colorIndex={4}
                    x={bind("$page.range.from")}
                    size={10}
                    draggableX
                    constrain
                />
                <Marker
                    colorIndex={4}
                    x={bind("$page.range.to")}
                    size={10}
                    draggableX
                    constrain
                />
            </Chart>
        </Svg>
    </div>
</Section>