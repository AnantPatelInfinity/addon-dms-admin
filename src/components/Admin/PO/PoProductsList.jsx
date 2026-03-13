import { useEffect, useState } from 'react';
import useModal from '../../Modal/useModal';
import PoProductModal from './PoProductModal';
import Swal from 'sweetalert2';
import { useApi } from '../../../context/ApiContext';
import { Link } from 'react-router';

const PoProductsList = ({ poId, companyId, setIsCheckPro, shipTo, dealerPoId, selectedDePo, setProData }) => {
    const { get, deleteById } = useApi();
    const modal = useModal();
    const [items, setItems] = useState([]);
    const [editId, setEditId] = useState(null);
    const [triggerApi, setTriggerApi] = useState(false);
    useEffect(() => {
        if (poId) {
            getItemsData();
            setTriggerApi(false);
        }
    }, [poId, triggerApi]);

    useEffect(() => {
        setIsCheckPro(items);
    }, [items, setIsCheckPro]);

    const getItemsData = async () => {
        try {
            const url = `/admin/get-po-items?poId=${poId}`
            const result = await get(url);
            const { success, data } = result
            if (success) {
                setItems(data);
                setProData(data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this product item?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Yes, delete it!'
        });
        if (confirm.isConfirmed) {
            try {
                const result = await deleteById(`/admin/delete-po-items`, id);
                const { success, message } = result;
                if (success) {
                    Swal.fire('Deleted!', message || 'Item has been deleted.', 'success');
                    setTriggerApi(prev => !prev);
                } else {
                    Swal.fire('Error!', message || 'Failed to delete item.', 'error');
                }
            } catch (error) {
                console.error(error);
                Swal.fire('Error!', 'Something went wrong.', 'error');
            }
        }
    }

    return (
        <div className='card'>
            <div className="card-header">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-2 align-items-center">
                        <h4 className="page-title">Product List</h4> {!poId && (
                            <span className="alert alert-warning">
                                Please save the Purchase Order before adding products.
                            </span>
                        )}
                    </div>
                    <div className="">
                        <button type='button' className='btn btn-outline-primary' onClick={modal.show} disabled={!poId}><i className="ti ti-square-rounded-plus me-2" /> Add Product  </button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                <div className=" custom-table table-responsive ">
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>Sr.</th>
                                <th>Product</th>
                                <th>Category</th>
                                <th>Company</th>
                                <th>Qty</th>
                                <th>Rate (₹)</th>
                                <th>Amt. (₹)</th>
                                <th>Dis. (%)</th>
                                <th>Dis Amt. (₹)</th>
                                <th>SP Dis. (%)</th>
                                <th>SP Dis. Amt. (₹)</th>
                                <th>Taxable Amt. (₹)</th>
                                <th>GST (%)</th>
                                <th>GST Amt. (₹)</th>
                                <th>Total (₹)</th>
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items && items.length > 0 ? (
                                items.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        {/* <td>{item.productName}</td> */}
                                        <td>
                                            <div>{item.productName || 'N/A'}</div>
                                            {item.poAutoRemarks && (
                                                <div className="text-muted small fst-italic">
                                                    {item.poAutoRemarks.length > 80
                                                        ? `${item.poAutoRemarks.slice(0, 80)}...`
                                                        : item.poAutoRemarks}
                                                </div>
                                            )}
                                            {item.poRemarks && (
                                                <div className="text-muted small fst-italic">
                                                    {item.poRemarks}
                                                </div>
                                            )}
                                        </td>
                                        <td>{item.categoryName}</td>
                                        <td>{item.companyName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.rate}</td>
                                        <td>{parseFloat(item.amount).toFixed(2)}</td>
                                        <td>{item.discount || 0}</td>
                                        <td>{parseFloat(item.discountAmount).toFixed(2)}</td>
                                        <td>{item.spDiscount || 0}</td>
                                        <td>{parseFloat(item.spDiscountAmount).toFixed(2)}</td>
                                        <td>{parseFloat(item.taxableAmount || 0).toFixed(2)}</td>
                                        <td>{item.gst || 0}</td>
                                        <td>{parseFloat(item.gstAmount).toFixed(2)}</td>
                                        <td>{parseFloat(item.totalAmount).toFixed(2)}</td>
                                        {/* <td className="text-end">
                                            <button type='button' className="btn btn-icon btn-soft-info rounded-pill list-action mb-2" onClick={() => {
                                                setEditId(item._id);
                                                modal.show();
                                            }}>
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                            <button type='button' className="btn btn-icon btn-soft-primary rounded-pill list-action" onClick={() => handleDelete(item._id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </td> */}
                                        <td style={{ textAlign: "end" }}>
                                            <div className="dropdown table-action">
                                                <a href="#" className="action-icon" data-bs-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-v" />
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <button type='button' className="dropdown-item" onClick={() => {
                                                        setEditId(item._id);
                                                        modal.show();
                                                    }}>
                                                        <i className="ti ti-edit text-blue" /> Edit
                                                    </button>
                                                    <button type='button' className="dropdown-item" onClick={() => handleDelete(item._id)}>
                                                        <i className="ti ti-trash text-danger" /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))) : (
                                <tr>
                                    <td colSpan="19">
                                        <div className="no-table-data">
                                            No Data Found!
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <PoProductModal
                modal={modal}
                poId={poId}
                editId={editId}
                setEditId={setEditId}
                companyId={companyId}
                setTriggerApi={setTriggerApi}
                shipTo={shipTo}
                selectedDePo={selectedDePo}
                dealerPoId={dealerPoId}
                setProData={setProData}
            />
        </div>
    )
}

export default PoProductsList