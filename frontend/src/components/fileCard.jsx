import React, { useState } from "react";
import "@ant-design/v5-patch-for-react-19";
import { Progress } from "antd";
import { Card, CardContent } from "./ui/card";

export default function FileCard({ filePath, fileSize, progress }) {
  return (
    <Card className={""}>
      <CardContent className={"px-4 py-2"}>
        <div className="flex flex-col gap-1">
          <p>{filePath}</p>
          <p className="text-sm">{(fileSize / 1023).toFixed(2)} KB</p>
        </div>
        <Progress
          strokeColor={"#46843D"}
          percent={Math.round(progress * 100)}
          size="small"
        />
      </CardContent>
    </Card>
  );
}
