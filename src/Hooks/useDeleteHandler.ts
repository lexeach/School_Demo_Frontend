import { useDispatch } from 'react-redux';
import { ErrorToaster, SuccessToaster } from '@/UI/Elements/Toast';
import { setDialogClose, setRefresh } from '@/slice/layoutSlice';
import { useDeletePaperMutation } from '@/service/paper';
import { useDeleteChildrenMutation } from '@/service/children';
import { useDeleteSubjectMutation } from '@/service/subject';
import { useDeleteSyllabusMutation } from '@/service/syllabus';

export const useDeleteHandler = (
  type: string,
  id: number | string,
  actionCallbackId: string
) => {
  const dispatch = useDispatch();
  const [deletePaper] = useDeletePaperMutation();
  const [deleteChildren] = useDeleteChildrenMutation();
  const [deleteSubject] = useDeleteSubjectMutation();
  const [deleteSyllabus] = useDeleteSyllabusMutation();
  

  if (!actionCallbackId) {
    return;
  }
  const deleteType = {
    deletePaper,
    deleteChildren,
    deleteSubject,
    deleteSyllabus
  };
  // return
  const handleDelete = async () => {
    try {
      await deleteType[type](id).unwrap();
      SuccessToaster(`Deleted successfully`);
      dispatch(setRefresh());
      dispatch(setDialogClose());
    } catch (err) {
      console.log('Failed to delete data dictionary:');
      ErrorToaster(err?.data?.message || 'Something went wrong');
    }
  };
  return handleDelete;
};
