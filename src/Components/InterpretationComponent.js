import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  Divider,
} from "@mui/material";

export default function InterpretationComponent({
  interpretations,
  chartDescription,
}) {
  console.log("hit", chartDescription);
  return (
    <div>
      {chartDescription && (
        <Typography variant="h6" gutterBottom sx={{ marginBottom: 3 }}>
          {chartDescription}
        </Typography>
      )}
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
