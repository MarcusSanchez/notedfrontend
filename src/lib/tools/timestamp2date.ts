import { Timestamp } from "@bufbuild/protobuf";


export function timestamp2date(timestamp: Timestamp): Date {
  const milliseconds = (Number(timestamp.seconds) * 1000) + (timestamp.nanos / 1000000);
  return new Date(milliseconds);
}