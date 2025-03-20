"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Jan",
    bookings: 4,
    revenue: 2400,
  },
  {
    name: "Feb",
    bookings: 3,
    revenue: 1398,
  },
  {
    name: "Mar",
    bookings: 5,
    revenue: 9800,
  },
  {
    name: "Apr",
    bookings: 6,
    revenue: 3908,
  },
  {
    name: "May",
    bookings: 4,
    revenue: 4800,
  },
  {
    name: "Jun",
    bookings: 7,
    revenue: 3800,
  },
];

export function BookingStats() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 5,
          }}
        >
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="bookings"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#82ca9d"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
