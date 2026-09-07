import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Checkbox,
  Chip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import { Delete, Edit, Add, Search } from '@mui/icons-material';

// --- MAIN APPLICATION COMPONENT ---
export default function TaskManager() {
  // State Management Hooks
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Dialog/Modal State
  const [openModal, setOpenModal] = useState(false);
  const [currentTask, setCurrentTask] = useState({ id: null, title: '', category: 'Work', completed: false });
  const [isEditing, setIsEditing] = useState(false);

  // useEffect Hook: Load initial sample tasks or handle side effects
  useEffect(() => {
    const initialTasks = [
      { id: 1, title: 'Set up Next.js App Router layout', category: 'Work', completed: true },
      { id: 2, title: 'Style main view using Material UI grid', category: 'Design', completed: false },
      { id: 3, title: 'Optimize rendering strategies (SSR/CSR)', category: 'DevOps', completed: false }
    ];
    setTasks(initialTasks);
  }, []);

  // Handler: Save/Edit Task
  const handleSaveTask = () => {
    if (!currentTask.title.trim()) return;

    if (isEditing) {
      setTasks(tasks.map((t) => (t.id === currentTask.id ? currentTask : t)));
    } else {
      setTasks([...tasks, { ...currentTask, id: Date.now() }]);
    }

    handleCloseModal();
  };

  // Handler: Delete Task
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  // Handler: Toggle Task Completion
  const handleToggleComplete = (id) => {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  // Handler: Modal Controls
  const handleOpenModal = (task = { id: null, title: '', category: 'Work', completed: false }) => {
    setCurrentTask(task);
    setIsEditing(!!task.id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentTask({ id: null, title: '', category: 'Work', completed: false });
  };

  // Derived Values: Filtering & Searching Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === 'All'
        ? true
        : filterStatus === 'Completed'
        ? task.completed
        : !task.completed;
    return matchesSearch && matchesFilter;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header & Status Counter */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Task Management
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Completed: {completedCount} / {tasks.length}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenModal()}
          size="large"
        >
          Add Task
        </Button>
      </Box>

      {/* Control Panel: Search & Filter */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Filter Status</InputLabel>
            <Select
              value={filterStatus}
              label="Filter Status"
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <MenuItem value="All">All Tasks</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Task List Rendering */}
      <Box display="flex" flexDirection="column" gap={2}>
        {filteredTasks.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No tasks found matching your criteria.
          </Typography>
        ) : (
          filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleComplete}
              onEdit={handleOpenModal}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </Box>

      {/* Reusable Dialog for Add/Edit */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="xs">
        <DialogTitle>{isEditing ? 'Edit Task' : 'Create Task'}</DialogTitle>
        <DialogContent display="flex" flexDirection="column" gap={2}>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={currentTask.title}
            onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select
              value={currentTask.category}
              label="Category"
              onChange={(e) => setCurrentTask({ ...currentTask, category: e.target.value })}
            >
              <MenuItem value="Work">Work</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
              <MenuItem value="Design">Design</MenuItem>
              <MenuItem value="DevOps">DevOps</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained">
            {isEditing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

// --- CHILD COMPONENT: Individual Task Card ---
function TaskItem({ task, onToggle, onEdit, onDelete }) {
  return (
    <Card variant="outlined" sx={{ opacity: task.completed ? 0.7 : 1 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, '&:last-child': { pb: 2 } }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Checkbox
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            color="primary"
          />
          <Box>
            <Typography
              variant="body1"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                fontWeight: 500
              }}
            >
              {task.title}
            </Typography>
            <Chip label={task.category} size="small" variant="outlined" sx={{ mt: 0.5 }} />
          </Box>
        </Box>

        <Box>
          <IconButton color="default" onClick={() => onEdit(task)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(task.id)}>
            <Delete />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
}