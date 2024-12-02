"use client";
import ReactTimeago from "react-timeago";

type Props = {
  date: string;
};

function TimeAgoText({ date }: Props) {
  return <ReactTimeago date={date} />;
}

export default TimeAgoText;
