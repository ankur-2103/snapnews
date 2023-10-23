import { useMutation } from "@apollo/client";
import { DELETE_POST } from "../utils/queries";

/* This component is used to create Delete Modal */

interface DeleteModalProp{
    id: string; // Id of post
    close: () => void; // Close modal
}

const DeleteModal: React.FC<DeleteModalProp> = ({ id, close }) => {
    const [deletePost] = useMutation(DELETE_POST);// Mutation for delete operation using post id
    
    // handles delete button
    const handleDelete = async () => {
        await deletePost({ variables: { "id": id } })
        close()
    }

    return (
        <div className="flex flex-col p-4 gap-2 bg-white rounded-lg">
            <span className="">Do you want to delete post?</span>
            <span className="flex justify-end gap-4">
                <button className="px-2 py-1 ring-2 ring-blue rounded-lg" onClick={handleDelete}>Delete</button>
                <button className="px-2 py-1 bg-blue text-white rounded-lg" onClick={close}>Cancel</button>
            </span>
        </div>
    )
}

export default DeleteModal;