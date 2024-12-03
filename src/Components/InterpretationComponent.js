import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider,
  Chip,
} from "@mui/material";

export default function InterpretationComponent({
  interpretations,
  chartDescription,
  chartData,
}) {
  const period = chartData?.metaData?.dimensions?.pe?.map((pe) => (
    <Chip label={chartData.metaData.items[pe]?.name} />
  ));
  const orgunit = chartData?.metaData?.dimensions?.ou?.map((ou) => (
    <Chip label={chartData.metaData.items[ou]?.name} />
  ));
  const dataItem = chartData?.metaData?.dimensions?.dx?.map((di) => (
    <Chip label={chartData.metaData.items[di]?.name} />
  ));
  const otherDimensions = Object.keys(chartData?.metaData?.dimensions ?? {})
    ?.filter((dim) => !["ou", "pe", "dx"].includes(dim))
    ?.map((dim) =>
      chartData?.metaData?.dimensions[dim]?.map((item) => (
        <Chip label={chartData?.metaData?.items[item]?.name} />
      ))
    );
  console.log(
    "hit",
    chartData?.metaData,
    Object.keys(chartData?.metaData?.dimensions ?? {}),
    Object.keys(chartData?.metaData?.dimensions ?? {})?.filter(
      (dim) => !["ou", "pe", "dx"].includes(dim)
    )
  );
  return (
    <div>
      {
        <Card sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6">Chart Details</Typography>
            <Typography variant="body1" gutterBottom sx={{ marginBottom: 3 }}>
              {chartDescription && <>Chart Description: {chartDescription}</>}
              <br />
              Period Dimension: {period} <br />
              Orgunit Dimension: {orgunit} <br />
              Data Item Dimension: {dataItem} <br />
              {otherDimensions?.length > 0 && (
                <>Other Dimensions: {otherDimensions}</>
              )}
            </Typography>
          </CardContent>
        </Card>
      }
      {interpretations?.map((interpretation) => (
        <Card key={interpretation.id} sx={{ marginBottom: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Interpretation by: {interpretation?.user?.displayName}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {interpretation?.text}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              Created: {new Date(interpretation.created).toLocaleString()}
            </Typography>

            {interpretation?.comments?.length > 0 ? (
              <>
                <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                  Comments:
                </Typography>
                <List>
                  {interpretation?.comments?.map((comment, index) => (
                    <React.Fragment key={index}>
                      <ListItem>
                        <Typography variant="body2">
                          {comment?.text} —{" "}
                          <strong>{comment?.user?.displayName}</strong> (
                          {new Date(comment?.created).toLocaleString()})
                        </Typography>
                      </ListItem>
                      {index < interpretation?.comments?.length - 1 && (
                        <Divider />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </>
            ) : (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ marginTop: 2 }}
              >
                No comments available.
              </Typography>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
