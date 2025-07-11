import PropTypes from "prop-types";
import { useDrag } from "react-dnd";
import { ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";

const Task = ({ text, taskId, handleDelete }) => {
  const navigate = useNavigate();
  const [, drag] = useDrag({
    type: "TASK_ITEM",
    item: { taskId },
  });

  const handleViewDetails = () => {
    navigate(`/tasks/${taskId}`);
  };

  return (
    <div ref={drag}>
      <ListItem
        sx={{
          border: "1px solid #ccc",
          borderRadius: "5px",
          marginBottom: "5px",
          cursor: "pointer",
        }}
        onClick={handleViewDetails}
      >
        <ListItemText primary={text} />
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          color="secondary"
          onClick={(e) => {
            e.stopPropagation();
            handleDelete(taskId);
          }}
        >
          <DeleteIcon />
        </IconButton>
      </ListItem>
    </div>
  );
};

Task.propTypes = {
  text: PropTypes.string.isRequired,
  taskId: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default Task;
