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

export default function MapInterpretationComponent({
  interpretations,
  chartDescription,
  chartData,
}) {
  console.log("interpretation chart data", chartData);

  // Render chart details for each map layer
  const renderChartDetails = (chartLayerId, chartLayer) => {
    const period = chartLayer?.metaData?.dimensions?.pe?.map((pe) => (
      <Chip label={chartLayer.metaData.items[pe]?.name} />
    ));
    const orgunit = chartLayer?.metaData?.dimensions?.ou?.map((ou) => (
      <Chip label={chartLayer.metaData.items[ou]?.name} />
    ));
    const dataItem = chartLayer?.metaData?.dimensions?.dx?.map((di) => (
      <Chip label={chartLayer.metaData.items[di]?.name} />
    ));
    const otherDimensions = Object.keys(chartLayer?.metaData?.dimensions ?? {})
      ?.filter((dim) => !["ou", "pe", "dx"].includes(dim))
      ?.map((dim) =>
        chartLayer?.metaData?.dimensions[dim]?.map((item) => (
          <Chip label={chartLayer.metaData.items[item]?.name} />
        ))
      );

    return (
      <Card key={chartLayerId} sx={{ marginBottom: 2 }}>
        <CardContent>
          <Typography variant="h6">
            Chart Detail for {dataItem} Layer
          </Typography>
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
    );
  };

  return (
    <div>
      {/* {Object?.keys(chartData)?.map((chartLayerId) => { */}
      {chartData && typeof chartData === "object"
        ? Object.keys(chartData).map((chartLayerId) => {
            const chartLayer = chartData[chartLayerId];

            return (
              <div key={chartLayerId}>
                {/* Render chart details for this map layer */}
                {renderChartDetails(chartLayerId, chartLayer)}

                {/* Render interpretations */}
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
                        Created:{" "}
                        {new Date(interpretation.created).toLocaleString()}
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
                                    <strong>
                                      {comment?.user?.displayName}
                                    </strong>{" "}
                                    (
                                    {new Date(
                                      comment?.created
                                    ).toLocaleString()}
                                    )
                                  </Typography>
                                </ListItem>
                                {index <
                                  interpretation?.comments?.length - 1 && (
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
          })
        : null}
    </div>
  );
}
