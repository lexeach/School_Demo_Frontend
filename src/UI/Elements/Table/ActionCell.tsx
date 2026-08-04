import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  setDialogOpen,
  setFormOpen,
} from '@/slice/layoutSlice';
import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import UIButton from '../Button';

interface ActionConfig {
  renderComponent: (onClick: () => void) => React.ReactNode;
  onClick: () => void;
}

interface ActionCellProps {
  row: any;
  viewUrl?: string;
  formComponent?: string;
  deleteComponent: string;
  addField?: string;
  chatEntity?: string;
  onSync?: (id: string) => void;
  actionsConfig?: ActionConfig[];
}

const ActionCell: React.FC<ActionCellProps> = ({
  row,
  viewUrl,
  formComponent,
  deleteComponent,
  actionsConfig,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedRow = row.original;
  const actions = selectedRow.available_actions;

  return (
    <div className="flex justify-end text-right">
      {actions?.view && (
        <UIButton
          variant="sky"
          size="xs"
          className="ml-3 rounded-full"
          tooltipContent={('View Details')}
          onClick={() => navigate(`/${viewUrl}/${selectedRow._id}`)}
        >
          {/* <EyeIcon width={20} /> */}
          View
        </UIButton>
      )}
      {actions?.update && (
        <UIButton
          variant="sky"
          size="xs"
          className="ml-3 rounded-full"
          tooltipContent={t('update_button')}
          onClick={() => {
            dispatch(
              setFormOpen({
                sheetComponent: formComponent,
                id: selectedRow._id,
              })
            );
          }}
        >
          {/* <PencilSquareIcon width={20} /> */}
          Edit
        </UIButton>
      )}
      {actions?.delete && (
        <UIButton
          variant="sky"
          size="xs"
          className="ml-3 rounded-full"
          tooltipContent={('Delete')}
          onClick={() => {
            dispatch(
              setDialogOpen({
                actionCallbackId: deleteComponent,
                data: { id: selectedRow._id },
              })
            );
          }}
        >
          {/* <TrashIcon width={20} /> */}
          Delete
        </UIButton>
      )}
      {actionsConfig?.map(action =>
        action.renderComponent(() => action.onClick())
      )}
    </div>
  );
};

export default ActionCell;
