import AddIcon from '@mui/icons-material/Add';
import { Box, Button } from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridColumns,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowParams,
  GridRowsProp,
  GridToolbar,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarQuickFilter,
  MuiEvent,
} from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import * as React from 'react';
import { useState } from 'react';
import { grey } from '@mui/material/colors';

interface EditToolbarProps {
  emptyRecords: any;
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (newModel: (oldModel: GridRowModesModel) => GridRowModesModel) => void;
  setFilterButtonEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, setFilterButtonEl, emptyRecords } = props;

  const handleClick = () => {
    const id = Date.now();
    // todo prop
    setRows((oldRows) => [{ id, ...emptyRecords, isNew: true }, ...oldRows]);
    setRowModesModel((oldModel) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      ...oldModel,
    }));
  };

  return (
    <GridToolbarContainer sx={{ mt: 1, mx: 1 }}>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add Record
      </Button>
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <GridToolbarQuickFilter sx={{ ml: 'auto' }} />
    </GridToolbarContainer>
  );
}

export default function DataTable({
  initialColumns,
  initialRows,
  loading,
  emptyRecords,
  handleCreateRow,
  handleUpdateRow,
  handleDeleteRow,
}: {
  initialColumns: GridColDef[];
  initialRows: any[];
  emptyRecords: any;
  handleCreateRow: (values: any) => Promise<any>;
  handleUpdateRow: (values: any) => Promise<any>;
  handleDeleteRow: (id: any) => Promise<any>;
  loading?: boolean;
}) {
  const [rows, setRows] = useState(initialRows);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [filterButtonEl, setFilterButtonEl] = React.useState<HTMLButtonElement | null>(null);

  const handleRowEditStart = (params: GridRowParams, event: MuiEvent<React.SyntheticEvent>) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const actionsColumn = {
    field: 'actions',
    type: 'actions',
    headerName: 'Actions',
    width: 100,
    cellClassName: 'actions',
    getActions: ({ id }: { id: any }) => {
      const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

      if (isInEditMode) {
        return [
          <GridActionsCellItem
            key={1}
            icon={<SaveIcon />}
            label="Save"
            onClick={handleSaveClick(id)}
          />,
          <GridActionsCellItem
            key={2}
            icon={<CancelIcon />}
            label="Cancel"
            className="textPrimary"
            onClick={handleCancelClick(id)}
            color="inherit"
          />,
        ];
      }

      return [
        <GridActionsCellItem
          key={1}
          icon={<EditIcon />}
          label="Edit"
          className="textPrimary"
          onClick={handleEditClick(id)}
          color="inherit"
        />,
        <GridActionsCellItem
          key={2}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />,
      ];
    },
  };
  const columns: GridColumns = [...initialColumns, actionsColumn];

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    const editedRow = rows.find((row) => row.id === id);
    console.log(editedRow);

    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    handleDeleteRow(id).then((value) => {
      setRows(rows.filter((row) => row.id !== id));
    });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    let updatedRow: any;
    console.log('new row', newRow);
    if (newRow.isNew) {
      await handleCreateRow(newRow).then((value) => {
        updatedRow = { ...newRow, id: value.id, isNew: false };
      });
    } else {
      await handleUpdateRow(newRow).then((value) => {
        updatedRow = { ...newRow, id: value.id, isNew: false };
      });
    }

    console.log('updated row', updatedRow);

    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  return (
    <Box
      sx={{
        height: 415,
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        editMode="row"
        rowModesModel={rowModesModel}
        loading={loading}
        onRowModesModelChange={(newModel) => setRowModesModel(newModel)}
        onRowEditStart={handleRowEditStart}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: {
            setRows,
            setRowModesModel,
            emptyRecords,
            panel: {
              anchorEl: filterButtonEl,
            },
            toolbar: {
              setFilterButtonEl,
            },
          },
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </Box>
  );
}
