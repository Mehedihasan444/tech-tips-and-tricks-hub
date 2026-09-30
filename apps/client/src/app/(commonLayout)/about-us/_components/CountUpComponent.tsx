"use client"
import CountUp from "react-countup";
const CountUpComponent = ({ value }: { value: number }) => {
  return (
    <CountUp
      start={0}
      end={value}
      duration={2.75}
    //   separator=" "
        // decimals={4}
        decimal=","
      className="text-teal-600 text-4xl font-bold"
    ></CountUp>
  );
};

export default CountUpComponent;