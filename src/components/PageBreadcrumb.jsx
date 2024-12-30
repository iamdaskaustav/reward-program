import * as React from "react";
import { emphasize, styled } from "@mui/material/styles";
import { Breadcrumbs, Chip } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PropTypes from "prop-types";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor = "#FFFFFF";
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const CustomizedBreadcrumbs = ({ pageName }) => {
  return (
    <div role="presentation">
      <Breadcrumbs aria-label="breadcrumb">
        <StyledBreadcrumb
          component="a"
          label="Home"
          icon={<HomeIcon fontSize="small" />}
        />
        <StyledBreadcrumb component="a" href="#" label={pageName} />
      </Breadcrumbs>
    </div>
  );
};

CustomizedBreadcrumbs.propTypes = {
  pageName: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
};

export default CustomizedBreadcrumbs;
