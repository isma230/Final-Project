"use client";

      import {
        Card,
        Grid,
        Tab,
        TabGroup,
        TabList,
        TabPanel,
        TabPanels,
        Text,
        Title,
        BadgeDelta,
        Flex,
        Metric,
        ProgressBar,
        AreaChart,

      } from "@tremor/react";
      
export default function Dashboard() {
  const chartdata = [
    {
      date: "Jan 22",
      SemiAnalysis: 2890,
      "The Pragmatic Engineer": 2338,
    },
    {
      date: "Feb 22",
      SemiAnalysis: 2756,
      "The Pragmatic Engineer": 2103,
    },
    {
      date: "Mar 22",
      SemiAnalysis: 3322,
      "The Pragmatic Engineer": 2194,
    },
    {
      date: "Apr 22",
      SemiAnalysis: 3470,
      "The Pragmatic Engineer": 2108,
    },
    {
      date: "May 22",
      SemiAnalysis: 3475,
      "The Pragmatic Engineer": 1812,
    },
    {
      date: "Jun 22",
      SemiAnalysis: 3129,
      "The Pragmatic Engineer": 1726,
    },
  ];
  
  const valueFormatter = function(number) {
    return "$ " + new Intl.NumberFormat("us").format(number).toString();
  };
  const kpiData = [
    {
      title: "Sales",
      metric: "$ 12,699",
      progress: 15.9,
      target: "$ 80,000",
      delta: "13.2%",
      deltaType: "moderateIncrease",
    },
    {
      title: "Profit",
      metric: "$ 45,564",
      progress: 36.5,
      target: "$ 125,000",
      delta: "23.9%",
      deltaType: "increase",
    },
    {
      title: "Customers",
      metric: "1,072",
      progress: 53.6,
      target: "2,000",
      delta: "10.1%",
      deltaType: "moderateDecrease",
    },
    {
      title: "Customers",
      metric: "1,072",
      progress: 53.6,
      target: "2,000",
      delta: "10.1%",
      deltaType: "moderateDecrease",
    },
  ];


  return (
    <main className="p-12">
      <Title>Dashboard</Title>
      <Text>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</Text>

      <TabGroup className="mt-6">
        <TabList>
          <Tab>Overview</Tab>
          <Tab>Detail</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
          <Grid numItemsMd={2} numItemsLg={3} className="gap-4 flex felx-wrap -mx-4 px-10 ">
      {kpiData.map((item) => (
        <Card key={item.title}>
          <Flex alignItems="start">
            <div className="truncate">
              <Text>{item.title}</Text>
              <Metric className="truncate">{item.metric}</Metric>
            </div>
            <BadgeDelta deltaType={item.deltaType}>
              {item.delta}
            </BadgeDelta>
          </Flex>
          <Flex className="mt-4 space-x-2">
            <Text className="truncate">{`${item.progress}% (${item.metric})`}</Text>
            <Text className="truncate">{item.target}</Text>
          </Flex>
          <ProgressBar value={item.progress} className="mt-2" />
        </Card>
      ))}
    </Grid>
            <div className="mt-6">
            <Card>
    <Title>Newsletter revenue over time (USD)</Title>
    <AreaChart
      className="h-72 mt-4"
      data={chartdata}
      index="date"
      categories={["SemiAnalysis", "The Pragmatic Engineer"]}
      colors={["indigo", "cyan"]}
      valueFormatter={valueFormatter}
    />
  </Card>
            </div>
          </TabPanel>
          <TabPanel>
            <div className="mt-6">

            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </main>
  );
}