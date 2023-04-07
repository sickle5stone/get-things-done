import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Card, Checkbox, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import styled from 'styled-components';
import { styled as muiStyled } from '@mui/system';

const CardGroup = styled.div`
  // background: red;
  display: flex;
  flex-wrap: wrap;
`

const StyledContainer = styled.div`
  width: 100%;
  padding: 1em;
  display: flex;
  align-items: center;
  // justify-content: space-around;
`

const StyledDeleteButton = muiStyled(IconButton)({
  // alignSelf: 'flex-end'
})

const StyledCard = muiStyled(Card)({
  // flexBasis: '33%',
  // width: '300px',
  height: '100px',
  margin: '10px',
  display: 'flex',
  flex: '1 0 30%',
  alignItems: 'center',
  justifyContent: 'center',
})

export default function DataTable(props) {
  const { handleClearTask, rows = [] } = props;
  // let rows = props.rows || [];


  // let formatRows = rows.map((row) => { });

  let number = rows.length;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Toolbar>
        <Typography variant="subtitle1">{number} selected</Typography>
        <Tooltip>
          <IconButton>
            <DeleteIcon></DeleteIcon>
          </IconButton>
        </Tooltip>
      </Toolbar>
      <CardGroup>
        {
          rows.map((row, idx) => {
            const data = row;
            return <StyledCard key={data?.id || idx} variant="outlined">
              <StyledContainer>
                {data?.task}
              </StyledContainer>
              <StyledDeleteButton onClick={() => handleClearTask(data?.id)}>
                <DeleteIcon />
              </StyledDeleteButton>
            </StyledCard>
          })
        }
      </CardGroup>

    </div>
  );
}
