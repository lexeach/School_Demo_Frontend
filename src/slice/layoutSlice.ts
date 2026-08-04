import { createSlice } from '@reduxjs/toolkit';

export interface LayoutState {
  value: number;
  sidebar: boolean;
  isSheetOpen: boolean;
  isDialogOpen: boolean;
  sheetSide: 'left' | 'right' | 'top' | 'bottom';
  sheetStyle: string;
  sheetComponent?: string;
  dialog: {
    type: string;
    module: string;
    actionButton: string;
    cancelButton: string;
    actionCallbackId: string;
    data: {
      id?: string;
      responseMessage?: string;
    };
    actionTrigger: boolean;
  }; 

  sheet: {
    id: string;
    entity?: object;
  };
  refresh: boolean;
  hideSidebar: boolean;
}

const initialState: LayoutState = {
  value: 0,
  sidebar: false,
  isSheetOpen: false,
  isDialogOpen: false,
  dialog: {
    type: 'delete',
    module: '',
    actionButton: 'delete',
    cancelButton: 'cancel',
    actionCallbackId: '',
    data: {
      id: '',
      responseMessage: '',
    },
    actionTrigger: false,
  },
  sheetSide: 'right',
  sheet: {
    id: '',
    entity: {},
  },
  sheetStyle: '',
  sheetComponent: '',
  refresh: false,
  hideSidebar: false,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setSideBar: state => {
      state.sidebar = !state.sidebar;
    },
    setSheetOpen: (state, action) => {
      state.isSheetOpen = !state.isSheetOpen;
      state.sheetSide = 'right';
      state.sheetStyle = 'p-0';
      if (action) {
        state.sheetComponent = action.payload.component;
        state.sheet.id = action.payload.id;
      }
    },
    setSheetClose: state => {
      state.isSheetOpen = false;
      state.sheet = {
        id: '',
      };
    },
    setDialogClose: state => {
      state.dialog = {
        type: 'delete',
        module: '',
        actionButton: 'Delete',
        cancelButton: 'Cancel',
        actionCallbackId: '',
        data: {
          id: '',
          responseMessage: '',
        },
        actionTrigger: false,
      };
    },
    setDialogOpen: (state, action) => {
      state.isDialogOpen = !state.isDialogOpen;
      if (action.payload) {
        state.dialog.type = action?.payload?.type || 'delete';
        state.dialog.actionCallbackId = action.payload.actionCallbackId;
        state.dialog.data = action.payload.data;
        state.dialog.actionButton = action?.payload?.actionButton || 'Delete';
      }
    },
    removeSidebar: state => {
      state.hideSidebar = true;
    },
    showSidebar: state => {
      state.hideSidebar = false;
    },
    setActionTrigger: state => {
      state.dialog.actionTrigger = !state.dialog.actionTrigger;
    },
    setFitlerOpen: (state, payload) => {
      state.isSheetOpen = !state.isSheetOpen;
      state.sheetSide = 'bottom';
      state.sheetStyle = 'max-h-[80%] p-0';
    },
    setRefresh: state => {
      state.refresh = !state.refresh;
    },
    setFormOpen: (state, payload) => {
      state.isSheetOpen = !state.isSheetOpen;
      state.sheetSide = 'bottom';
      state.sheetStyle = payload.payload.style || 'h-[95%] p-0';
      state.sheetComponent = payload.payload.sheetComponent;
      if (payload.payload.id) {
        state.sheet.id = payload.payload.id;
      }
      state.sheet.entity = payload?.payload?.entity || {};

    },
    setRightBarOpen: (state, payload) => {
      state.isSheetOpen = !state.isSheetOpen;
      state.sheetSide = 'right';
      state.sheetStyle = 'w-[400px]  p-0';
      state.sheetComponent = payload.payload.sheetComponent;
      if (payload.payload.id) {
        state.sheet = payload.payload;
      }
    },
  
  },
});

export const {
  setSideBar,
  setSheetOpen,
  setDialogOpen,
  setFormOpen,
  setFitlerOpen,
  setDialogClose,
  setSheetClose,
  setRefresh,
  setActionTrigger,
  setRightBarOpen,
  removeSidebar,
  showSidebar,
} = layoutSlice.actions;

export default layoutSlice.reducer;
