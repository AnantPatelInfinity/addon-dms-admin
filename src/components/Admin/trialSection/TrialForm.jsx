import moment from 'moment';
import { TrialStatus } from '../../../config/DataFile';

const TrialForm = ({ trial, errors, handleChange, checkList, setCheckList, data, setTrial }) => {

    const handleCheck = (e) => {
        const { name, checked } = e.target;
        setCheckList(prev => ({ ...prev, [name]: checked }));
        if (checked) {
            setTrial(prev => ({
                ...prev,
                startDate: ""
            }));
        }
    };

    return (
        <div className="mb-4">
            <h5 className="section-title mb-3 text-primary">Demo Unit Details</h5>
            <div className="row">
                <div className="col-12">
                    <div className="form-check form-switch mb-4">
                        <label className="form-check-label" htmlFor="isDocket">
                            Is Docket
                        </label>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            role="switch"
                            name="isDocket"
                            id="isDocket"
                            checked={checkList?.isDocket}
                            onChange={handleCheck}
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type='date'
                            className={`form-control ${errors.registerDate ? "is-invalid" : ""}`}
                            name="registerDate"
                            value={trial.registerDate}
                            onChange={handleChange}
                            min={moment().format("YYYY-MM-DD")}
                            max={moment().format("YYYY-MM-DD")}
                        />
                        <label>Register Date <span className="text-danger">*</span></label>
                        {errors.registerDate && <div className="invalid-feedback">{errors.registerDate}</div>}
                    </div>
                </div>
                {!checkList.isDocket && (
                    <>
                        <div className="col-lg-4 col-md-6 col-12">
                            <div className="form-floating mb-3">
                                <input
                                    type='date'
                                    className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                                    name="startDate"
                                    value={trial.startDate}
                                    onChange={handleChange}
                                    min={moment().format("YYYY-MM-DD")}
                                />
                                <label>Start Date <span className="text-danger">*</span></label>
                                {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
                            </div>
                        </div>
                    </>
                )}

                <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-floating mb-3">
                        <input
                            type='date'
                            className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                            name="endDate"
                            value={trial.endDate}
                            onChange={handleChange}
                            min={moment().format("YYYY-MM-DD")}
                        />
                        <label>End Date<span className="text-danger">*</span></label>
                        {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
                    </div>
                </div>

                {data &&
                    <div className="col-lg-4 col-md-6 col-12">
                        <div className="form-floating mb-3">
                            <select
                                className={`form-control form-select ${errors.status ? "is-invalid" : ""}`}
                                name="status"
                                value={trial.status}
                                onChange={handleChange}
                            >
                                <option>Select Status</option>
                                {TrialStatus.map((status, i) => (
                                    <option key={i} value={status.value} >{status.label}</option>
                                ))
                                }
                            </select>
                            <label>Status<span className="text-danger">*</span></label>
                            {errors.status && <div className="invalid-feedback">{errors.status}</div>}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default TrialForm